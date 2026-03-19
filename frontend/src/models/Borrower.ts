import mongoose, { Schema, Document } from "mongoose";

export interface IBorrower extends Document {
  walletAddress: string;
  email: string;
  loanId: string;
  createdAt: Date;
  lastNotifiedHealthFactor?: number | null;
  lastNotifiedAt?: Date | null;
}

const BorrowerSchema = new Schema<IBorrower>({
  walletAddress: { type: String, required: true },
  email: { type: String, required: true },
  loanId: { type: String, required: true },
  lastNotifiedHealthFactor: { type: Number, default: null },
  lastNotifiedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const Borrower = mongoose.model<IBorrower>("Borrower", BorrowerSchema);
