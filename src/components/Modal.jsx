// Modal.jsx
import React, { useEffect } from "react";
import "../Modal.css";

const Modal = ({ show, onClose, children }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    if (!show) return null; // Do not render if show is false

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "1rem",
                    borderRadius: "4px",
                    position: "relative",
                    maxWidth: "500px",
                    width: "100%",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        border: "none",
                        background: "transparent",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                    }}
                    onClick={onClose}
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
