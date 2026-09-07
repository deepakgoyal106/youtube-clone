import Comment from "../models/Comment.js";

// CREATE COMMENT
const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const videoId = req.params.videoId;

        // Prevent empty comments from being stored in MongoDB.
        if (!text?.trim()) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        // Limit comment size so users cannot submit unnecessarily large text.
        if (text.trim().length > 500) {
            return res.status(400).json({
                message: "Comment cannot exceed 500 characters"
            });
        }

        const comment = await Comment.create({
            text: text.trim(),
            video: videoId,
            user: req.user.userId
        });

        // Populate the user so the frontend can immediately display
        // the username without making another API request.
        await comment.populate("user", "-password");

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });
    } catch (error) {
        console.error("CREATE COMMENT ERROR:", error);

        res.status(500).json({
            message: "Failed to add comment"
        });
    }
};


// GET COMMENTS FOR A VIDEO
const getComments = async (req, res) => {
    try {
        const videoId = req.params.videoId;

        // Return newest comments first and never expose user passwords.
        const comments = await Comment.find({
            video: videoId
        })
            .sort({ createdAt: -1 })
            .populate("user", "-password");

        res.status(200).json({
            comments
        });
    } catch (error) {
        console.error("GET COMMENTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch comments"
        });
    }
};


// UPDATE COMMENT
const updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { text } = req.body;

        // Validate the updated comment before querying MongoDB.
        if (!text?.trim()) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        if (text.trim().length > 500) {
            return res.status(400).json({
                message: "Comment cannot exceed 500 characters"
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Only the original author can edit their comment.
        if (comment.user.toString() !== req.user.userId) {
            return res.status(403).json({
                message:
                    "You are not allowed to edit this comment"
            });
        }

        comment.text = text.trim();

        const updatedComment = await comment.save();

        // Return the username along with the updated comment.
        await updatedComment.populate("user", "-password");

        res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment
        });
    } catch (error) {
        console.error("UPDATE COMMENT ERROR:", error);

        res.status(500).json({
            message: "Failed to update comment"
        });
    }
};


// DELETE COMMENT
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Only the original author can delete their comment.
        if (comment.user.toString() !== req.user.userId) {
            return res.status(403).json({
                message:
                    "You are not allowed to delete this comment"
            });
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error("DELETE COMMENT ERROR:", error);

        res.status(500).json({
            message: "Failed to delete comment"
        });
    }
};


// Export all comment controller functions for the comment routes.
export {
    getComments,
    updateComment,
    deleteComment
};

export default createComment;