import "./VideoCard.css";
import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {
    const navigate = useNavigate();

    // Open the selected video player when the card is clicked.
    const handleCardClick = () => {
        navigate(`/video/${video._id}`);
    };

    return (
        <div
            className="video-card"
            onClick={handleCardClick}
        >
            {/* Fixed 16:9 container keeps every thumbnail the same size. */}
            <div className="video-thumbnail-container">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="video-thumbnail"
                    onError={(e) => {
                        // Show a fallback image if the thumbnail URL fails.
                        e.target.src =
                            "https://placehold.co/400x225?text=Video";
                    }}
                />
            </div>

            <div className="video-info">
                <h3>{video.title}</h3>

                <p>{video.channel?.name || "Unknown channel"}</p>

                <p>{video.views || 0} views</p>
            </div>
        </div>
    );
}

export default VideoCard;