// OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import '../OrderDetail.css';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/store/orders/${orderId}/`);
                setOrder(data);
            } catch (err) {
                setError("Failed to load order details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    return (
        <div className="order-detail-container">
            {loading ? (
                <div className="skeleton-loader">
                    <div className="skeleton-header shimmer"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton-line shimmer"></div>
                    ))}
                    <div className="skeleton-button shimmer"></div>
                </div>
            ) : error ? (
                <div className="error-card scale-in">
                    <div className="error-icon">⚠️</div>
                    <h3>{error}</h3>
                </div>
            ) : order ? (
                <div className="order-detail-card slide-in">
                    <div className="order-header">
                        <h1 className="neon-title">Order Details</h1>
                        <div className={`status-badge ${order.status.toLowerCase()} pulse`}>
                            {order.status}
                        </div>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">📦 Order ID:</span>
                            <span className="detail-value highlight">#{order.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">📅 Date:</span>
                            <span className="detail-value">
                                {new Date(order.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">💰 Total Amount:</span>
                            <span className="detail-value amount">GH₵{order.amount.toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">🏠 Shipping Address:</span>
                            <span className="detail-value">{order.shipping_address}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">📱 Contact Number:</span>
                            <span className="detail-value">{order.contact_info}</span>
                        </div>
                    </div>

                    {order.status.toLowerCase() === "pending" && (
                        <div className="action-section">
                            <Link
                                to={`/payment/${order.id}`}
                                className="pay-now-button neon-glow"
                            >
                                💳 Pay Now
                            </Link>
                            <div className="security-note">
                                🔒 Secure SSL Encryption | 256-bit Security
                            </div>
                        </div>
                    )}

                    <div className="go-to-orders">
                        <Link to="/orders" className="orders-button">
                            ← Go to Orders
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="not-found-card scale-in">
                    <div className="empty-icon">📭</div>
                    <h2>Order Not Found</h2>
                    <p>The requested order could not be located</p>
                    <div className="go-to-orders">
                        <Link to="/orders" className="orders-button">
                            ← Go to Orders
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
