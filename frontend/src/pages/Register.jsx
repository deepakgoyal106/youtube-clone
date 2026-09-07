import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    // Store registration form values.
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Store feedback messages for the user.
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Track the registration request so duplicate submissions are prevented.
    const [loading, setLoading] = useState(false);

    // Handle registration form submission.
    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous messages before validating the new submission.
        setError("");
        setMessage("");

        // Remove unnecessary spaces from username and email.
        const cleanUsername = username.trim();
        const cleanEmail = email.trim();

        // Perform basic frontend validation before calling the backend.
        if (!cleanUsername || !cleanEmail || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (cleanUsername.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Prevent multiple registration requests.
        setLoading(true);

        // Send the registration details to the backend authentication API.
        axios.post(
            "http://localhost:5050/api/auth/register",
            {
                username: cleanUsername,
                email: cleanEmail,
                password
            }
        )
        .then((response) => {
            // Show the successful registration message briefly.
            setMessage(response.data.message);

            // Redirect the new user to the login page.
            navigate("/login");
        })
        .catch((error) => {
            console.log(
                "REGISTRATION ERROR:",
                error.response?.data
            );

            // Display the backend validation error when available.
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        })
        .finally(() => {
            // Re-enable the button after the request finishes.
            setLoading(false);
        });
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* YouTube-style branding for the registration page. */}
                <div className="auth-logo">
                    ▶ YouTube
                </div>

                <h1>Create your account</h1>

                <p className="auth-subtitle">
                    Join YouTube Clone and start sharing videos.
                </p>

                {/* Display validation or backend errors. */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* Display successful registration feedback. */}
                {message && (
                    <div className="auth-success">
                        {message}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            maxLength={50}
                        />

                    </div>

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

                        <small>
                            Password must be at least 8 characters.
                        </small>

                    </div>

                    <div className="auth-form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    {/* Disable the button while registration is processing. */}
                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign in
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;