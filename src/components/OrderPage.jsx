// OrderPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import OrderList from './OrderList';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../OrderPage.css';

const OrderPage = () => {
    const [reload, setReload] = useState(0);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);

    const navigate = useNavigate();

    const refreshOrders = () => {
        setReload((prev) => prev + 1);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setIsOrdersLoading(true);
            try {
                const { data } = await api.get("/store/orders/");
                // Adjust according to your API response structure.
                const ordersData = Array.isArray(data) ? data : data.results;
                setOrders(ordersData);
            } catch (err) {
                setError("Failed to load orders. Please try again.");
            } finally {
                setIsOrdersLoading(false);
            }
        };
        fetchOrders();
    }, [reload]);

    // New Order button now navigates to the "all-products" page.
    const handlePlaceOrder = () => {
        navigate("/products");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container-fluid min-vh-100 p-3 p-lg-5"
        >
            <div className="gradient-header rounded-4 p-4 p-md-5 mb-5 shadow-lg">
                <div className="row align-items-center g-4">
                    <div className="col-12 col-md-8 text-center text-md-start">
                        <motion.h1
                            className="page-title mb-0 display-4 fw-bold"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            Order Management
                        </motion.h1>
                    </div>
                    <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end">
                        <button
                            className="btn btn-light btn-lg px-5 py-3 rounded-pill"
                            onClick={handlePlaceOrder}
                        >
                            New Order
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mx-auto mb-5 text-center">
                    {error}
                </div>
            )}

            {isOrdersLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
                </div>
            ) : orders.length === 0 ? (
                <div className="alert alert-info text-center">
                    No orders found.
                    <br />
                    <Link to="/products">Place an order now</Link>
                </div>
            ) : (
                <div className="row justify-content-center">
                    <div className="col-12">
                        <OrderList orders={orders} loading={false} />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default OrderPage;
