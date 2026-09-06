import "./Header.css";
import { useNavigate } from "react-router-dom";

function Header({
    searchTerm,
    setSearchTerm,
    toggleSidebar
}) {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="header">

            <button
                type="button"
                className="menu-button"
                onClick={() => {
                    console.log("HAMBURGER CLICKED");
                    toggleSidebar();
                }}
            >
                ☰
            </button>

            <div className="logo">
                ▶ YouTube
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

                <button
                    type="button"
                    className="search-button"
                >
                    🔍
                </button>
            </div>

            {token ? (
                <div className="header-user">
                    <span>
                        👤 {user?.username}
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
