import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

// Create a new channel for the authenticated user.
const createChannel = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Channel name and description are required"
            });
        }

        // Prevent a user from creating multiple channels.
        const existingChannel = await Channel.findOne({
            owner: req.user.userId
        });

        if (existingChannel) {
            return res.status(400).json({
                message: "You already have a channel"
            });
        }

        const channel = await Channel.create({
            name: name.trim(),
            description: description.trim(),
            owner: req.user.userId
        });

        res.status(201).json({
            message: "Channel created successfully",
            channel
        });
    } catch (error) {
        console.error("CREATE CHANNEL ERROR:", error);

        res.status(500).json({
            message: "Failed to create channel"
        });
    }
};

// Get a channel by its ID.
const getChannel = async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id)
            .populate("owner", "username email");

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        res.status(200).json({
            channel
        });
    } catch (error) {
        console.error("GET CHANNEL ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch channel"
        });
    }
};

// Get the channel belonging to the currently authenticated user.
const getMyChannel = async (req, res) => {
    try {
        const channel = await Channel.findOne({
            owner: req.user.userId
        });

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        res.status(200).json({
            channel
        });
    } catch (error) {
        console.error("GET MY CHANNEL ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch your channel"
        });
    }
};

// Update the authenticated user's channel.
const updateChannel = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                message: "Channel name and description are required"
            });
        }

        const channel = await Channel.findById(req.params.id);

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        // Ownership check prevents users from editing another user's channel.
        if (channel.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only update your own channel"
            });
        }

        channel.name = name.trim();
        channel.description = description.trim();

        await channel.save();

        res.status(200).json({
            message: "Channel updated successfully",
            channel
        });
    } catch (error) {
        console.error("UPDATE CHANNEL ERROR:", error);

        res.status(500).json({
            message: "Failed to update channel"
        });
    }
};

// Delete the authenticated user's channel and its videos.
const deleteChannel = async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        // Ownership check prevents users from deleting another user's channel.
        if (channel.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only delete your own channel"
            });
        }

        // Delete all videos connected to this channel first.
        // This prevents orphaned video documents from remaining in MongoDB.
        const deletedVideos = await Video.deleteMany({
            channel: channel._id
        });

        // Delete the channel after its related videos are removed.
        await Channel.findByIdAndDelete(channel._id);

        res.status(200).json({
            message: "Channel and its videos deleted successfully",
            deletedVideos: deletedVideos.deletedCount
        });
    } catch (error) {
        console.error("DELETE CHANNEL ERROR:", error);

        res.status(500).json({
            message: "Failed to delete channel"
        });
    }
};

export {
    getChannel,
    updateChannel,
    deleteChannel,
    getMyChannel
};

export default createChannel;