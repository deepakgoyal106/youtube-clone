import express from "express";

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

router.post("/", authMiddleware, createVideo);

router.get("/", getVideos);

router.get("/channel/:channelId", getChannelVideos);

router.put("/:id/views", incrementViews);

router.get("/:id", getVideo);

router.put("/:id", authMiddleware, updateVideo);

router.delete("/:id", authMiddleware, deleteVideo);

router.put("/:id/like", authMiddleware, likeVideo);

router.put("/:id/dislike", authMiddleware, dislikeVideo);

export default router;