import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({

    // Name displayed for the YouTube channel.
    name: {
        type: String,
        required: [true, "Channel name is required"],
        trim: true,
        minlength: [2, "Channel name must be at least 2 characters"],
        maxlength: [50, "Channel name cannot exceed 50 characters"]
    },

    // Description shown on the channel page.
    description: {
        type: String,
        required: [true, "Channel description is required"],
        trim: true,
        minlength: [5, "Channel description must be at least 5 characters"],
        maxlength: [500, "Channel description cannot exceed 500 characters"]
    },

    // Reference to the user who owns this channel.
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Channel owner is required"]
    }

}, {
    // Automatically store channel creation and update timestamps.
    timestamps: true
});

// Create the Channel model from the schema.
const Channel = mongoose.model("Channel", channelSchema);

export default Channel;