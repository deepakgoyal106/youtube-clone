import { useEffect, useState } from "react";
import axios from "axios";

import "./UploadVideo.css";

function UploadVideo() {
    const [title, setTitle] = useState("");
    const [category, setCategory] =
        useState("Entertainment");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] =
        useState("");

    const [channel, setChannel] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [uploading, setUploading] =
        useState(false);

    // Field-specific validation errors.
    const [fieldErrors, setFieldErrors] =
        useState({
            title: "",
            description: "",
            videoUrl: "",
            thumbnailUrl: ""
        });

    // ==========================================
    // LOAD MY CHANNEL
    // ==========================================

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            setError(
                "Please sign in before uploading a video"
            );
            return;
        }

        axios
            .get(
                "http://localhost:5050/api/channels/my-channel",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                setChannel(
                    response.data.channel
                );
            })
            .catch((error) => {
                console.error(
                    "CHANNEL ERROR:",
                    error.response?.data ||
                        error.message
                );

                setError(
                    error.response?.data
                        ?.message ||
                        "Failed to load channel"
                );
            });
    }, []);

    // ==========================================
    // URL VALIDATION
    // ==========================================

    const isValidUrl = (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    };

    // ==========================================
    // CLEAR FIELD ERROR
    // ==========================================

    const clearFieldError = (field) => {
        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [field]: ""
        }));
    };

    // ==========================================
    // FORM SUBMIT
    // ==========================================

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        setFieldErrors({
            title: "",
            description: "",
            videoUrl: "",
            thumbnailUrl: ""
        });

        const newErrors = {};

        const cleanTitle = title.trim();
        const cleanDescription =
            description.trim();
        const cleanVideoUrl =
            videoUrl.trim();
        const cleanThumbnailUrl =
            thumbnailUrl.trim();

        // ------------------------------------------
        // TITLE VALIDATION
        // ------------------------------------------

        if (!cleanTitle) {
            newErrors.title =
                "Video title is required";
        } else if (cleanTitle.length < 2) {
            newErrors.title =
                "Video title must be at least 2 characters";
        }

        // ------------------------------------------
        // DESCRIPTION VALIDATION
        // ------------------------------------------

        if (!cleanDescription) {
            newErrors.description =
                "Video description is required";
        } else if (
            cleanDescription.length < 5
        ) {
            newErrors.description =
                "Video description must be at least 5 characters";
        }

        // ------------------------------------------
        // VIDEO URL VALIDATION
        // ------------------------------------------

        if (!cleanVideoUrl) {
            newErrors.videoUrl =
                "Video URL is required";
        } else if (
            !isValidUrl(cleanVideoUrl)
        ) {
            newErrors.videoUrl =
                "Please enter a valid video URL";
        }

        // ------------------------------------------
        // THUMBNAIL URL VALIDATION
        // ------------------------------------------

        if (!cleanThumbnailUrl) {
            newErrors.thumbnailUrl =
                "Thumbnail URL is required";
        } else if (
            !isValidUrl(cleanThumbnailUrl)
        ) {
            newErrors.thumbnailUrl =
                "Please enter a valid thumbnail URL";
        }

        // ------------------------------------------
        // SHOW VALIDATION ERRORS
        // ------------------------------------------

        if (
            Object.keys(newErrors).length > 0
        ) {
            setFieldErrors({
                title:
                    newErrors.title || "",
                description:
                    newErrors.description ||
                    "",
                videoUrl:
                    newErrors.videoUrl || "",
                thumbnailUrl:
                    newErrors.thumbnailUrl ||
                    ""
            });

            setError(
                "Please correct the highlighted fields"
            );

            return;
        }

        // ------------------------------------------
        // CHANNEL VALIDATION
        // ------------------------------------------

        if (!channel) {
            setError(
                "You need a channel before uploading a video"
            );
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            setError(
                "Please sign in before uploading a video"
            );
            return;
        }

        // ------------------------------------------
        // UPLOAD
        // ------------------------------------------

        setUploading(true);

        axios
            .post(
                "http://localhost:5050/api/videos",
                {
                    title: cleanTitle,
                    category,
                    description:
                        cleanDescription,
                    videoUrl: cleanVideoUrl,
                    thumbnailUrl:
                        cleanThumbnailUrl,
                    channelId: channel._id
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
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

                // Clear form.
                setTitle("");
                setCategory(
                    "Entertainment"
                );
                setDescription("");
                setVideoUrl("");
                setThumbnailUrl("");

                setFieldErrors({
                    title: "",
                    description: "",
                    videoUrl: "",
                    thumbnailUrl: ""
                });
            })
            .catch((error) => {
                console.error(
                    "UPLOAD ERROR:",
                    error.response?.data ||
                        error.message
                );

                /*
                 * Handle backend validation errors.
                 *
                 * Express/Mongoose can return:
                 *
                 * {
                 *   message: "Video description must be at least 5 characters"
                 * }
                 */

                const backendMessage =
                    error.response?.data
                        ?.message;

                if (
                    backendMessage
                        ?.toLowerCase()
                        .includes(
                            "description"
                        )
                ) {
                    setFieldErrors(
                        (currentErrors) => ({
                            ...currentErrors,
                            description:
                                backendMessage
                        })
                    );

                    setError(
                        "Please correct the description"
                    );
                } else if (
                    backendMessage
                ) {
                    setError(
                        backendMessage
                    );
                } else {
                    setError(
                        "Failed to upload video"
                    );
                }
            })
            .finally(() => {
                setUploading(false);
            });
    };

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="upload-page">

            <div className="upload-container">

                <div className="upload-header">

                    <h1>
                        Upload Video
                    </h1>

                    <p>
                        Share a new video on your
                        channel
                    </p>

                </div>

                {/* General error */}
                {error && (
                    <div className="upload-error">
                        {error}
                    </div>
                )}

                {/* Success message */}
                {message && (
                    <div className="upload-success">
                        {message}
                    </div>
                )}

                {/* Channel information */}
                {channel && (
                    <div className="upload-channel">

                        <div className="upload-channel-avatar">
                            {channel.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <span>
                                Uploading to
                            </span>

                            <strong>
                                {channel.name}
                            </strong>
                        </div>

                    </div>
                )}

                {/* Loading channel */}
                {!channel &&
                    !error && (
                        <div className="upload-loading">
                            Loading channel...
                        </div>
                    )}

                {/* Upload form */}
                {channel && (
                    <form
                        className="upload-form"
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* TITLE */}
                        <div className="form-group">

                            <label>
                                Video Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your video title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(
                                        e.target
                                            .value
                                    );
                                    clearFieldError(
                                        "title"
                                    );
                                }}
                                maxLength={150}
                                className={
                                    fieldErrors.title
                                        ? "input-error"
                                        : ""
                                }
                            />

                            {fieldErrors.title && (
                                <div className="field-error">
                                    {
                                        fieldErrors.title
                                    }
                                </div>
                            )}

                        </div>

                        {/* CATEGORY */}
                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                value={
                                    category
                                }
                                onChange={(e) =>
                                    setCategory(
                                        e.target
                                            .value
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

                        {/* DESCRIPTION */}
                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Tell viewers about your video"
                                value={
                                    description
                                }
                                onChange={(e) => {
                                    setDescription(
                                        e.target
                                            .value
                                    );
                                    clearFieldError(
                                        "description"
                                    );
                                }}
                                maxLength={1000}
                                className={
                                    fieldErrors.description
                                        ? "input-error"
                                        : ""
                                }
                            />

                            {fieldErrors.description && (
                                <div className="field-error">
                                    {
                                        fieldErrors.description
                                    }
                                </div>
                            )}

                        </div>

                        {/* VIDEO URL */}
                        <div className="form-group">

                            <label>
                                Video URL
                            </label>

                            <input
                                type="url"
                                placeholder="https://example.com/video.mp4"
                                value={
                                    videoUrl
                                }
                                onChange={(e) => {
                                    setVideoUrl(
                                        e.target
                                            .value
                                    );
                                    clearFieldError(
                                        "videoUrl"
                                    );
                                }}
                                className={
                                    fieldErrors.videoUrl
                                        ? "input-error"
                                        : ""
                                }
                            />

                            <small>
                                Enter a valid URL
                                for your video
                                file.
                            </small>

                            {fieldErrors.videoUrl && (
                                <div className="field-error">
                                    {
                                        fieldErrors.videoUrl
                                    }
                                </div>
                            )}

                        </div>

                        {/* THUMBNAIL URL */}
                        <div className="form-group">

                            <label>
                                Thumbnail URL
                            </label>

                            <input
                                type="url"
                                placeholder="https://example.com/thumbnail.jpg"
                                value={
                                    thumbnailUrl
                                }
                                onChange={(e) => {
                                    setThumbnailUrl(
                                        e.target
                                            .value
                                    );
                                    clearFieldError(
                                        "thumbnailUrl"
                                    );
                                }}
                                className={
                                    fieldErrors.thumbnailUrl
                                        ? "input-error"
                                        : ""
                                }
                            />

                            <small>
                                Enter a valid URL
                                for your video
                                thumbnail.
                            </small>

                            {fieldErrors.thumbnailUrl && (
                                <div className="field-error">
                                    {
                                        fieldErrors.thumbnailUrl
                                    }
                                </div>
                            )}

                        </div>

                        {/* SUBMIT */}
                        <div className="upload-actions">

                            <button
                                type="submit"
                                className="upload-submit-button"
                                disabled={
                                    uploading
                                }
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Upload Video"}
                            </button>

                        </div>

                    </form>
                )}

            </div>

        </div>
    );
}

export default UploadVideo;
