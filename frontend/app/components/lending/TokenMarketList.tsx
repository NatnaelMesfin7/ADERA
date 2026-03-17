import { Button } from "app/components/ui/Button";
import type { LendingAction, LendingToken } from "@/types/lending";

type TokenMarketRow = LendingToken & {
  walletBalance: string;
  canBeCollateral: boolean;
  canBeBorrowed: boolean;
};

type TokenMarketListProps = {
  markets: TokenMarketRow[];
  busy: boolean;
  onAction: (action: LendingAction, token: LendingToken) => void;
};

const actionButtonClass = "min-w-[86px]";

export const TokenMarketList = ({
  markets,
  busy,
  onAction,
}: TokenMarketListProps) => {
  if (markets.length === 0) {
    return (
      <section className="card-flat px-4 py-5 text-sm text-slate-600">
        No token markets configured. Add assets in{" "}
        <code>NEXT_PUBLIC_SUPPORTED_TOKENS</code>.
      </section>
    );
  }

  return (
    <section className="card-flat p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="section-title text-slate-900">Token Markets</h3>
        <p className="subtle text-xs sm:text-sm">
          Choose a token row and open a pop-up action form.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-sky-200/60 bg-white/80">
        <table className="min-w-[760px] w-full border-collapse">
          <thead>
            <tr className="border-b border-sky-200/60 bg-sky-50/70">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.12em] text-slate-600">
                Token
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.12em] text-slate-600">
                Wallet
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.12em] text-slate-600">
                Can Be Collateral
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.12em] text-slate-600">
                Can Be Borrowed
              </th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-[0.12em] text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {markets.map((market, index) => (
              <tr
                key={market.address}
                className={index < markets.length - 1 ? "border-b border-sky-200/50" : ""}
              >
                <td className="px-4 py-4 align-middle">
                  <p className="text-sm font-semibold text-slate-900">
                    {market.symbol}
                  </p>
                  <p className="subtle max-w-[220px] truncate text-xs">{market.name}</p>
                </td>
                <td className="px-4 py-4 align-middle">
                  <p className="balance-text text-sm text-slate-900">
                    {market.walletBalance}
                  </p>
                </td>
                <td className="px-4 py-4 align-middle">
                  <span
                    className={
                      market.canBeCollateral
                        ? "inline-flex rounded-full border border-emerald-300/60 bg-emerald-200/60 px-2.5 py-1 text-xs text-emerald-800"
                        : "inline-flex rounded-full border border-sky-200/70 bg-white/80 px-2.5 py-1 text-xs text-slate-600"
                    }
                  >
                    {market.canBeCollateral ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-4 align-middle">
                  <span
                    className={
                      market.canBeBorrowed
                        ? "inline-flex rounded-full border border-sky-300/60 bg-sky-200/60 px-2.5 py-1 text-xs text-sky-800"
                        : "inline-flex rounded-full border border-sky-200/70 bg-white/80 px-2.5 py-1 text-xs text-slate-600"
                    }
                  >
                    {market.canBeBorrowed ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-4 align-middle">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      className={actionButtonClass}
                      disabled={busy}
                      onClick={() => onAction("deposit", market)}
                    >
                      Supply
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className={actionButtonClass}
                      disabled={busy}
                      onClick={() => onAction("borrow", market)}
                    >
                      Borrow
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
