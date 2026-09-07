import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./VideoPlayer.css";

function VideoPlayer() {
    const { id } = useParams();

    // Store the selected video's details and its comments.
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);

    // Store the new comment entered by the logged-in user.
    const [commentText, setCommentText] = useState("");

    // Track which comment is currently being edited.
    const [editingCommentId, setEditingCommentId] =
        useState(null);

    const [editingText, setEditingText] = useState("");

    // Display API errors and user feedback messages.
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Track loading states to prevent duplicate actions.
    const [commentsLoading, setCommentsLoading] =
        useState(true);

    const [commentSubmitting, setCommentSubmitting] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    // Prevent the same video view from being counted more than once
    // during the current component lifecycle.
    const viewCountedId = useRef(null);

    // LOAD VIDEO
    // Fetch the selected video's information from the backend.
    useEffect(() => {
        setVideo(null);
        setError("");

        axios.get(
            `http://localhost:5050/api/videos/${id}`
        )
        .then((response) => {
            setVideo(response.data.video);
        })
        .catch((error) => {
            console.log(
                "VIDEO ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to load video"
            );
        });
    }, [id]);

    // INCREMENT VIEWS
    // Increase the video's view count when the video page is opened.
    useEffect(() => {
        if (viewCountedId.current === id) {
            return;
        }

        viewCountedId.current = id;

        axios.put(
            `http://localhost:5050/api/videos/${id}/views`
        )
        .then((response) => {
            setVideo((previousVideo) => {
                if (!previousVideo) {
                    return previousVideo;
                }

                return {
                    ...previousVideo,
                    views: response.data.views
                };
            });
        })
        .catch((error) => {
            console.log(
                "VIEW ERROR:",
                error.response?.data
            );
        });
    }, [id]);

    // LOAD COMMENTS
    // Comments are stored in MongoDB and fetched for the selected video.
    useEffect(() => {
        setCommentsLoading(true);

        axios.get(
            `http://localhost:5050/api/comments/video/${id}`
        )
        .then((response) => {
            setComments(response.data.comments);
        })
        .catch((error) => {
            console.log(
                "COMMENTS ERROR:",
                error.response?.data
            );

            setMessage(
                "Failed to load comments"
            );
        })
        .finally(() => {
            setCommentsLoading(false);
        });
    }, [id]);

    // LIKE VIDEO
    // Only authenticated users are allowed to like a video.
    const handleLike = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to like this video"
            );
            return;
        }

        setActionLoading(true);

        axios.put(
            `http://localhost:5050/api/videos/${id}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            setVideo((previousVideo) => ({
                ...previousVideo,
                likes: response.data.likes,
                dislikes: response.data.dislikes
            }));

            setMessage("Video liked 👍");
        })
        .catch((error) => {
            setMessage(
                error.response?.data?.message ||
                "Failed to like video"
            );
        })
        .finally(() => {
            setActionLoading(false);
        });
    };

    // DISLIKE VIDEO
    // Only authenticated users are allowed to dislike a video.
    const handleDislike = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to dislike this video"
            );
            return;
        }

        setActionLoading(true);

        axios.put(
            `http://localhost:5050/api/videos/${id}/dislike`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            setVideo((previousVideo) => ({
                ...previousVideo,
                likes: response.data.likes,
                dislikes: response.data.dislikes
            }));

            setMessage("Video disliked 👎");
        })
        .catch((error) => {
            setMessage(
                error.response?.data?.message ||
                "Failed to dislike video"
            );
        })
        .finally(() => {
            setActionLoading(false);
        });
    };

    // ADD COMMENT
    // Create a new comment and immediately add it to the local comment list.
    const handleAddComment = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to comment"
            );
            return;
        }

        const cleanComment = commentText.trim();

        if (!cleanComment) {
            setMessage(
                "Comment cannot be empty"
            );
            return;
        }

        setCommentSubmitting(true);

        axios.post(
            `http://localhost:5050/api/comments/video/${id}`,
            {
                text: cleanComment
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            setComments((previousComments) => [
                response.data.comment,
                ...previousComments
            ]);

            setCommentText("");

            setMessage(
                "Comment added successfully"
            );
        })
        .catch((error) => {
            setMessage(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        })
        .finally(() => {
            setCommentSubmitting(false);
        });
    };

    // START COMMENT EDIT
    // Populate the edit form with the selected comment's existing text.
    const handleEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditingText(comment.text);
        setMessage("");
    };

    // UPDATE COMMENT
    // Send the edited comment to the backend and update the UI.
    const handleUpdateComment = (commentId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to edit comment"
            );
            return;
        }

        const cleanText = editingText.trim();

        if (!cleanText) {
            setMessage(
                "Comment cannot be empty"
            );
            return;
        }

        setCommentSubmitting(true);

        axios.put(
            `http://localhost:5050/api/comments/${commentId}`,
            {
                text: cleanText
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            setComments((previousComments) =>
                previousComments.map((comment) =>
                    comment._id === commentId
                        ? response.data.comment
                        : comment
                )
            );

            setEditingCommentId(null);
            setEditingText("");

            setMessage(
                "Comment updated successfully"
            );
        })
        .catch((error) => {
            setMessage(
                error.response?.data?.message ||
                "Failed to edit comment"
            );
        })
        .finally(() => {
            setCommentSubmitting(false);
        });
    };

    // DELETE COMMENT
    // Ask for confirmation before permanently deleting a comment.
    const handleDeleteComment = (commentId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to delete comment"
            );
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmDelete) {
            return;
        }

        setCommentSubmitting(true);

        axios.delete(
            `http://localhost:5050/api/comments/${commentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(() => {
            // Remove the deleted comment from the current UI.
            setComments((previousComments) =>
                previousComments.filter(
                    (comment) =>
                        comment._id !== commentId
                )
            );

            setMessage(
                "Comment deleted successfully"
            );
        })
        .catch((error) => {
            setMessage(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        })
        .finally(() => {
            setCommentSubmitting(false);
        });
    };

    // CANCEL COMMENT EDIT
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingText("");
    };

    // Show a loading message while the video is being fetched.
    if (!video && !error) {
        return (
            <div className="video-loading">
                Loading video...
            </div>
        );
    }

    // Show a friendly error when the video cannot be loaded.
    if (error) {
        return (
            <div className="video-error">
                {error}
            </div>
        );
    }

    const channelName =
        video.channel?.name || "Unknown Channel";

    // Use the first letter of the channel name as a simple avatar.
    const avatarLetter =
        channelName.charAt(0).toUpperCase();

    return (
        <div className="video-player-page">

            {/* VIDEO PLAYER */}
            <div className="video-player-wrapper">

                <video
                    className="video-player"
                    controls
                    src={video.videoUrl}
                >
                    Your browser does not support
                    video playback.
                </video>

            </div>

            {/* VIDEO TITLE */}
            <h1 className="video-player-title">
                {video.title}
            </h1>

            {/* CHANNEL AND VIDEO STATISTICS */}
            <div className="video-meta">

                <div className="video-channel-info">

                    <div className="video-channel-avatar">
                        {avatarLetter}
                    </div>

                    <div className="video-channel-text">

                        <span className="video-channel-name">
                            {channelName}
                        </span>

                        <span className="video-view-count">
                            {video.views} views
                        </span>

                    </div>

                </div>

                {/* LIKE / DISLIKE CONTROLS */}
                <div className="video-reactions">

                    <button
                        className="reaction-button"
                        onClick={handleLike}
                        disabled={actionLoading}
                    >
                        👍 {video.likes}
                    </button>

                    <button
                        className="reaction-button"
                        onClick={handleDislike}
                        disabled={actionLoading}
                    >
                        👎 {video.dislikes}
                    </button>

                </div>

            </div>

            {/* USER FEEDBACK MESSAGE */}
            {message && (
                <div className="video-message">
                    {message}
                </div>
            )}

            {/* VIDEO DESCRIPTION */}
            <div className="video-description">

                <p>
                    {video.description}
                </p>

            </div>

            {/* COMMENTS SECTION */}
            <section className="comments-section">

                <h2>
                    Comments ({comments.length})
                </h2>

                {/* NEW COMMENT FORM */}
                <div className="comment-form">

                    <textarea
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) =>
                            setCommentText(
                                e.target.value
                            )
                        }
                        maxLength={500}
                    />

                    <button
                        className="comment-submit"
                        onClick={handleAddComment}
                        disabled={commentSubmitting}
                    >
                        {commentSubmitting
                            ? "Posting..."
                            : "Comment"}
                    </button>

                </div>

                {/* COMMENT LIST */}
                <div className="comment-list">

                    {commentsLoading ? (

                        <div className="no-comments">
                            Loading comments...
                        </div>

                    ) : comments.length === 0 ? (

                        <div className="no-comments">
                            No comments yet.
                        </div>

                    ) : (

                        comments.map((comment) => {

                            const username =
                                comment.user?.username ||
                                "User";

                            return (
                                <div
                                    key={comment._id}
                                    className="comment-item"
                                >

                                    {/* COMMENT USER AVATAR */}
                                    <div className="comment-avatar">
                                        {username
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="comment-content">

                                        <p className="comment-username">
                                            {username}
                                        </p>

                                        {/* EDIT MODE */}
                                        {editingCommentId ===
                                        comment._id ? (

                                            <div className="comment-edit-area">

                                                <textarea
                                                    value={
                                                        editingText
                                                    }
                                                    onChange={(e) =>
                                                        setEditingText(
                                                            e.target.value
                                                        )
                                                    }
                                                    maxLength={500}
                                                />

                                                <div className="comment-edit-buttons">

                                                    <button
                                                        className="comment-save-button"
                                                        onClick={() =>
                                                            handleUpdateComment(
                                                                comment._id
                                                            )
                                                        }
                                                        disabled={
                                                            commentSubmitting
                                                        }
                                                    >
                                                        {commentSubmitting
                                                            ? "Saving..."
                                                            : "Save"}
                                                    </button>

                                                    <button
                                                        className="comment-cancel-button"
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                        disabled={
                                                            commentSubmitting
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            </div>

                                        ) : (

                                            /* NORMAL COMMENT DISPLAY */
                                            <>
                                                <p className="comment-text">
                                                    {comment.text}
                                                </p>

                                                <div className="comment-actions">

                                                    <button
                                                        className="comment-action-button"
                                                        onClick={() =>
                                                            handleEditComment(
                                                                comment
                                                            )
                                                        }
                                                        disabled={
                                                            commentSubmitting
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="comment-action-button"
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                comment._id
                                                            )
                                                        }
                                                        disabled={
                                                            commentSubmitting
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </>

                                        )}

                                    </div>

                                </div>
                            );
                        })

                    )}

                </div>

            </section>

        </div>
    );
}

export default VideoPlayer;