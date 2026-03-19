import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import borrowerRoutes from "./routes/borrower";
import { startLoanMonitor } from "./services/loanMonitor";
import aiRoutes from "./routes/ai";

dotenv.config();
connectDB();
startLoanMonitor();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/borrower", borrowerRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
