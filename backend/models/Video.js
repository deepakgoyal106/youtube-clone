import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    
    // Video title
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: "Entertainment"
    },

    // Video description
    description: {
        type: String,
        required: true
    },

    // URL of the actual video
    videoUrl: {
        type: String,
        required: true
    },

    // URL of the thumbnail
    thumbnailUrl: {
        type: String,
        required: true
    },

    // Channel this video belongs to
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },

    // User who uploaded the video
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Number of views
    views: {
        type: Number,
        default: 0
    },

    // Number of likes
    likes: {
        type: Number,
        default: 0
    },

    // Number of dislikes
    dislikes: {
        type: Number,
        default: 0
    },

    // Date when video was uploaded
    uploadDate: {
        type: Date,
        default: Date.now
    }

});

const Video = mongoose.model("Video", videoSchema);

export default Video;