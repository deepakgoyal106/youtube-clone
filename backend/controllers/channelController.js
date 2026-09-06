import Channel from "../models/Channel.js";

const createChannel = (req, res) => {

    // Get channel information from request body
    const { name, description } = req.body;

    // Check required fields
    if (!name || !description) {
        return res.status(400).json({
            message: "Channel name and description are required"
        });
    }

    // Create channel using the logged-in user's ID
    const newChannel = new Channel({
        name: name,
        description: description,
        owner: req.user.userId
    });

    // Save channel to MongoDB
    newChannel.save()

        .then((channel) => {

            res.status(201).json({
                message: "Channel created successfully",
                channel: channel
            });

        })

        .catch((error) => {

            console.log("Error creating channel:", error);

            res.status(500).json({
                message: "Failed to create channel"
            });

        });
};

const getChannel = (req, res) => {

    // Get channel ID from the URL
    const channelId = req.params.id;

    // Find channel and get owner information
    Channel.findById(channelId)
        .populate("owner")

        .then((channel) => {

            // Channel not found
            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found"
                });
            }

            res.status(200).json({
                channel: channel
            });

        })

        .catch((error) => {

            console.log("Error fetching channel:", error);

            res.status(500).json({
                message: "Failed to fetch channel"
            });

        });
};
const updateChannel = (req, res) => {

    // Get channel ID from the URL
    const channelId = req.params.id;

    // Get updated information from request body
    const { name, description } = req.body;

    // Find the channel
    Channel.findById(channelId)

        .then((channel) => {

            // Channel does not exist
            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found"
                });
            }

            // Check if logged-in user owns this channel
            if (channel.owner.toString() !== req.user.userId) {
                return res.status(403).json({
                    message: "You are not allowed to edit this channel"
                });
            }

            // Update channel fields
            channel.name = name || channel.name;
            channel.description = description || channel.description;

            // Save changes
            return channel.save();
        })

        .then((updatedChannel) => {

            // Return updated channel
            if (updatedChannel) {
                res.status(200).json({
                    message: "Channel updated successfully",
                    channel: updatedChannel
                });
            }
        })

        .catch((error) => {

            console.log("Error updating channel:", error);

            res.status(500).json({
                message: "Failed to update channel"
            });
        });
};

const deleteChannel = (req, res) => {

    // Get channel ID from the URL
    const channelId = req.params.id;

    // Find the channel
    Channel.findById(channelId)

        .then((channel) => {

            // Channel does not exist
            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found"
                });
            }

            // Check if logged-in user owns this channel
            if (channel.owner.toString() !== req.user.userId) {
                return res.status(403).json({
                    message: "You are not allowed to delete this channel"
                });
            }

            // Delete the channel
            return Channel.findByIdAndDelete(channelId);
        })

        .then((deletedChannel) => {

            if (deletedChannel) {
                res.status(200).json({
                    message: "Channel deleted successfully"
                });
            }
        })

        .catch((error) => {

            console.log("Error deleting channel:", error);

            res.status(500).json({
                message: "Failed to delete channel"
            });
        });
};
const getMyChannel = (req, res) => {

    Channel.findOne({ owner: req.user.userId })
        .then((channel) => {

            if (!channel) {
                return res.status(404).json({
                    message: "You have not created a channel yet"
                });
            }

            res.status(200).json({
                channel: channel
            });

        })
        .catch((error) => {

            console.log("Error fetching my channel:", error);

            res.status(500).json({
                message: "Failed to fetch channel"
            });

        });
};

export {
    getChannel,
    updateChannel,
    deleteChannel,
    getMyChannel
};

export default createChannel;