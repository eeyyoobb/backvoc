import express from "express";
import { addVideo, addView, getByTag, getVideo, random, search, sub, trend } from "../controllers/videoController.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// Create a video
router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, addVideo); // This should probably be for update, not add
router.delete("/:id", verifyToken, addVideo); // This should probably be for delete

// Get a specific video by ID
router.get("/find/:id", getVideo);

// Increase view count for a video
router.put("/view/:id", addView);

// Get trending videos
router.get("/trend", trend);

// Get random videos
router.get("/random", random);

// Get subscribed videos (assuming this is related to user subscriptions)
router.get("/sub", verifyToken, sub);

// Get videos by tags
router.get("/tags", getByTag);

// Search for videos
router.get("/search", search);

export default router;
