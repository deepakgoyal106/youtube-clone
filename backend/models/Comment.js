import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    // Store the comment text after removing unnecessary spaces.
    text: {
        type: String,
        required: [true, "Comment text is required"],
        trim: true,
        maxlength: [500, "Comment cannot exceed 500 characters"]
    },

    // Reference the video that this comment belongs to.
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: [true, "Video reference is required"]
    },

    // Reference the user who created the comment.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"]
    }

}, {
    // Automatically store createdAt and updatedAt timestamps.
    timestamps: true
});

// Create the MongoDB Comment model from the schema.
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;