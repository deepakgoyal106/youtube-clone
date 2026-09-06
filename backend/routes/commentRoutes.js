import express from "express";

import createComment, {
    getComments,
    updateComment,
    deleteComment
} from "../controllers/commentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get comments for a video
router.get("/video/:videoId", getComments);

// Add comment
router.post("/video/:videoId", authMiddleware, createComment);

// Edit comment
router.put("/:id", authMiddleware, updateComment);

// Delete comment
router.delete("/:id", authMiddleware, deleteComment);

export default router;