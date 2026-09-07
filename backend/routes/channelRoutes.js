import express from "express";
import mongoose from "mongoose";

import createChannel, {
    getChannel,
    updateChannel,
    deleteChannel,
    getMyChannel
} from "../controllers/channelController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ROUTE PARAMETER VALIDATION
// ==========================================

// Validate channel ID before it reaches the controller.
// This prevents invalid MongoDB ObjectIds from causing errors.
router.param("id", (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid channel ID"
        });
    }

    next();
});

// ==========================================
// CHANNEL ROUTES
// ==========================================

// Create a new channel.
// Authentication is required.
router.post(
    "/",
    authMiddleware,
    createChannel
);

// Get the currently logged-in user's channel.
router.get(
    "/my-channel",
    authMiddleware,
    getMyChannel
);

// Get a channel by its ID.
router.get(
    "/:id",
    getChannel
);

// Update a channel.
// Authentication and ownership are checked in the controller.
router.put(
    "/:id",
    authMiddleware,
    updateChannel
);

// Delete a channel.
// Authentication and ownership are checked in the controller.
router.delete(
    "/:id",
    authMiddleware,
    deleteChannel
);

export default router;