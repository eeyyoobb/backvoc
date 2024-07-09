import express from "express";
import {getAllBooks,addBook,getById,updateBook,deleteBook} from "../controllers/books-controller";

const router = express.Router();

router.get("/", getAllBooks);
router.post("/", addBook);
router.get("/:id", getById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
