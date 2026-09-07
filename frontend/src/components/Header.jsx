import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header({ searchTerm, setSearchTerm, toggleSidebar }) {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // Safely read the logged-in user from localStorage.
    // This prevents the application from crashing if the stored
    // user data is missing or contains invalid JSON.
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        console.error("Failed to read stored user:", error);

        // Remove corrupted user data so the application
        // can continue working normally.
        localStorage.removeItem("user");
    }

    // Logout removes authentication data and returns
    // the user to the login page.
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <header className="header">
            {/* Hamburger button toggles the sidebar. */}
            <button
                type="button"
                className="menu-button"
                onClick={toggleSidebar}
                aria-label="Toggle navigation menu"
            >
                ☰
            </button>

            {/* Application logo. */}
            <div className="logo">▶ YouTube</div>

            {/* Video search input. */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search videos"
                />

                <button
                    type="button"
                    className="search-button"
                    aria-label="Search"
                >
                    🔍
                </button>
            </div>

            {/* Authentication state. */}
            {token ? (
                <div className="header-user">
                    <span>
                        👤 {user?.username || "User"}
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="signin-button"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="signin-button"
                    onClick={() => navigate("/login")}
                >
                    Sign in
                </button>
            )}
        </header>
    );
}

export default Header;