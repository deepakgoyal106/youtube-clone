import express from "express";
import createChannel, {
    getChannel,
    updateChannel,
    deleteChannel,
    getMyChannel
} from "../controllers/channelController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in users can create a channel
router.post("/", authMiddleware, createChannel);

router.get("/my-channel", authMiddleware, getMyChannel);

router.get("/:id", getChannel);

router.put("/:id", authMiddleware, updateChannel);

router.delete("/:id", authMiddleware, deleteChannel);

export default router;