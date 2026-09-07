import { Navigate, useLocation } from "react-router-dom";

// ==========================================
// PROTECTED ROUTE
// ==========================================

// Prevent unauthenticated users from accessing
// pages such as My Channel and Upload Video.
function ProtectedRoute({ children }) {
    const location = useLocation();

    // Check whether the user has a JWT token.
    const token = localStorage.getItem("token");

    // If the user is not authenticated, redirect to login.
    // The current path is saved so it can be used later
    // for improving the post-login navigation experience.
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    // Authenticated users can access the protected page.
    return children;
}

export default ProtectedRoute;