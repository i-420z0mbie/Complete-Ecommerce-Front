import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [complaint, setComplaint] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess("");
        setIsSubmitting(true);

        try {
            // This endpoint should trigger your backend to send the email via SMTP
            await api.post("/store/api/send_complaint/", { email, complaint });
            setSuccess(
                "Your request has been processed. Please check your email for further details."
            );
            // Optionally, redirect after a short delay
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (err) {
            setError("An error occurred. Please try again later.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >
            <div className="card shadow-lg animate__animated animate__fadeIn" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="card-body p-5">
                    <h2 className="text-center mb-4 text-primary fw-bold">Forgot Password / Complaint</h2>
                    <p className="text-center text-muted mb-4">
                        Enter your email and your message below. We will process your request and get back to you soon.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Your Message</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Describe your issue or request..."
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 rounded-pill mt-3"
                            disabled={isSubmitting}
                            style={{ transition: "all 0.3s" }}
                        >
                            {isSubmitting ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                "Submit"
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
                </div>
            </div>
        </div>
    );
}
