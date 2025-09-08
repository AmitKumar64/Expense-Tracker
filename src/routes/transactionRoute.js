import express from "express";
import {
  addTransaction,
  deleteTransaction,
  getTransactionsByUserID,
  getTransactionSummaryByUserID,
} from "../controllers/transactionsControllers.js";
const router = express.Router();

router.get("/:userId", getTransactionsByUserID);
router.post("/", addTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getTransactionSummaryByUserID);

export default router;
