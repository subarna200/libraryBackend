import { Router } from "express";
import {
  addBook,
  deleteBook,
  editBook,
  getAllBooks,
} from "../Controller/book.controller";

const router = Router();

router.get("/", getAllBooks);
router.post("/add", addBook);
router.post("/edit/:id", editBook);
router.delete("/delete/:id", deleteBook);

export default router;
