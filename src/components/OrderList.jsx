// OrderList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingIds, setDeletingIds] = useState([]);

    const handleDelete = async (orderId) => {
        setDeletingIds(prev => [...prev, orderId]);
        try {
            await api.delete(`/store/orders/${orderId}/`);
            setOrders(prev => prev.filter(order => order.id !== orderId));
        } catch (err) {
            setError({ message: `Failed to delete order: ${err.message}` });
        } finally {
            setDeletingIds(prev => prev.filter(id => id !== orderId));
        }
    };

    useEffect(() => {
        api.get('/store/orders/')
            .then((response) => {
                setOrders(Array.isArray(response.data) ? response.data : response.data.results);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="orders-container">
                <p>Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-container">
                <p className="alert alert-danger">{error.message || "An error occurred."}</p>
            </div>
        );
    }

    return (
        <div className="orders-container">
            {orders.map((order, index) => (
                <div
                    key={order.id}
                    className="order-card slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="card-header">
                        <h2 className="order-number glow">Order #{order.id}</h2>
                        <div className="header-actions">
                            <div className={`status-badge ${order.status} pulse`}>
                                {order.status}
                            </div>
                            <button
                                onClick={() => handleDelete(order.id)}
                                disabled={deletingIds.includes(order.id)}
                                className="delete-button hover-shake"
                            >
                                {deletingIds.includes(order.id) ? (
                                    <div className="spinner small"></div>
                                ) : (
                                    <>
                                        <span className="delete-icon">🗑️</span>
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    {/* New "View Details" button */}
                    <div className="card-footer">
                        <Link to={`/order/${order.id}`} className="view-details-button">
                            View Details
                        </Link>
                    </div>
                    {/* Optionally, include other order details here */}
                </div>
            ))}
        </div>
    );
};

export default OrderList;
