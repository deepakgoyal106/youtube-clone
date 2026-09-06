import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    // The actual comment text
    text: {
        type: String,
        required: true
    },

    // The video this comment belongs to
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },

    // The user who wrote the comment
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;