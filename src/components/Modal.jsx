// Modal.jsx
import React, { useEffect } from "react";
import "../Modal.css"; // We'll create this next

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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
