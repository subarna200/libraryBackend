import { Router } from "express";
import userRouter from "./user.route";
import studentRouter from "./student.route";
import bookRouter from "./book.route";
import bookTransactionRouter from "./bookTransaction.route";
import fineBillingRouter from "./billing.route";
import { AuthenticateUser } from "../Middlewares/Authorization.middleware";

const router = Router();

router.use("/", userRouter);
router.use("/students", studentRouter);
router.use("/books", AuthenticateUser, bookRouter);
router.use("/books/transactions", AuthenticateUser, bookTransactionRouter);
router.use("/billings/fine", AuthenticateUser, fineBillingRouter);

export default router;
