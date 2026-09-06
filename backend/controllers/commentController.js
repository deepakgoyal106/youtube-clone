import Comment from "../models/Comment.js";

// CREATE COMMENT
const createComment = (req, res) => {

    const videoId = req.params.videoId;
    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({
            message: "Comment text is required"
        });
    }

    const newComment = new Comment({
        text: text.trim(),
        video: videoId,
        user: req.user.userId
    });

    newComment.save()
        .then((comment) => {

            res.status(201).json({
                message: "Comment added successfully",
                comment: comment
            });

        })
        .catch((error) => {

            console.log("Error creating comment:", error);

            res.status(500).json({
                message: "Failed to add comment"
            });
        });
};


// GET COMMENTS FOR A VIDEO
const getComments = (req, res) => {

    const videoId = req.params.videoId;

    Comment.find({ video: videoId })
        .sort({ createdAt: -1 })
        .populate("user", "-password")
        .then((comments) => {

            res.status(200).json({
                comments: comments
            });

        })
        .catch((error) => {

            console.log("Error fetching comments:", error);

            res.status(500).json({
                message: "Failed to fetch comments"
            });
        });
};


// UPDATE COMMENT
const updateComment = (req, res) => {

    const commentId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({
            message: "Comment text is required"
        });
    }

    Comment.findById(commentId)
        .then((comment) => {

            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            }

            // Only the person who created the comment can edit it
            if (comment.user.toString() !== req.user.userId) {
                return res.status(403).json({
                    message:
                        "You are not allowed to edit this comment"
                });
            }

            comment.text = text.trim();

            return comment.save();
        })
        .then((updatedComment) => {

            if (updatedComment) {
                res.status(200).json({
                    message: "Comment updated successfully",
                    comment: updatedComment
                });
            }

        })
        .catch((error) => {

            console.log("Error updating comment:", error);

            res.status(500).json({
                message: "Failed to update comment"
            });
        });
};


// DELETE COMMENT
const deleteComment = (req, res) => {

    const commentId = req.params.id;

    Comment.findById(commentId)
        .then((comment) => {

            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            }

            // Only the person who created the comment can delete it
            if (comment.user.toString() !== req.user.userId) {
                return res.status(403).json({
                    message:
                        "You are not allowed to delete this comment"
                });
            }

            return Comment.findByIdAndDelete(commentId);
        })
        .then((deletedComment) => {

            if (deletedComment) {
                res.status(200).json({
                    message: "Comment deleted successfully"
                });
            }

        })
        .catch((error) => {

            console.log("Error deleting comment:", error);

            res.status(500).json({
                message: "Failed to delete comment"
            });
        });
};


export {
    getComments,
    updateComment,
    deleteComment
};

export default createComment;