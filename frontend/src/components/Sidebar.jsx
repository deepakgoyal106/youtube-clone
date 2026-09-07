
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    return (
        <aside className="sidebar">

            <div
                className="sidebar-item"
                onClick={() => navigate("/")}
            >
                🏠 Home
            </div>

            {token && (
                <>
                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/channel")}
                    >
                        📺 My Channel
                    </div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/upload")}
                    >
                        ⬆️ Upload Video
                    </div>
                </>
            )}

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
