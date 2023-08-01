import { Router } from "express";
import {
  deleteTransaction,
  editTransaction,
  getAllTransactions,
  getStudentTransaction,
  issueBook,
  requestBook,
} from "../Controller/bookTransaction.controller";

const router = Router();

router.get("/", getAllTransactions);
router.post("/view", getStudentTransaction);
router.post("/issue", issueBook);
router.post("/request", requestBook);
router.post("/edit/:id", editTransaction);
router.delete("/delete/:id", deleteTransaction);

export default router;
