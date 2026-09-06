import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Channel.css";

function Channel() {
    const navigate = useNavigate();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);

    const [editingVideoId, setEditingVideoId] = useState(null);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Entertainment");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    const [channelName, setChannelName] = useState("");
    const [channelDescription, setChannelDescription] = useState("");

    const [creatingChannel, setCreatingChannel] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

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

            // No channel yet
            if (
                error.response?.status === 404
            ) {
                setChannel(null);
                setError("");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load channel"
            );
        });
    }, []);

    const handleCreateChannel = () => {
        if (
            !channelName.trim() ||
            !channelDescription.trim()
        ) {
            setError(
                "Channel name and description are required"
            );
            return;
        }

        const token = localStorage.getItem("token");

        setCreatingChannel(true);
        setError("");
        setMessage("");

        axios.post(
            "http://localhost:5050/api/channels",
            {
                name: channelName.trim(),
                description: channelDescription.trim()
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
            setError(
                error.response?.data?.message ||
                "Failed to create channel"
            );
        })
        .finally(() => {
            setCreatingChannel(false);
        });
    };

    const handleDeleteVideo = (videoId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this video?"
        );

        if (!confirmDelete) {
            return;
        }

        const token = localStorage.getItem("token");

        axios.delete(
            `http://localhost:5050/api/videos/${videoId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(() => {
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
            setError(
                error.response?.data?.message ||
                "Failed to delete video"
            );
        });
    };

    const handleEditVideo = (video) => {
        setEditingVideoId(video._id);

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

    const handleUpdateVideo = (videoId) => {
        if (
            !title.trim() ||
            !category ||
            !description.trim() ||
            !videoUrl.trim() ||
            !thumbnailUrl.trim()
        ) {
            setError(
                "All video fields are required"
            );
            return;
        }

        const token = localStorage.getItem("token");

        axios.put(
            `http://localhost:5050/api/videos/${videoId}`,
            {
                title,
                category,
                description,
                videoUrl,
                thumbnailUrl
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
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
            setError(
                error.response?.data?.message ||
                "Failed to update video"
            );
        });
    };

    if (!channel && !error) {
        return (
            <div className="channel-page">

                <div className="create-channel-container">

                    <h1>Create Your Channel</h1>

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
                        />

                        {error && (
                            <div className="error-message">
                                {error}
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
                    <h1>{channel.name}</h1>

                    <p>
                        {channel.description}
                    </p>

                    <span>
                        {videos.length}{" "}
                        {videos.length === 1
                            ? "video"
                            : "videos"}
                    </span>
                </div>

            </div>

            <div className="channel-actions">

                <button
                    onClick={() =>
                        navigate("/upload")
                    }
                    className="upload-button"
                >
                    + Upload Video
                </button>

            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="channel-divider"></div>

            <h2 className="videos-heading">
                Videos
            </h2>

            {videos.length === 0 ? (
                <div className="no-videos">

                    <h3>No videos uploaded yet</h3>

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
                <div className="channel-video-grid">

                    {videos.map((video) => (

                        <div
                            key={video._id}
                            className="channel-video-card"
                        >

                            {editingVideoId ===
                            video._id ? (

                                /* EDIT FORM */
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
                                    />

                                    <label>
                                        Video URL
                                    </label>

                                    <input
                                        type="text"
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
                                        type="text"
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
                                        >
                                            Save Changes
                                        </button>

                                        <button
                                            className="cancel-button"
                                            onClick={
                                                handleCancelEdit
                                            }
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
                                        >
                                            Delete
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
