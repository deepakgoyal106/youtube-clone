import "./VideoCard.css";
import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {

    const navigate = useNavigate();

    return (
        <div
            className="video-card"
            onClick={() => navigate(`/video/${video._id}`)}
        >

            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="video-thumbnail"
                onError={(e) => {
                    e.target.src =
                        "https://placehold.co/400x225?text=Video";
                }}
            />

            <div className="video-info">

                <h3>{video.title}</h3>

                <p>{video.channel?.name}</p>

                <p>{video.views} views</p>

            </div>

        </div>
    );
}

export default VideoCard;