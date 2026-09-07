import "./VideoCard.css";
import { useNavigate } from "react-router-dom";

function VideoCard({ video, onVideoDeleted }) {
    const navigate = useNavigate();

    // Open the selected video player when the card is clicked.
    const handleCardClick = () => {
        navigate(`/video/${video._id}`);
    };

    // Delete an orphan video.
    const handleDeleteOrphan = async (e) => {
        // Prevent the video card click from opening the player.
        e.stopPropagation();

        const confirmed = window.confirm(
            "This video does not belong to an existing channel. Are you sure you want to delete it?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please sign in to delete this video.");
                return;
            }

            const response = await fetch(
                `http://localhost:5050/api/videos/${video._id}/orphan`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Read response safely even if the server returns an empty body.
            const responseText = await response.text();

            let data = {};

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = {
                        message: responseText
                    };
                }
            }

            if (!response.ok) {
                alert(
                    data.message ||
                        `Failed to delete video (${response.status})`
                );
                return;
            }

            alert(
                data.message ||
                    "Orphan video deleted successfully."
            );

            // Tell Home to remove the deleted video immediately.
            if (onVideoDeleted) {
                onVideoDeleted(video._id);
            }
        } catch (error) {
            console.error(
                "DELETE ORPHAN VIDEO ERROR:",
                error
            );

            alert("Failed to delete orphan video.");
        }
    };

    /*
     * An orphan video can be:
     *
     * 1. Missing a channel completely.
     * 2. Have a channel object whose _id is missing.
     *
     * The backend now sends `isOrphan` for both cases.
     */
    const isOrphanVideo =
        video.isOrphan === true ||
        !video.channel ||
        !video.channel._id;

    return (
        <div
            className="video-card"
            onClick={handleCardClick}
        >
            {/* Fixed 16:9 thumbnail container */}
            <div className="video-thumbnail-container">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="video-thumbnail"
                    onError={(e) => {
                        e.target.src =
                            "https://placehold.co/400x225?text=Video";
                    }}
                />
            </div>

            <div className="video-info">
                <h3>{video.title}</h3>

                <p>
                    {video.channel?.name ||
                        "Unknown channel"}
                </p>

                <p>{video.views || 0} views</p>

                {/* Delete button for ALL orphan videos */}
                {isOrphanVideo && (
                    <button
                        type="button"
                        className="orphan-delete-button"
                        onClick={handleDeleteOrphan}
                    >
                        Delete Video
                    </button>
                )}
            </div>
        </div>
    );
}

export default VideoCard;
