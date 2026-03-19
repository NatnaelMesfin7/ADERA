import { Router } from "express";
import { Borrower } from "../models/Borrower";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { walletAddress, email, loanId } = req.body;

    console.log("Registering borrower:", { walletAddress, email, loanId });

    if (!walletAddress || !email || !loanId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const borrower = await Borrower.create({
      walletAddress,
      email,
      loanId,
    });

    console.log("Borrower registered:", borrower);

    res.status(201).json(borrower);
  } catch (error) {
    console.error("Error registering borrower:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
