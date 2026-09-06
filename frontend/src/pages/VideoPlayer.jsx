import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./VideoPlayer.css";

function VideoPlayer() {
    const { id } = useParams();

    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);

    const [commentText, setCommentText] = useState("");

    const [editingCommentId, setEditingCommentId] =
        useState(null);

    const [editingText, setEditingText] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const viewCountedId = useRef(null);

    // LOAD VIDEO
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
    useEffect(() => {
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
        });
    }, [id]);

    // LIKE
    const handleLike = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to like this video"
            );
            return;
        }

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
        });
    };

    // DISLIKE
    const handleDislike = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to dislike this video"
            );
            return;
        }

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
        });
    };

    // ADD COMMENT
    const handleAddComment = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to comment"
            );
            return;
        }

        if (!commentText.trim()) {
            setMessage(
                "Comment cannot be empty"
            );
            return;
        }

        axios.post(
            `http://localhost:5050/api/comments/video/${id}`,
            {
                text: commentText
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
        });
    };

    // START EDIT
    const handleEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditingText(comment.text);
        setMessage("");
    };

    // UPDATE COMMENT
    const handleUpdateComment = (commentId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to edit comment"
            );
            return;
        }

        if (!editingText.trim()) {
            setMessage(
                "Comment cannot be empty"
            );
            return;
        }

        axios.put(
            `http://localhost:5050/api/comments/${commentId}`,
            {
                text: editingText
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
        });
    };

    // DELETE COMMENT
    const handleDeleteComment = (commentId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please login to delete comment"
            );
            return;
        }

        axios.delete(
            `http://localhost:5050/api/comments/${commentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(() => {
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
        });
    };

    // CANCEL EDIT
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingText("");
    };

    if (!video && !error) {
        return (
            <div className="video-loading">
                Loading video...
            </div>
        );
    }

    if (error) {
        return (
            <div className="video-error">
                {error}
            </div>
        );
    }

    const channelName =
        video.channel?.name || "Unknown Channel";

    const avatarLetter =
        channelName.charAt(0).toUpperCase();

    return (
        <div className="video-player-page">

            {/* VIDEO */}

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

            {/* TITLE */}

            <h1 className="video-player-title">
                {video.title}
            </h1>

            {/* META */}

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

                <div className="video-reactions">

                    <button
                        className="reaction-button"
                        onClick={handleLike}
                    >
                        👍 {video.likes}
                    </button>

                    <button
                        className="reaction-button"
                        onClick={handleDislike}
                    >
                        👎 {video.dislikes}
                    </button>

                </div>

            </div>

            {/* MESSAGE */}

            {message && (
                <div className="video-message">
                    {message}
                </div>
            )}

            {/* DESCRIPTION */}

            <div className="video-description">
                <p>
                    {video.description}
                </p>
            </div>

            {/* COMMENTS */}

            <section className="comments-section">

                <h2>
                    Comments ({comments.length})
                </h2>

                <div className="comment-form">

                    <textarea
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) =>
                            setCommentText(
                                e.target.value
                            )
                        }
                    />

                    <button
                        className="comment-submit"
                        onClick={handleAddComment}
                    >
                        Comment
                    </button>

                </div>

                <div className="comment-list">

                    {comments.length === 0 ? (
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

                                    <div className="comment-avatar">
                                        {username
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="comment-content">

                                        <p className="comment-username">
                                            {username}
                                        </p>

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
                                                />

                                                <div className="comment-edit-buttons">

                                                    <button
                                                        className="comment-save-button"
                                                        onClick={() =>
                                                            handleUpdateComment(
                                                                comment._id
                                                            )
                                                        }
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        className="comment-cancel-button"
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            </div>

                                        ) : (

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