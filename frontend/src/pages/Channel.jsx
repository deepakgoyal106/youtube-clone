import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Channel.css";

function Channel() {
    const navigate = useNavigate();

    // Store the logged-in user's channel and its videos.
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);

    // Track which video is currently being edited.
    const [editingVideoId, setEditingVideoId] = useState(null);

    // Video form fields.
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Entertainment");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    // Create-channel form fields.
    const [channelName, setChannelName] = useState("");
    const [channelDescription, setChannelDescription] = useState("");

    // Channel editing state and form fields.
    const [editingChannel, setEditingChannel] = useState(false);
    const [editChannelName, setEditChannelName] = useState("");
    const [editChannelDescription, setEditChannelDescription] = useState("");

    // Loading states prevent duplicate actions and improve user feedback.
    const [loadingChannel, setLoadingChannel] = useState(true);
    const [creatingChannel, setCreatingChannel] = useState(false);
    const [updatingChannel, setUpdatingChannel] = useState(false);
    const [deletingChannel, setDeletingChannel] = useState(false);
    const [updatingVideo, setUpdatingVideo] = useState(false);
    const [deletingVideoId, setDeletingVideoId] = useState(null);

    // Display success and error messages.
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // LOAD CHANNEL
    // Fetch the logged-in user's channel and its videos from the backend.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoadingChannel(false);
            setError("Please login to access your channel");
            return;
        }

        axios.get(
            "http://localhost:5050/api/channels/my-channel",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            const myChannel = response.data.channel;

            setChannel(myChannel);

            // Once the channel is found, load all videos belonging to it.
            return axios.get(
                `http://localhost:5050/api/videos/channel/${myChannel._id}`
            );
        })
        .then((response) => {
            if (response) {
                setVideos(response.data.videos);
            }
        })
        .catch((error) => {
            console.log(
                "CHANNEL ERROR:",
                error.response?.data
            );

            // A 404 means the user has not created a channel yet.
            if (error.response?.status === 404) {
                setChannel(null);
                setError("");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load channel"
            );
        })
        .finally(() => {
            setLoadingChannel(false);
        });
    }, []);

    // URL VALIDATION
    // Used when editing a video's video and thumbnail URLs.
    const isValidUrl = (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    };

    // CREATE CHANNEL
    const handleCreateChannel = () => {
        const cleanName = channelName.trim();
        const cleanDescription = channelDescription.trim();

        if (!cleanName || !cleanDescription) {
            setError(
                "Channel name and description are required"
            );
            return;
        }

        if (cleanName.length < 3) {
            setError(
                "Channel name must be at least 3 characters"
            );
            return;
        }

        const token = localStorage.getItem("token");

        setCreatingChannel(true);
        setError("");
        setMessage("");

        // Send the new channel details to the protected backend endpoint.
        axios.post(
            "http://localhost:5050/api/channels",
            {
                name: cleanName,
                description: cleanDescription
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            setChannel(response.data.channel);
            setVideos([]);

            setChannelName("");
            setChannelDescription("");

            setMessage(
                "Channel created successfully"
            );
        })
        .catch((error) => {
            console.log(
                "CREATE CHANNEL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to create channel"
            );
        })
        .finally(() => {
            setCreatingChannel(false);
        });
    };

    // START EDITING CHANNEL
    const handleEditChannel = () => {
        setEditingChannel(true);

        // Pre-fill the edit form with existing channel information.
        setEditChannelName(channel.name);
        setEditChannelDescription(
            channel.description
        );

        setError("");
        setMessage("");
    };

    // CANCEL CHANNEL EDIT
    const handleCancelChannelEdit = () => {
        setEditingChannel(false);

        setEditChannelName("");
        setEditChannelDescription("");

        setError("");
        setMessage("");
    };

    // UPDATE CHANNEL
    const handleUpdateChannel = () => {
        const cleanName = editChannelName.trim();
        const cleanDescription = editChannelDescription.trim();

        if (!cleanName || !cleanDescription) {
            setError(
                "Channel name and description are required"
            );
            return;
        }

        if (cleanName.length < 3) {
            setError(
                "Channel name must be at least 3 characters"
            );
            return;
        }

        const token = localStorage.getItem("token");

        setUpdatingChannel(true);
        setError("");
        setMessage("");

        // Update only the authenticated user's channel.
        axios.put(
            `http://localhost:5050/api/channels/${channel._id}`,
            {
                name: cleanName,
                description: cleanDescription
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            setChannel(response.data.channel);

            setEditingChannel(false);

            setEditChannelName("");
            setEditChannelDescription("");

            setMessage(
                "Channel updated successfully"
            );

            setError("");
        })
        .catch((error) => {
            console.log(
                "UPDATE CHANNEL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to update channel"
            );
        })
        .finally(() => {
            setUpdatingChannel(false);
        });
    };

    // DELETE CHANNEL
    const handleDeleteChannel = () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your channel? This action cannot be undone."
        );

        if (!confirmDelete) {
            return;
        }

        const token = localStorage.getItem("token");

        setDeletingChannel(true);
        setError("");
        setMessage("");

        // Delete the channel through the protected backend endpoint.
        axios.delete(
            `http://localhost:5050/api/channels/${channel._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(() => {
            setChannel(null);
            setVideos([]);

            setEditingChannel(false);

            setMessage(
                "Channel deleted successfully. You can create a new channel."
            );

            setError("");
        })
        .catch((error) => {
            console.log(
                "DELETE CHANNEL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete channel"
            );
        })
        .finally(() => {
            setDeletingChannel(false);
        });
    };

    // DELETE VIDEO
    const handleDeleteVideo = (videoId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this video?"
        );

        if (!confirmDelete) {
            return;
        }

        const token = localStorage.getItem("token");

        setDeletingVideoId(videoId);
        setError("");
        setMessage("");

        // The backend verifies that the logged-in user owns the video.
        axios.delete(
            `http://localhost:5050/api/videos/${videoId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(() => {
            // Remove the deleted video from the current page immediately.
            setVideos((previousVideos) =>
                previousVideos.filter(
                    (video) => video._id !== videoId
                )
            );

            setMessage(
                "Video deleted successfully"
            );

            setError("");
        })
        .catch((error) => {
            console.log(
                "DELETE VIDEO ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete video"
            );
        })
        .finally(() => {
            setDeletingVideoId(null);
        });
    };

    // START EDITING VIDEO
    const handleEditVideo = (video) => {
        setEditingVideoId(video._id);

        // Populate the form with the video's current information.
        setTitle(video.title);
        setCategory(
            video.category || "Entertainment"
        );
        setDescription(video.description);
        setVideoUrl(video.videoUrl);
        setThumbnailUrl(video.thumbnailUrl);

        setError("");
        setMessage("");
    };

    // CANCEL VIDEO EDIT
    const handleCancelEdit = () => {
        setEditingVideoId(null);

        setTitle("");
        setCategory("Entertainment");
        setDescription("");
        setVideoUrl("");
        setThumbnailUrl("");

        setError("");
        setMessage("");
    };

    // UPDATE VIDEO
    const handleUpdateVideo = (videoId) => {
        const cleanTitle = title.trim();
        const cleanDescription = description.trim();
        const cleanVideoUrl = videoUrl.trim();
        const cleanThumbnailUrl = thumbnailUrl.trim();

        // Validate required fields before making the API request.
        if (
            !cleanTitle ||
            !category ||
            !cleanDescription ||
            !cleanVideoUrl ||
            !cleanThumbnailUrl
        ) {
            setError(
                "All video fields are required"
            );
            return;
        }

        if (!isValidUrl(cleanVideoUrl)) {
            setError(
                "Please enter a valid video URL"
            );
            return;
        }

        if (!isValidUrl(cleanThumbnailUrl)) {
            setError(
                "Please enter a valid thumbnail URL"
            );
            return;
        }

        const token = localStorage.getItem("token");

        setUpdatingVideo(true);
        setError("");
        setMessage("");

        // Update the selected video through the protected API.
        axios.put(
            `http://localhost:5050/api/videos/${videoId}`,
            {
                title: cleanTitle,
                category,
                description: cleanDescription,
                videoUrl: cleanVideoUrl,
                thumbnailUrl: cleanThumbnailUrl
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            // Replace the old video with the updated version in local state.
            setVideos((previousVideos) =>
                previousVideos.map((video) =>
                    video._id === videoId
                        ? response.data.video
                        : video
                )
            );

            setEditingVideoId(null);

            setTitle("");
            setCategory("Entertainment");
            setDescription("");
            setVideoUrl("");
            setThumbnailUrl("");

            setMessage(
                "Video updated successfully"
            );

            setError("");
        })
        .catch((error) => {
            console.log(
                "UPDATE VIDEO ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to update video"
            );
        })
        .finally(() => {
            setUpdatingVideo(false);
        });
    };

    // INITIAL LOADING SCREEN
    if (loadingChannel) {
        return (
            <div className="channel-error">
                <p>Loading your channel...</p>
            </div>
        );
    }

    // CREATE CHANNEL SCREEN
    if (!channel && !error) {
        return (
            <div className="channel-page">

                <div className="create-channel-container">

                    <h1>
                        Create Your Channel
                    </h1>

                    <p>
                        Create a channel to upload and
                        manage your videos.
                    </p>

                    <div className="create-channel-form">

                        <label>
                            Channel Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter channel name"
                            value={channelName}
                            onChange={(e) =>
                                setChannelName(
                                    e.target.value
                                )
                            }
                            maxLength={50}
                        />

                        <label>
                            Channel Description
                        </label>

                        <textarea
                            placeholder="Tell viewers about your channel"
                            value={channelDescription}
                            onChange={(e) =>
                                setChannelDescription(
                                    e.target.value
                                )
                            }
                            maxLength={500}
                        />

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        <button
                            className="create-channel-button"
                            onClick={handleCreateChannel}
                            disabled={creatingChannel}
                        >
                            {creatingChannel
                                ? "Creating..."
                                : "Create Channel"}
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // ERROR SCREEN
    if (error && !channel) {
        return (
            <div className="channel-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="channel-page">

            {/* CHANNEL HEADER */}
            <div className="channel-header">

                <div className="channel-avatar">
                    {channel.name
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div className="channel-details">

                    {!editingChannel ? (
                        <>
                            <h1>
                                {channel.name}
                            </h1>

                            <p>
                                {channel.description}
                            </p>

                            <span>
                                {videos.length}{" "}
                                {videos.length === 1
                                    ? "video"
                                    : "videos"}
                            </span>
                        </>
                    ) : (

                        /* CHANNEL EDIT FORM */
                        <div className="channel-edit-form">

                            <h2>
                                Edit Channel
                            </h2>

                            <label>
                                Channel Name
                            </label>

                            <input
                                type="text"
                                value={editChannelName}
                                onChange={(e) =>
                                    setEditChannelName(
                                        e.target.value
                                    )
                                }
                                maxLength={50}
                            />

                            <label>
                                Channel Description
                            </label>

                            <textarea
                                value={
                                    editChannelDescription
                                }
                                onChange={(e) =>
                                    setEditChannelDescription(
                                        e.target.value
                                    )
                                }
                                maxLength={500}
                            />

                            <div className="channel-edit-buttons">

                                <button
                                    className="save-button"
                                    onClick={
                                        handleUpdateChannel
                                    }
                                    disabled={updatingChannel}
                                >
                                    {updatingChannel
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    className="cancel-button"
                                    onClick={
                                        handleCancelChannelEdit
                                    }
                                    disabled={updatingChannel}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </div>

            {/* CHANNEL ACTIONS */}
            {!editingChannel && (
                <div className="channel-actions">

                    <button
                        onClick={() =>
                            navigate("/upload")
                        }
                        className="upload-button"
                    >
                        + Upload Video
                    </button>

                    <button
                        onClick={handleEditChannel}
                        className="edit-channel-button"
                        disabled={deletingChannel}
                    >
                        ✏️ Edit Channel
                    </button>

                    <button
                        onClick={handleDeleteChannel}
                        className="delete-channel-button"
                        disabled={deletingChannel}
                    >
                        {deletingChannel
                            ? "Deleting..."
                            : "🗑️ Delete Channel"}
                    </button>

                </div>
            )}

            {/* SUCCESS MESSAGE */}
            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="channel-divider"></div>

            <h2 className="videos-heading">
                Videos
            </h2>

            {/* EMPTY CHANNEL STATE */}
            {videos.length === 0 ? (

                <div className="no-videos">

                    <h3>
                        No videos uploaded yet
                    </h3>

                    <p>
                        Upload your first video to
                        start building your channel.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/upload")
                        }
                        className="upload-button"
                    >
                        Upload Video
                    </button>

                </div>

            ) : (

                /* CHANNEL VIDEO GRID */
                <div className="channel-video-grid">

                    {videos.map((video) => (

                        <div
                            key={video._id}
                            className="channel-video-card"
                        >

                            {editingVideoId ===
                            video._id ? (

                                /* EDIT VIDEO FORM */
                                <div className="edit-video-form">

                                    <h3>
                                        Edit Video
                                    </h3>

                                    <label>
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(
                                                e.target.value
                                            )
                                        }
                                        maxLength={150}
                                    />

                                    <label>
                                        Category
                                    </label>

                                    <select
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Music">
                                            Music
                                        </option>

                                        <option value="Gaming">
                                            Gaming
                                        </option>

                                        <option value="Coding">
                                            Coding
                                        </option>

                                        <option value="Education">
                                            Education
                                        </option>

                                        <option value="Entertainment">
                                            Entertainment
                                        </option>

                                        <option value="Sports">
                                            Sports
                                        </option>

                                        <option value="Technology">
                                            Technology
                                        </option>
                                    </select>

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        maxLength={1000}
                                    />

                                    <label>
                                        Video URL
                                    </label>

                                    <input
                                        type="url"
                                        value={videoUrl}
                                        onChange={(e) =>
                                            setVideoUrl(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label>
                                        Thumbnail URL
                                    </label>

                                    <input
                                        type="url"
                                        value={thumbnailUrl}
                                        onChange={(e) =>
                                            setThumbnailUrl(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div className="edit-buttons">

                                        <button
                                            className="save-button"
                                            onClick={() =>
                                                handleUpdateVideo(
                                                    video._id
                                                )
                                            }
                                            disabled={updatingVideo}
                                        >
                                            {updatingVideo
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                        <button
                                            className="cancel-button"
                                            onClick={
                                                handleCancelEdit
                                            }
                                            disabled={updatingVideo}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            ) : (

                                /* VIDEO CARD */
                                <>

                                    <div
                                        className="channel-thumbnail-container"
                                        onClick={() =>
                                            navigate(
                                                `/video/${video._id}`
                                            )
                                        }
                                    >

                                        <img
                                            src={
                                                video.thumbnailUrl
                                            }
                                            alt={video.title}
                                            className="channel-thumbnail"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://placehold.co/400x225?text=Video";
                                            }}
                                        />

                                    </div>

                                    <div className="channel-video-info">

                                        <h3
                                            onClick={() =>
                                                navigate(
                                                    `/video/${video._id}`
                                                )
                                            }
                                        >
                                            {video.title}
                                        </h3>

                                        <p className="video-category">
                                            {video.category ||
                                                "Entertainment"}
                                        </p>

                                        <p className="video-stats">
                                            {video.views} views
                                        </p>

                                        <p className="video-description">
                                            {video.description}
                                        </p>

                                    </div>

                                    <div className="video-actions">

                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                handleEditVideo(
                                                    video
                                                )
                                            }
                                            disabled={
                                                deletingVideoId !==
                                                null
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteVideo(
                                                    video._id
                                                )
                                            }
                                            disabled={
                                                deletingVideoId !==
                                                null
                                            }
                                        >
                                            {deletingVideoId ===
                                            video._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>

                                </>
                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Channel;