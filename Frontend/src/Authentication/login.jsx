import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "./../api.js";
import "./login.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            return;
        }

        setLoading(true);

        try {
            api.defaults.withCredentials = true;
            const response = await api.post("/login", form);

            if (response.data.data.user.role === "admin") {
                navigate("/admin");
            } else {
                toast.error("You are not an admin!");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="login-page">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="login-logo-icon"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                            <path d="M8 9.5l4 2.25 4-2.25" />
                            <path d="M12 11.75V17" />
                        </svg>
                    </div>

                    <h1>Welcome back</h1>

                    <p>
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="login-card">
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect x="3" y="5" width="18" height="14" rx="2" />
                                        <path d="m3 7 9 6 9-6" />
                                    </svg>
                                </div>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="password-label-row">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="forgot-password"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </svg>
                                </div>

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                            <path d="M9.9 5.2A11.7 11.7 0 0 1 12 5c5 0 8.5 4 9.5 7-0.4 1.2-1.3 2.6-2.7 3.7" />
                                            <path d="M6.2 6.2C4.3 7.5 3.1 9.3 2.5 12c1 3 4.5 7 9.5 7 1 0 2-.2 2.9-.5" />
                                        </svg>
                                    ) : (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                                            <circle cx="12" cy="12" r="2.5" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="login-submit"
                        >
                            {loading ? (
                                <span className="loading-content">
                                    <span className="loading-spinner"></span>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <div className="divider">
                        <div></div>
                        <span>OR</span>
                        <div></div>
                    </div>

                    <button
                        type="button"
                        className="google-button"
                    >
                        <svg viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.95h5.22a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.93-4.18 2.93-7.25Z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M6.54 13.83A5.86 5.86 0 0 1 6.24 12c0-.64.11-1.26.3-1.83V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.36l3.24-2.53Z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.25 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
                            />
                        </svg>

                        Continue with Google
                    </button>

                    <p className="create-account">
                        Don't have an account?{" "}
                        <button type="button">
                            Create an account
                        </button>
                    </p>
                </div>

                <p className="login-terms">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}

