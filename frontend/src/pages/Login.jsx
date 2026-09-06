import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        axios.post(
            "http://localhost:5050/api/auth/login",
            {
                email,
                password
            }
        )
        .then((response) => {
            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/");
        })
        .catch((error) => {
            console.log(
                "LOGIN ERROR:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        });
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">
                    ▶ YouTube
                </div>

                <h1>Sign in</h1>

                <p className="auth-subtitle">
                    Sign in to continue to your account.
                </p>

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

                    <button
                        type="submit"
                        className="auth-submit-button"
                    >
                        Sign In
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