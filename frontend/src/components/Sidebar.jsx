import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // Navigate to the channel page with a unique refresh value.
    // This allows Channel.jsx to reset its state even when the user
    // clicks "My Channel" while already on the channel page.
    const handleChannelClick = () => {
        navigate("/channel", {
            state: {
                refresh: Date.now()
            }
        });
    };

    return (
        <aside className="sidebar">

            {/* HOME */}
            <div
                className="sidebar-item"
                onClick={() => navigate("/")}
            >
                🏠 Home
            </div>

            {/* LOGGED-IN USER OPTIONS */}
            {token && (
                <>
                    {/* MY CHANNEL */}
                    <div
                        className="sidebar-item"
                        onClick={handleChannelClick}
                    >
                        📺 My Channel
                    </div>

                    {/* UPLOAD VIDEO */}
                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/upload")}
                    >
                        ⬆️ Upload Video
                    </div>
                </>
            )}

            {/* LOGGED-OUT USER OPTION */}
            {!token && (
                <div
                    className="sidebar-item"
                    onClick={() => navigate("/login")}
                >
                    🔐 Sign in
                </div>
            )}

        </aside>
    );
}

export default Sidebar;