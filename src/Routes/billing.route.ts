import { Router } from "express";
import {
  createReceipt,
  deleteTransaction,
  editTransaction,
  getAllTransactions,
  getStudentTransaction,
} from "../Controller/billing.controller";

const router = Router();

router.get("/", getAllTransactions);
router.post("/view", getStudentTransaction);
router.post("/add", createReceipt);
router.post("/edit/:id", editTransaction);
router.delete("/delete/:id", deleteTransaction);

export default router;
