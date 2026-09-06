import Video from "../models/Video.js";
import Channel from "../models/Channel.js";


// CREATE VIDEO
const createVideo = (req, res) => {

    const {
        title,
        category,
        description,
        videoUrl,
        thumbnailUrl,
        channelId
    } = req.body;

    if (
        !title ||
        !category ||
        !description ||
        !videoUrl ||
        !thumbnailUrl ||
        !channelId
    ) {
        return res.status(400).json({
            message: "All video fields are required"
        });
    }

    Channel.findById(channelId)
        .then((channel) => {

            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found"
                });
            }

            if (channel.owner.toString() !== req.user.userId) {
                return res.status(403).json({
                    message:
                        "You are not allowed to upload to this channel"
                });
            }

            const newVideo = new Video({
                title: title,
                category: category,
                description: description,
                videoUrl: videoUrl,
                thumbnailUrl: thumbnailUrl,
                channel: channelId,
                uploader: req.user.userId
            });

            return newVideo.save();
        })
        .then((video) => {

            if (video) {
                res.status(201).json({
                    message: "Video created successfully",
                    video: video
                });
            }

        })
        .catch((error) => {

            console.log(
                "Error creating video:",
                error
            );

            res.status(500).json({
                message: "Failed to create video"
            });

        });
};


// GET ALL VIDEOS
const getVideos = (req, res) => {

    Video.find()
        .sort({
            uploadDate: -1
        })
        .populate("channel")
        .populate("uploader", "-password")

        .then((videos) => {

            res.status(200).json({
                videos: videos
            });

        })
        .catch((error) => {

            console.log(
                "Error fetching videos:",
                error
            );

            res.status(500).json({
                message: "Failed to fetch videos"
            });

        });
};


// GET SINGLE VIDEO
const getVideo = (req, res) => {

    const videoId = req.params.id;

    Video.findById(videoId)
        .populate("channel")
        .populate("uploader", "-password")

        .then((video) => {

            if (!video) {
                return res.status(404).json({
                    message: "Video not found"
                });
            }

            res.status(200).json({
                video: video
            });

        })
        .catch((error) => {

            console.log(
                "Error fetching video:",
                error
            );

            res.status(500).json({
                message: "Failed to fetch video"
            });

        });
};


// UPDATE VIDEO
const updateVideo = (req, res) => {

    const videoId = req.params.id;

    const {
        title,
        category,
        description,
        videoUrl,
        thumbnailUrl
    } = req.body;

    Video.findById(videoId)

        .then((video) => {

            if (!video) {
                return res.status(404).json({
                    message: "Video not found"
                });
            }

            // Check video owner
            if (
                video.uploader.toString() !==
                req.user.userId
            ) {
                return res.status(403).json({
                    message:
                        "You are not allowed to edit this video"
                });
            }

            // Update fields
            video.title =
                title || video.title;

            video.category =
                category || video.category;

            video.description =
                description || video.description;

            video.videoUrl =
                videoUrl || video.videoUrl;

            video.thumbnailUrl =
                thumbnailUrl || video.thumbnailUrl;

            return video.save();

        })
        .then((updatedVideo) => {

            if (updatedVideo) {

                res.status(200).json({
                    message: "Video updated successfully",
                    video: updatedVideo
                });

            }

        })
        .catch((error) => {

            console.log(
                "Error updating video:",
                error
            );

            res.status(500).json({
                message: "Failed to update video"
            });

        });
};


// DELETE VIDEO
const deleteVideo = (req, res) => {

    const videoId = req.params.id;

    Video.findById(videoId)

        .then((video) => {

            if (!video) {
                return res.status(404).json({
                    message: "Video not found"
                });
            }

            // Check video owner
            if (
                video.uploader.toString() !==
                req.user.userId
            ) {
                return res.status(403).json({
                    message:
                        "You are not allowed to delete this video"
                });
            }

            return Video.findByIdAndDelete(videoId);

        })

        .then((deletedVideo) => {

            if (deletedVideo) {

                res.status(200).json({
                    message: "Video deleted successfully"
                });

            }

        })
        .catch((error) => {

            console.log(
                "Error deleting video:",
                error
            );

            res.status(500).json({
                message: "Failed to delete video"
            });

        });
};


// LIKE VIDEO
const likeVideo = (req, res) => {

    const videoId = req.params.id;

    Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                likes: 1
            }
        },
        {
            new: true
        }
    )
    .then((video) => {

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

    })
    .catch((error) => {

        console.log(
            "Error liking video:",
            error
        );

        res.status(500).json({
            message: "Failed to like video"
        });

    });
};


// DISLIKE VIDEO
const dislikeVideo = (req, res) => {

    const videoId = req.params.id;

    Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                dislikes: 1
            }
        },
        {
            new: true
        }
    )
    .then((video) => {

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

    })
    .catch((error) => {

        console.log(
            "Error disliking video:",
            error
        );

        res.status(500).json({
            message: "Failed to dislike video"
        });

    });
};


// GET VIDEOS OF CHANNEL
const getChannelVideos = (req, res) => {

    const channelId = req.params.channelId;

    Video.find({
        channel: channelId
    })
        .sort({
            uploadDate: -1
        })
        .populate("channel")
        .populate("uploader", "-password")

        .then((videos) => {

            res.status(200).json({
                videos: videos
            });

        })
        .catch((error) => {

            console.log(
                "Error fetching channel videos:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch channel videos"
            });

        });
};
// INCREMENT VIDEO VIEWS
const incrementViews = (req, res) => {
    const videoId = req.params.id;

    Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    )
        .then((video) => {
            if (!video) {
                return res.status(404).json({
                    message: "Video not found"
                });
            }

            res.status(200).json({
                message: "View counted",
                views: video.views
            });
        })
        .catch((error) => {
            console.log("Error incrementing views:", error);
            res.status(500).json({
                message: "Failed to update views"
            });
        });
};

// EXPORTS
export {
    getVideos,
    getVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    dislikeVideo,
    getChannelVideos,
    incrementViews
};

export default createVideo;