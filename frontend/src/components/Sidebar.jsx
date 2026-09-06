import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    return (
        <aside className="sidebar">

            <div
                className="sidebar-item"
                onClick={() => navigate("/")}
            >
                🏠 Home
            </div>

            <div className="sidebar-item">
                🔥 Trending
            </div>

            <div className="sidebar-item">
                📺 Subscriptions
            </div>

            <hr />

            <div className="sidebar-item">
                📚 Library
            </div>

            <div className="sidebar-item">
                🕒 History
            </div>

            <div className="sidebar-item">
                👍 Liked Videos
            </div>

        </aside>
    );
}

export default Sidebar;