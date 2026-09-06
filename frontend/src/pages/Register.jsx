import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        axios.post(
            "http://localhost:5050/api/auth/register",
            {
                username,
                email,
                password
            }
        )
        .then((response) => {
            setMessage(response.data.message);

            navigate("/login");
        })
        .catch((error) => {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        });
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    ▶ YouTube
                </div>

                <h1>Create your account</h1>

                <p className="auth-subtitle">
                    Join YouTube Clone and start sharing videos.
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

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

                    <button
                        type="submit"
                        className="auth-submit-button"
                    >
                        Create Account
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