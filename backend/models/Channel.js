import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({

    // Name of the YouTube channel
    name: {
        type: String,
        required: true
    },

    // Channel description
    description: {
        type: String,
        required: true
    },

    // User who owns this channel
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;