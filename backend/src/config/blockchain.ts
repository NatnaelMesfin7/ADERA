import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error("Missing CONTRACT_ADDRESS environment variable.");
}

if (!process.env.ORACLE_ADDRESS) {
  throw new Error("Missing ORACLE_ADDRESS environment variable.");
}

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  [
    "function loans(uint256 loanId) view returns (address borrower, address collateralAsset, address borrowAsset, uint256 principal, uint256 collateral, uint256 apr, uint256 startTime, bool active)",
  ],
  provider,
);

export const oracle = new ethers.Contract(
  process.env.ORACLE_ADDRESS,
  [
    "function getPrice(address asset) view returns (uint256)",
    "function getDecimals(address asset) view returns (uint8)",
  ],
  provider,
);
