import express from "express";

import {
  createPostCategory,
  deletePostCategory,
  getAllPostCategories,
  updatePostCategory,
  getSingleCategory,
} from "../controllers/postCategoriesController";
import { adminOrEditorGuard, authGuard } from "../middleware/authMiddleware";
const router = express.Router();
router
  .route("/")
  .post(authGuard, adminOrEditorGuard, createPostCategory)
  .get(getAllPostCategories);

router
  .route("/:postCategoryId")
  .get(getSingleCategory)
  .put(authGuard, adminOrEditorGuard, updatePostCategory)
  .delete(authGuard, adminOrEditorGuard, deletePostCategory);

export default router;
