import api from "../api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Register({ onClose, toggleModal }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess("");
        setIsSubmitting(true);

        // Client-side validations:
        if (!email) {
            setError("Email is required.");
            setIsSubmitting(false);
            return;
        }
        if (!username) {
            setError("Username is required.");
            setIsSubmitting(false);
            return;
        }
        if (!password) {
            setError("Password is required.");
            setIsSubmitting(false);
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            setIsSubmitting(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Include re_password field as required by Djoser
            await api.post("/auth/users/", {
                email,
                username,
                password,
                re_password: confirmPassword,
            });
            setSuccess("Thank You for joining us... To the Login Page!✈️");
            setTimeout(() => {
                setSuccess("");
                onClose();
                toggleModal();
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data) {
                const errors = err.response.data;
                let errorMessages = [];
                for (const key in errors) {
                    if (errors.hasOwnProperty(key)) {
                        let message = Array.isArray(errors[key]) ? errors[key].join(" ") : errors[key];
                        // Update the message to be more user-friendly if account exists
                        if (message.toLowerCase().includes("already exists")) {
                            message = "An account with these details already exists. Please log in instead.";
                        }
                        errorMessages.push(`${key}: ${message}`);
                    }
                }
                setError(errorMessages.join(" | "));
            } else {
                setError("Error registering your account!");
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="card shadow-lg animate__animated animate__fadeIn">
                <div className="card-body p-5">
                    <h2 className="text-center mb-4 text-primary fw-bold">Create an Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Username</label>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent">
                                    <i className="bi bi-person-fill text-primary"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control form-control-lg border-start-0"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent">
                                    <i className="bi bi-lock-fill text-primary"></i>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control form-control-lg border-start-0"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="input-group-text bg-transparent"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <i className="bi bi-eye-slash-fill text-primary"></i>
                                    ) : (
                                        <i className="bi bi-eye-fill text-primary"></i>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Confirm Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-transparent">
                                    <i className="bi bi-lock-fill text-primary"></i>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control form-control-lg border-start-0"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
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
                                "Register"
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
                        Already have an account?{" "}
                        <button className="btn btn-link p-0" onClick={toggleModal}>
                            Login
                        </button>
                    </p>
                </div>
            </div>
            <style>
                {`
          @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
          }
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
