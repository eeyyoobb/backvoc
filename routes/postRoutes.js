import express from "express";

import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/postControllers";
import { authGuard,adminOrEditorGuard} from "../middleware/authMiddleware";
const router = express.Router();
router.route("/").post(authGuard, adminOrEditorGuard, createPost).get(getAllPosts);
router
  .route("/:slug")
  .put(authGuard, adminOrEditorGuard, updatePost)
  .delete(authGuard, adminOrEditorGuard , deletePost)
  .get(getPost);

export default router;
