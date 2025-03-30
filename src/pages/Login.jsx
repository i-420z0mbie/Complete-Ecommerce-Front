import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { AuthContext } from "../contexts/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Login({ onClose, toggleModal }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const nav = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            const res = await api.post("/auth/jwt/create/", { username, password }, { skipAuthRefresh: true });
            // If the response contains an error detail, throw an error to trigger the catch block
            if (res.data.detail) {
                throw new Error(res.data.detail);
            }
            login(res.data.access, res.data.refresh);
            setSuccess("Login Successful!");
            setTimeout(() => {
                setSuccess("");
                onClose();
                // Try to use a "next" route from localStorage; if not, go back one page
                const next = localStorage.getItem("next");
                if (next) {
                    localStorage.removeItem("next");
                    nav(next);
                } else {
                    nav(-1);
                }
            }, 1000);
        } catch (err) {
            let message = "";
            if (err.response && err.response.data) {
                const errors = err.response.data;
                let errorMessages = [];
                for (const key in errors) {
                    if (errors.hasOwnProperty(key)) {
                        let errMsg = Array.isArray(errors[key]) ? errors[key].join(" ") : errors[key];
                        // Update the message to be more user-friendly if no account is found
                        if (errMsg.includes("No active account")) {
                            errMsg = "No account found with those credentials. Please check your username and password.";
                        }
                        errorMessages.push(`${key}: ${errMsg}`);
                    }
                }
                message = errorMessages.join(" | ");
            } else if (err.message) {
                // Use the thrown error message if available
                message = err.message.includes("No active account")
                    ? "No account found with those credentials. Please check your username and password."
                    : err.message;
            } else {
                message = "No account found with those credentials. Please check your username and password.";
            }
            setError(message);
            console.error("Error logging in", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = () => {
        onClose(); // Close the modal
        nav("/forgot-password"); // Navigate to Forgot Password page
    };

    return (
        <>
            <div className="card shadow-lg animate__animated animate__fadeIn">
                <div className="card-body p-5">
                    <h2 className="text-center mb-4 text-primary fw-bold">Welcome Back!</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="username" className="form-label text-muted">
                                Username
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent">
                                    <i className="bi bi-person-fill text-primary"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control form-control-lg border-start-0"
                                    id="username"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ transition: "all 0.3s" }}
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <label htmlFor="password" className="form-label text-muted">
                                Password
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent">
                                    <i className="bi bi-lock-fill text-primary"></i>
                                </span>
                                <input
                                    type="password"
                                    className="form-control form-control-lg border-start-0"
                                    id="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ transition: "all 0.3s" }}
                                />
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-end mb-4">
                            <button
                                className="btn btn-link text-decoration-none p-0 text-primary fw-semibold"
                                onClick={handleForgotPassword}
                                type="button"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 rounded-pill mt-3"
                            disabled={isSubmitting}
                            style={{ transition: "all 0.3s", transform: "scale(1)" }}
                            onMouseOver={(e) => (e.target.style.transform = "scale(1.02)")}
                            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                        >
                            {isSubmitting ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="alert alert-danger mt-4 animate__animated animate__shakeX" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success mt-4 animate__animated animate__fadeIn" role="alert">
                            {success}
                        </div>
                    )}

                    <p className="text-center mt-3">
                        Don't have an account?{" "}
                        <button className="btn btn-link p-0" onClick={toggleModal}>
                            Register
                        </button>
                    </p>
                </div>
            </div>

            <style>
                {`
          .card {
              border: none;
              border-radius: 20px;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
          }
          .input-group-text {
              border-right: none;
              border-radius: 0.375rem 0 0 0.375rem;
          }
          .form-control:focus {
              box-shadow: none;
              border-color: #7c8ff7;
          }
          .btn-primary {
              background: #667eea;
              border: none;
              padding: 12px 0;
          }
          .btn-primary:hover {
              background: #5570e0;
          }
          .animate__fadeIn {
              animation-duration: 0.8s;
          }
        `}
            </style>
        </>
    );
}
