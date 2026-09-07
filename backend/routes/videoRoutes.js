import express from "express";
import mongoose from "mongoose";

import createVideo, {
    getVideos,
    getVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
    getChannelVideos,
    incrementViews
} from "../controllers/videoController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ===============================
// ROUTE PARAMETER VALIDATION
// ===============================

// Validate video IDs before they reach the controllers.
router.param("id", (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid video ID"
        });
    }

    next();
});

// Validate channel IDs before querying MongoDB.
router.param("channelId", (req, res, next, channelId) => {
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        return res.status(400).json({
            message: "Invalid channel ID"
        });
    }

    next();
});


// ===============================
// VIDEO ROUTES
// ===============================

// Create a video - authentication required.
router.post("/", authMiddleware, createVideo);

// Get all videos - public route.
router.get("/", getVideos);

// Get videos belonging to a specific channel.
router.get("/channel/:channelId", getChannelVideos);

// Increment video views.
router.put("/:id/views", incrementViews);

// Get a single video.
router.get("/:id", getVideo);

// Update a video - authentication required.
router.put("/:id", authMiddleware, updateVideo);

// Delete a video - authentication required.
router.delete("/:id", authMiddleware, deleteVideo);

// Like a video - authentication required.
router.put("/:id/like", authMiddleware, likeVideo);

// Dislike a video - authentication required.
router.put("/:id/dislike", authMiddleware, dislikeVideo);

export default router;