import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faMinus, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [shippingAddress, setShippingAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const { data } = await api.get("/store/cart-items/");
                setCartItems(Array.isArray(data) ? data : data.results);
            } catch (err) {
                setError("Failed to load your shopping bag. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await api.patch(`/store/cart-items/${itemId}/`, { quantity: newQuantity });
            const { data } = await api.get("/store/cart-items/");
            setCartItems(Array.isArray(data) ? data : data.results);
        } catch (err) {
            setError("Failed to update quantity. Please try again.");
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`/store/cart-items/${itemId}/`);
            setCartItems(items => items.filter(item => item.id !== itemId));
        } catch (err) {
            setError("Failed to remove item. Please try again.");
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const itemTotal = item.total_price || (item.product?.price ? item.quantity * item.product.price : 0);
            return sum + itemTotal;
        }, 0);
    };

    // Handle checkout when the user submits shipping details
    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (!shippingAddress || !contactNumber) {
            setError("Shipping address and contact number are required.");
            return;
        }

        try {
            const response = await api.post("/store/orders/", {
                shipping_address: shippingAddress,
                contact_info: contactNumber, // use contactNumber state variable
            });
            console.log("Order created:", response.data);
            navigate(`/order/${response.data.id}`);
        } catch (err) {
            console.error("Error placing order:", err);
            setError("Failed to place order. Please try again.");
        }
    };

    // Toggle display of checkout form
    const handleCheckout = () => {
        setShowCheckoutForm(true);
    };

    if (isLoading) {
        return (
            <div className="min-vh-80 d-flex justify-content-center align-items-center">
                <div className="spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger mx-auto mt-5 max-w-600 text-center">
                {error}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container-fluid py-5 bg-light min-vh-100"
        >
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex align-items-center gap-3 mb-5">
                        <FontAwesomeIcon icon={faBagShopping} className="text-primary h2" />
                        <h1 className="mb-0">Your Shopping Bag</h1>
                        <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
                    </div>

                    <AnimatePresence>
                        {cartItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-5"
                            >
                                <div className="mb-4" style={{ fontSize: '5rem' }}>🛒</div>
                                <h2 className="mb-3">Your bag is feeling light!</h2>
                                <Link to="/products" className="btn btn-primary btn-lg">
                                    Continue Shopping
                                </Link>
                            </motion.div>
                        ) : (
                            <>
                                <div className="row g-4 mb-4">
                                    {cartItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 50 }}
                                            className="col-12"
                                        >
                                            <div className="card shadow-sm hover-shadow-lg transition-all">
                                                <div className="card-body d-flex gap-4">
                                                    <img
                                                        src={
                                                            item.product?.images?.length > 0
                                                                ? item.product.images[0].image
                                                                : '/placeholder-product.jpg'
                                                        }
                                                        alt={item.product?.name || "Product Image"}
                                                        className="rounded-3"
                                                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                                                        loading="lazy"
                                                    />
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <h5 className="mb-0">
                                                                {item.product?.name || "Unnamed Product"}
                                                            </h5>
                                                            <button
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                className="btn btn-link text-danger p-0"
                                                            >
                                                                <FontAwesomeIcon icon={faTimes} />
                                                            </button>
                                                        </div>
                                                        <p className="text-muted mb-2">
                                                            Unit Price: GH₵ {item.product?.unit_price || 'N/A'}
                                                        </p>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btn btn-outline-secondary"
                                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                                >
                                                                    <FontAwesomeIcon icon={faMinus} />
                                                                </button>
                                                                <span className="btn px-4">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    className="btn btn-outline-secondary"
                                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                                >
                                                                    <FontAwesomeIcon icon={faPlus} />
                                                                </button>
                                                            </div>
                                                            <div className="h5 mb-0">
                                                                GH₵ {(item.total_price || (item.product?.price * item.quantity) || 0).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="row justify-content-end">
                                    <div className="col-md-6">
                                        <div className="card shadow-lg border-0 bg-primary text-white">
                                            <div className="card-body">
                                                <h3 className="mb-4">Order Summary</h3>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Subtotal ({cartItems.length} items)</span>
                                                    <span>GH₵ {calculateTotal().toFixed(2)}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-4">
                                                    <span>Estimated Shipping</span>
                                                    <span>FREE</span>
                                                </div>
                                                <hr className="my-4 opacity-100" />
                                                <div className="d-flex justify-content-between h4 mb-4">
                                                    <span>Total</span>
                                                    <span>GH₵ {calculateTotal().toFixed(2)}</span>
                                                </div>
                                                {showCheckoutForm ? (
                                                    // Checkout form for shipping & contact info
                                                    <form onSubmit={handleCheckoutSubmit}>
                                                        <div className="mb-3">
                                                            <label htmlFor="shippingAddress" className="form-label">
                                                                Shipping Address
                                                            </label>
                                                            <textarea
                                                                id="shippingAddress"
                                                                className="form-control"
                                                                value={shippingAddress}
                                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="contactNumber" className="form-label">
                                                                Contact Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="contactNumber"
                                                                className="form-control"
                                                                value={contactNumber} // changed from contactinfo to contactNumber
                                                                onChange={(e) => setContactNumber(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <button type="submit" className="btn btn-light btn-lg w-100 py-3">
                                                            Confirm Order
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <button
                                                        className="btn btn-light btn-lg w-100 py-3"
                                                        disabled={cartItems.length === 0}
                                                        onClick={handleCheckout}
                                                    >
                                                        Proceed to Checkout
                                                    </button>
                                                )}
                                                <div className="text-center mt-3">
                                                    <Link to="/products" className="text-white">
                                                        ← Continue Shopping
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
