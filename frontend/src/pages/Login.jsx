import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    // Store the user's login form values.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Store login errors and loading state for better user feedback.
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle login form submission.
    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear any previous error message.
        setError("");

        // Basic frontend validation before making the API request.
        if (!email.trim() || !password) {
            setError("Please enter your email and password");
            return;
        }

        // Prevent duplicate login requests while the API is processing.
        setLoading(true);

        // Send the login credentials to the backend authentication API.
        axios.post(
            "http://localhost:5050/api/auth/login",
            {
                email: email.trim(),
                password
            }
        )
        .then((response) => {
            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            // Save the JWT token so protected pages can authenticate requests.
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Save basic user information for displaying the username.
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // Redirect the authenticated user to the home page.
            navigate("/");
        })
        .catch((error) => {
            console.log(
                "LOGIN ERROR:",
                error.response?.data
            );

            // Display the backend error when available.
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        })
        .finally(() => {
            // Re-enable the button after the request completes.
            setLoading(false);
        });
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* YouTube-style branding for the authentication page. */}
                <div className="auth-logo">
                    ▶ YouTube
                </div>

                <h1>Sign in</h1>

                <p className="auth-subtitle">
                    Sign in to continue to your account.
                </p>

                {/* Show validation or backend errors when they occur. */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="auth-form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    {/* Disable the button during login to prevent duplicate requests. */}
                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create account
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;