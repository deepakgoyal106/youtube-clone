import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// Check whether a value is a valid URL.
const isValidUrl = (value) => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

// ==========================================
// CREATE VIDEO
// ==========================================

const createVideo = async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            videoUrl,
            thumbnailUrl,
            channelId
        } = req.body;

        // Validate required fields.
        if (
            !title?.trim() ||
            !category?.trim() ||
            !description?.trim() ||
            !videoUrl?.trim() ||
            !thumbnailUrl?.trim() ||
            !channelId
        ) {
            return res.status(400).json({
                message: "All video fields are required"
            });
        }

        // Validate video URL.
        if (!isValidUrl(videoUrl.trim())) {
            return res.status(400).json({
                message: "Please provide a valid video URL"
            });
        }

        // Validate thumbnail URL.
        if (!isValidUrl(thumbnailUrl.trim())) {
            return res.status(400).json({
                message:
                    "Please provide a valid thumbnail URL"
            });
        }

        // Find the channel.
        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).json({
                message: "Channel not found"
            });
        }

        // Only channel owner can upload.
        if (
            channel.owner.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You are not allowed to upload to this channel"
            });
        }

        const video = await Video.create({
            title: title.trim(),
            category: category.trim(),
            description: description.trim(),
            videoUrl: videoUrl.trim(),
            thumbnailUrl: thumbnailUrl.trim(),
            channel: channelId,
            uploader: req.user.userId
        });

        res.status(201).json({
            message: "Video created successfully",
            video
        });
    } catch (error) {
        console.error(
            "CREATE VIDEO ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to create video"
        });
    }
};

// ==========================================
// GET ALL VIDEOS
// ==========================================

const getVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .sort({ uploadDate: -1 })
            .populate("channel")
            .populate("uploader", "-password");

        /*
         * Detect orphan videos.
         *
         * When populate("channel") cannot find the
         * referenced channel, Mongoose returns null.
         *
         * Therefore:
         *
         * video.channel === null
         *
         * means the channel was deleted or does not exist.
         */
        const videosWithOrphanStatus =
            videos.map((video) => {
                const videoObject =
                    video.toObject();

                videoObject.isOrphan =
                    !videoObject.channel ||
                    !videoObject.channel._id;

                return videoObject;
            });

        res.status(200).json({
            videos: videosWithOrphanStatus
        });
    } catch (error) {
        console.error(
            "GET VIDEOS ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch videos"
        });
    }
};

// ==========================================
// GET SINGLE VIDEO
// ==========================================

const getVideo = async (req, res) => {
    try {
        const video = await Video.findById(
            req.params.id
        )
            .populate("channel")
            .populate("uploader", "-password");

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        const videoObject =
            video.toObject();

        videoObject.isOrphan =
            !videoObject.channel ||
            !videoObject.channel._id;

        res.status(200).json({
            video: videoObject
        });
    } catch (error) {
        console.error(
            "GET VIDEO ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch video"
        });
    }
};

// ==========================================
// UPDATE VIDEO
// ==========================================

const updateVideo = async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            videoUrl,
            thumbnailUrl
        } = req.body;

        // Validate required fields.
        if (
            !title?.trim() ||
            !category?.trim() ||
            !description?.trim() ||
            !videoUrl?.trim() ||
            !thumbnailUrl?.trim()
        ) {
            return res.status(400).json({
                message:
                    "All video fields are required"
            });
        }

        // Validate video URL.
        if (!isValidUrl(videoUrl.trim())) {
            return res.status(400).json({
                message:
                    "Please provide a valid video URL"
            });
        }

        // Validate thumbnail URL.
        if (!isValidUrl(thumbnailUrl.trim())) {
            return res.status(400).json({
                message:
                    "Please provide a valid thumbnail URL"
            });
        }

        const video = await Video.findById(
            req.params.id
        );

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        // Ownership check.
        if (
            !video.uploader ||
            video.uploader.toString() !==
                req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You are not allowed to edit this video"
            });
        }

        // Update fields.
        video.title = title.trim();
        video.category = category.trim();
        video.description = description.trim();
        video.videoUrl = videoUrl.trim();
        video.thumbnailUrl =
            thumbnailUrl.trim();

        const updatedVideo =
            await video.save();

        res.status(200).json({
            message:
                "Video updated successfully",
            video: updatedVideo
        });
    } catch (error) {
        console.error(
            "UPDATE VIDEO ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to update video"
        });
    }
};

