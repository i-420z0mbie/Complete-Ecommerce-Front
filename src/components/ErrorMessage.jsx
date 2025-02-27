import React from "react";
import PropTypes from 'prop-types';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="container my-5 text-center">
            <div className="alert alert-danger d-inline-block">
                <i className="bi bi-x-circle-fill me-2"></i>
                {message}

                {onRetry && (
                    <div className="mt-3">
                        <button
                            className="btn btn-outline-danger"
                            onClick={onRetry}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func
};

export default ErrorMessage;