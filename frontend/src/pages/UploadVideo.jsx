import { useEffect, useState } from "react";
import axios from "axios";

import "./UploadVideo.css";

function UploadVideo() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Entertainment");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");

    const [channel, setChannel] = useState(null);
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
            setChannel(response.data.channel);
        })
        .catch((error) => {
            console.log(
                "CHANNEL ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to load channel"
            );
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (
            !title.trim() ||
            !category ||
            !description.trim() ||
            !videoUrl.trim() ||
            !thumbnailUrl.trim()
        ) {
            setError("Please fill in all fields");
            return;
        }

        const token = localStorage.getItem("token");

        axios.post(
            "http://localhost:5050/api/videos",
            {
                title,
                category,
                description,
                videoUrl,
                thumbnailUrl,
                channelId: channel._id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            console.log(
                "VIDEO CREATED:",
                response.data
            );

            setMessage(
                "Video uploaded successfully!"
            );

            setTitle("");
            setCategory("Entertainment");
            setDescription("");
            setVideoUrl("");
            setThumbnailUrl("");
        })
        .catch((error) => {
            console.log(
                "UPLOAD ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to upload video"
            );
        });
    };

    return (
        <div className="upload-page">

            <div className="upload-container">

                <div className="upload-header">
                    <h1>Upload Video</h1>

                    <p>
                        Share a new video on your channel
                    </p>
                </div>

                {error && (
                    <div className="upload-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="upload-success">
                        {message}
                    </div>
                )}

                {channel && (
                    <div className="upload-channel">
                        <div className="upload-channel-avatar">
                            {channel.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <span>Uploading to</span>

                            <strong>
                                {channel.name}
                            </strong>
                        </div>
                    </div>
                )}

                {!channel && !error && (
                    <div className="upload-loading">
                        Loading channel...
                    </div>
                )}

                {channel && (
                    <form
                        className="upload-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">
                            <label>
                                Video Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your video title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="form-group">
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
                        </div>

                        <div className="form-group">
                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Tell viewers about your video"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Video URL
                            </label>

                            <input
                                type="text"
                                placeholder="https://example.com/video.mp4"
                                value={videoUrl}
                                onChange={(e) =>
                                    setVideoUrl(
                                        e.target.value
                                    )
                                }
                            />

                            <small>
                                Enter the URL of your video file.
                            </small>
                        </div>

                        <div className="form-group">
                            <label>
                                Thumbnail URL
                            </label>

                            <input
                                type="text"
                                placeholder="https://example.com/thumbnail.jpg"
                                value={thumbnailUrl}
                                onChange={(e) =>
                                    setThumbnailUrl(
                                        e.target.value
                                    )
                                }
                            />

                            <small>
                                Enter the URL of your video thumbnail.
                            </small>
                        </div>

                        <div className="upload-actions">
                            <button
                                type="submit"
                                className="upload-submit-button"
                            >
                                Upload Video
                            </button>
                        </div>

                    </form>
                )}

            </div>

        </div>
    );
}

export default UploadVideo;