// ==========================================
// DELETE NORMAL VIDEO
// ==========================================

const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(
            req.params.id
        );

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        // Ownership check.
        if (
            !video.uploader ||
            video.uploader.toString() !==
                req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You are not allowed to delete this video"
            });
        }

        await Video.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message:
                "Video deleted successfully"
        });
    } catch (error) {
        console.error(
            "DELETE VIDEO ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete video"
        });
    }
};

// ==========================================
// DELETE ORPHAN VIDEO
// ==========================================

const deleteOrphanVideo = async (req, res) => {
    try {
        const video = await Video.findById(
            req.params.id
        );

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        /*
         * Only the uploader can delete the video.
         */
        if (
            !video.uploader ||
            video.uploader.toString() !==
                req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You are not allowed to delete this video"
            });
        }

        /*
         * Check whether the channel actually exists.
         *
         * This handles BOTH cases:
         *
         * Case 1:
         * video.channel is null/missing.
         *
         * Case 2:
         * video.channel contains an ID,
         * but that channel was deleted.
         */
        let channelExists = false;

        if (video.channel) {
            channelExists =
                await Channel.exists({
                    _id: video.channel
                });
        }

        /*
         * If the channel still exists,
         * this is NOT an orphan video.
         */
        if (channelExists) {
            return res.status(400).json({
                message:
                    "This video belongs to an existing channel and cannot be deleted as an orphan"
            });
        }

        /*
         * The video is orphaned.
         * Delete it.
         */
        await Video.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message:
                "Orphan video deleted successfully"
        });
    } catch (error) {
        console.error(
            "DELETE ORPHAN VIDEO ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete orphan video"
        });
    }
};

// ==========================================
// LIKE VIDEO
// ==========================================

const likeVideo = async (req, res) => {
    try {
        const video =
            await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $inc: {
                        likes: 1
                    }
                },
                {
                    new: true
                }
            );

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        res.status(200).json({
            message: "Video liked",
            likes: video.likes,
            dislikes: video.dislikes
        });
    } catch (error) {
        console.error(
            "LIKE VIDEO ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to like video"
        });
    }
};

// ==========================================
// DISLIKE VIDEO
// ==========================================

const dislikeVideo = async (req, res) => {
    try {
        const video =
            await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $inc: {
                        dislikes: 1
                    }
                },
                {
                    new: true
                }
            );

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        res.status(200).json({
            message: "Video disliked",
            likes: video.likes,
            dislikes: video.dislikes
        });
    } catch (error) {
        console.error(
            "DISLIKE VIDEO ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to dislike video"
        });
    }
};

// ==========================================
// GET VIDEOS OF CHANNEL
// ==========================================

const getChannelVideos = async (
    req,
    res
) => {
    try {
        const videos =
            await Video.find({
                channel:
                    req.params.channelId
            })
                .sort({
                    uploadDate: -1
                })
                .populate("channel")
                .populate(
                    "uploader",
                    "-password"
                );

        res.status(200).json({
            videos
        });
    } catch (error) {
        console.error(
            "GET CHANNEL VIDEOS ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch channel videos"
        });
    }
};

// ==========================================
// INCREMENT VIDEO VIEWS
// ==========================================

const incrementViews = async (
    req,
    res
) => {
    try {
        const video =
            await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $inc: {
                        views: 1
                    }
                },
                {
                    new: true
                }
            );

        if (!video) {
            return res.status(404).json({
                message: "Video not found"
            });
        }

        res.status(200).json({
            message: "View counted",
            views: video.views
        });
    } catch (error) {
        console.error(
            "INCREMENT VIEWS ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update views"
        });
    }
};

// ==========================================
// EXPORTS
// ==========================================

export {
    getVideos,
    getVideo,
    updateVideo,
    deleteVideo,
    deleteOrphanVideo,
    likeVideo,
    dislikeVideo,
    getChannelVideos,
    incrementViews
};

export default createVideo;
