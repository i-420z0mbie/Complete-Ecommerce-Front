// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PaystackPayment from "../components/PaystackPayment";
import api from "../api";
import "../PaymentPage.css";

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/store/orders/${orderId}/`);
                setOrderData(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load order details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleSuccess = (reference) => {
        console.log("Payment verified successfully:", reference);
        navigate(`/orders`);
    };

    return (
        <div className="payment-page-container">
            <div className="payment-card scale-in">
                {loading ? (
                    <div className="skeleton-loader">
                        <div className="skeleton-title shimmer"></div>
                        <div className="skeleton-line shimmer"></div>
                        <div className="skeleton-line shimmer"></div>
                        <div className="skeleton-button shimmer"></div>
                    </div>
                ) : error ? (
                    <div className="payment-error slide-down">
                        <div className="error-icon">⚠️</div>
                        <h3>{error}</h3>
                    </div>
                ) : orderData ? (
                    <>
                        <div className="payment-header">
                            <h1 className="neon-text">Complete Your Payment</h1>
                            <p className="order-id">Order ID: #{orderId}</p>
                        </div>

                        <div className="payment-details">
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value highlight">{orderData.user_email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Amount Due:</span>
                                <span className="detail-value amount">
                                    GH₵{(orderData.amount).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="payment-security">
                            <div className="security-badge">
                                🔒 Secure SSL Encryption
                            </div>
                        </div>

                        <PaystackPayment
                            email={orderData.user_email}
                            amount={orderData.amount}
                            orderId={orderId}
                            onSuccess={handleSuccess}
                        />
                    </>
                ) : (
                    <div className="no-order-found">
                        <h3>Order Not Found</h3>
                        <p>The requested order does not exist</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;