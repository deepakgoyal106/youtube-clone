import express from "express";
import mongoose from "mongoose";

import createComment, {
    getComments,
    updateComment,
    deleteComment
} from "../controllers/commentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ROUTE PARAMETER VALIDATION
// ==========================================

// Validate videoId before querying MongoDB.
// This prevents invalid IDs from reaching the controller.
router.param("videoId", (req, res, next, videoId) => {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({
            message: "Invalid video ID"
        });
    }

    next();
});

// Validate comment ID before querying MongoDB.
router.param("id", (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid comment ID"
        });
    }

    next();
});

// ==========================================
// COMMENT ROUTES
// ==========================================

// Get all comments for a video.
router.get("/video/:videoId", getComments);

// Create a comment.
// Authentication is required.
router.post(
    "/video/:videoId",
    authMiddleware,
    createComment
);

// Update an existing comment.
// Authentication and ownership are checked.
router.put(
    "/:id",
    authMiddleware,
    updateComment
);

// Delete an existing comment.
// Authentication and ownership are checked.
router.delete(
    "/:id",
    authMiddleware,
    deleteComment
);

export default router;