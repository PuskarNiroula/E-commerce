
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import api from "../api.js";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = form.email.trim();
        const password = form.password;

        if (!email || !password) {
            toast.error("Please enter your email and password.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/login", {
                email,
                password,
            });

            const data = response.data;



            const role = String(data.data.user.role ?? data.user?.role ?? "").toLowerCase();

            if (!role) {
                throw new Error("Login succeeded, but the user role was not returned.");
            }

            toast.success("Login successful!");

            if (role === "admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.error ||
                (error instanceof TypeError
                    ? "Unable to connect to the server. Please try again."
                    : error.message || "Something went wrong. Please try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="light"
            />

            <div className="login-shell">
                <section className="login-visual">
                    <div className="visual-content">
                        <div className="brand">
                            <div className="brand-icon">N</div>
                            <span>NEXORA</span>
                        </div>

                        <div className="visual-copy">
                            <span className="eyebrow">YOUR WORKSPACE, REIMAGINED</span>
                            <h1>
                                Everything you need.
                                <br />
                                All in one place.
                            </h1>
                            <p>
                                A smarter way to manage your work, access your tools, and
                                keep everything moving forward.
                            </p>
                        </div>

                        <div className="visual-footer">
                            <span className="status-dot" />
                            Secure access to your workspace
                        </div>
                    </div>

                    <div className="visual-orb visual-orb-one" />
                    <div className="visual-orb visual-orb-two" />
                    <div className="visual-grid" />
                </section>

                <section className="login-panel">
                    <div className="login-form-wrapper">
                        <div className="mobile-brand">
                            <div className="brand-icon">N</div>
                            <span>NEXORA</span>
                        </div>

                        <div className="form-heading">
                            <span className="welcome-label">WELCOME BACK</span>
                            <h2>Sign in to your account</h2>
                            <p>Enter your credentials to access your workspace.</p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <div className="input-wrapper">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        aria-hidden="true"
                                    >
                                        <rect x="3" y="5" width="18" height="14" rx="3" />
                                        <path d="m4 7 8 6 8-6" />
                                    </svg>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        aria-hidden="true"
                                    >
                                        <rect x="4" y="10" width="16" height="11" rx="3" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </svg>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        required
                                        minLength={6}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                aria-hidden="true"
                                            >
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                                <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.5 1.2-1.4 2.5-2.6 3.6" />
                                                <path d="M6.2 6.2C3.9 7.7 2.7 10 2.5 12c.8 2 4.3 7 9.5 7 1.1 0 2.2-.3 3.1-.7" />
                                            </svg>
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                aria-hidden="true"
                                            >
                                                <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <span className="field-hint">
Use at least 6 characters.
</span>
                            </div>

                            <button
                                className="login-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="login-spinner" />
                                        Signing you in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            aria-hidden="true"
                                        >
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="security-note">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                aria-hidden="true"
                            >
                                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                            Your credentials are transmitted securely.
                        </div>

                        <div className="login-bottom">
                            <span>© {new Date().getFullYear()} Nexora</span>
                            <span>Secure. Simple. Reliable.</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
