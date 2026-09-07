import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({

    // Video title displayed on cards and the video player.
    title: {
        type: String,
        required: [true, "Video title is required"],
        trim: true,
        minlength: [2, "Video title must be at least 2 characters"],
        maxlength: [150, "Video title cannot exceed 150 characters"]
    },

    // Category used by the Home page filter.
    category: {
        type: String,
        required: [true, "Video category is required"],
        trim: true,
        default: "Entertainment"
    },

    // Detailed description displayed on the video player page.
    description: {
        type: String,
        required: [true, "Video description is required"],
        trim: true,
        minlength: [5, "Video description must be at least 5 characters"],
        maxlength: [2000, "Video description cannot exceed 2000 characters"]
    },

    // URL of the video file or playable video resource.
    videoUrl: {
        type: String,
        required: [true, "Video URL is required"],
        trim: true
    },

    // URL used to display the video's thumbnail.
    thumbnailUrl: {
        type: String,
        required: [true, "Thumbnail URL is required"],
        trim: true
    },

    // Reference to the channel that owns the video.
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: [true, "Channel reference is required"]
    },

    // Reference to the user who uploaded the video.
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Uploader reference is required"]
    },

    // Number of video views.
    views: {
        type: Number,
        default: 0,
        min: [0, "Views cannot be negative"]
    },

    // Number of likes.
    likes: {
        type: Number,
        default: 0,
        min: [0, "Likes cannot be negative"]
    },

    // Number of dislikes.
    dislikes: {
        type: Number,
        default: 0,
        min: [0, "Dislikes cannot be negative"]
    },

    // Date and time when the video was uploaded.
    uploadDate: {
        type: Date,
        default: Date.now
    }

}, {
    // Automatically track when the video document is created or updated.
    timestamps: true
});

// Create the Video model from the schema.
const Video = mongoose.model("Video", videoSchema);

export default Video;