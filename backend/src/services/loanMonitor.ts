import cron from "node-cron";
import { ethers } from "ethers";
import { Borrower } from "../models/Borrower";
import { contract, oracle } from "../config/blockchain";
import { sendWarningEmail } from "./email";

const APR_BPS_BASE = 10_000n;
const YEAR_IN_SECONDS = 365n * 24n * 60n * 60n;
const HEALTH_FACTOR_SCALE = 10n ** 18n;
const HEALTH_FACTOR_WARNING_THRESHOLD = 1.2;
const HEALTH_FACTOR_DROP_THRESHOLD = 0.1;
const NOTIFICATION_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const FLOAT_EPSILON = 1e-9;

type LoanData = {
  borrower: string;
  collateralAsset: string;
  borrowAsset: string;
  principal: bigint;
  collateral: bigint;
  apr: bigint;
  startTime: bigint;
  active: boolean;
};

const toScale = (decimalsRaw: bigint): bigint => {
  return 10n ** decimalsRaw;
};

const nowInSeconds = (): bigint => {
  return BigInt(Math.floor(Date.now() / 1000));
};

const calculateDebt = (
  principal: bigint,
  aprBps: bigint,
  startTime: bigint,
): bigint => {
  if (principal <= 0n) {
    return 0n;
  }

  const currentTime = nowInSeconds();
  const elapsedSeconds = currentTime > startTime ? currentTime - startTime : 0n;
  const accruedInterest =
    (principal * aprBps * elapsedSeconds) / (APR_BPS_BASE * YEAR_IN_SECONDS);

  return principal + accruedInterest;
};

const toHealthFactorNumber = (healthFactorScaled: bigint): number => {
  const parsed = Number(ethers.formatUnits(healthFactorScaled, 18));

  if (!Number.isFinite(parsed)) {
    throw new Error(
      `Invalid health factor value: ${healthFactorScaled.toString()}`,
    );
  }

  return parsed;
};

const calculateHealthFactor = async (loan: LoanData): Promise<number> => {
  if (loan.collateral <= 0n) {
    return 0;
  }

  const debt = calculateDebt(loan.principal, loan.apr, loan.startTime);
  if (debt <= 0n) {
    return Number.POSITIVE_INFINITY;
  }

  const [
    collateralPriceRaw,
    borrowPriceRaw,
    collateralDecimalsRaw,
    borrowDecimalsRaw,
  ] = await Promise.all([
    oracle.getPrice(loan.collateralAsset) as Promise<bigint>,
    oracle.getPrice(loan.borrowAsset) as Promise<bigint>,
    oracle.getDecimals(loan.collateralAsset) as Promise<bigint>,
    oracle.getDecimals(loan.borrowAsset) as Promise<bigint>,
  ]);

  const collateralPrice = BigInt(collateralPriceRaw);
  const borrowPrice = BigInt(borrowPriceRaw);
  const collateralScale = toScale(BigInt(collateralDecimalsRaw));
  const borrowScale = toScale(BigInt(borrowDecimalsRaw));

  if (borrowPrice <= 0n || collateralPrice <= 0n) {
    throw new Error(
      `Invalid oracle price. collateralPrice=${collateralPrice.toString()} borrowPrice=${borrowPrice.toString()}`,
    );
  }

  const numerator =
    loan.collateral * collateralPrice * borrowScale * HEALTH_FACTOR_SCALE;
  const denominator = debt * borrowPrice * collateralScale;

  if (denominator <= 0n) {
    throw new Error(
      `Invalid health factor denominator: ${denominator.toString()}`,
    );
  }

  const healthFactorScaled = numerator / denominator;
  return toHealthFactorNumber(healthFactorScaled);
};

const shouldNotify = (
  healthFactor: number,
  lastNotifiedHealthFactor?: number | null,
  lastNotifiedAt?: Date | null,
): boolean => {
  if (lastNotifiedHealthFactor == null) {
    return true;
  }

  const droppedByThreshold =
    lastNotifiedHealthFactor - healthFactor >=
    HEALTH_FACTOR_DROP_THRESHOLD - FLOAT_EPSILON;

  const staleNotification =
    lastNotifiedAt != null &&
    Date.now() - lastNotifiedAt.getTime() >= NOTIFICATION_COOLDOWN_MS;

  return droppedByThreshold || staleNotification;
};

export const startLoanMonitor = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("[LoanMonitor] Checking loans...");

    try {
      const borrowers = await Borrower.find();

      for (const borrower of borrowers) {
        try {
          const loan = (await contract.loans(borrower.loanId)) as LoanData;

          if (!loan.active) {
            continue;
          }

          const healthFactor = await calculateHealthFactor(loan);

          if (healthFactor >= HEALTH_FACTOR_WARNING_THRESHOLD) {
            continue;
          }

          const notify = shouldNotify(
            healthFactor,
            borrower.lastNotifiedHealthFactor,
            borrower.lastNotifiedAt,
          );

          if (!notify) {
            continue;
          }

          await sendWarningEmail(
            loan.principal,
            loan.borrowAsset,
            borrower.email,
            borrower.loanId,
            healthFactor,
          );

          borrower.lastNotifiedHealthFactor = healthFactor;
          borrower.lastNotifiedAt = new Date();
          await borrower.save();

          console.log(
            `[LoanMonitor] Warning email sent for loan ${borrower.loanId} (${borrower.email}) at health factor ${healthFactor.toFixed(4)}.`,
          );
        } catch (error) {
          console.error(
            `[LoanMonitor] Failed borrower check. loanId=${borrower.loanId} email=${borrower.email}`,
            error,
          );
        }
      }
    } catch (error) {
      console.error("[LoanMonitor] Cron cycle failed.", error);
    }
  });
};
