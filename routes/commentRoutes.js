import express from "express";

import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/commentControllers";
import { adminGuard, authGuard } from "../middleware/authMiddleware";
const router = express.Router();
router
  .route("/")
  .post(authGuard, createComment)
  .get(authGuard, adminGuard, getAllComments);
router
  .route("/:commentId")
  .put(authGuard, updateComment)
  .delete(authGuard, deleteComment);

export default router;
