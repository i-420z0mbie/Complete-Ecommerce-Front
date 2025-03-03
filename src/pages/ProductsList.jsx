import React, { useState, useEffect } from "react";
import api from "../api.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { motion } from "framer-motion";

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState([]);
    const location = useLocation();
    const nav = useNavigate();

    // Fetch products based on query params
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/store/products/${location.search}`);
                setProducts(res.data);
            } catch (err) {
                setError("Error fetching products!");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [location.search]);

    // Fetch wishlist items
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await api.get("/store/wishlists/");
                setWishlist(res.data);
            } catch (err) {
                console.error("Error fetching wishlist", err);
            }
        };
        fetchWishlist();
    }, []);

    const toggleWishlist = async (productId, e) => {
        e.stopPropagation();
        setWishlistLoading(prev => [...prev, productId]);
        const existingItem = wishlist.find(item => item.product === productId);
        try {
            if (existingItem) {
                await api.delete(`/store/wishlists/${existingItem.id}/`, { skipAuthRefresh: true });
                setWishlist(prev => prev.filter(item => item.id !== existingItem.id));
            } else {
                const response = await api.post(
                    "/store/wishlists/",
                    { product: productId },
                    { skipAuthRefresh: true }
                );
                setWishlist(prev => [...prev, response.data]);
                alert("Added to your wishlist!");
            }
        } catch (err) {
            console.error("Wishlist error:", err);
            const status = err.response?.status || "Unknown";
            if (err.response && err.response.status === 401) {
                alert("You need to log in to add to your wishlist. (Error Status: " + status + ")");
            } else {
                alert("An error occurred while updating your wishlist. (Error Status: " + status + ")");
            }
        } finally {
            setWishlistLoading(prev => prev.filter(id => id !== productId));
        }
    };

    // Helper to check if a product is already in the wishlist
    const isInWishlist = (productId) => {
        return wishlist.some(item => item.product === productId);
    };

    // Render stars for product rating (ratings out of 5)
    const renderStars = (rating) => {
        const starStyle = { fontSize: "0.8rem" };
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning" style={starStyle}></i>);
            } else if (rating >= i - 0.5) {
                stars.push(<i key={i} className="bi bi-star-half text-warning" style={starStyle}></i>);
            } else {
                stars.push(<i key={i} className="bi bi-star text-warning" style={starStyle}></i>);
            }
        }
        return stars;
    };

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container my-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ rotate: 360, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="spinner-border text-primary"
                    style={{ width: "4rem", height: "4rem" }}
                    role="status"
                >
                    <span className="visually-hidden">Loading products...</span>
                </motion.div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 h5 text-muted">
                    Curating Your Selection...
                </motion.p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="container my-5">
                <div className="alert alert-danger text-center">{error}</div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container my-5">
            <div className="row g-4">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        className="col-xl-4 col-lg-4 col-md-6"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div
                            className="card h-100 shadow-lg border-0 overflow-hidden product-card hover-effect"
                            style={{
                                borderRadius: "20px",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                cursor: "pointer",
                                minWidth: "350px"
                            }}
                            onClick={() => nav(`/store/products/${product.id}`)}
                        >
                            {/* Wishlist Button */}
                            <div
                                className="wishlist-button"
                                onClick={(e) => toggleWishlist(product.id, e)}
                                style={{
                                    position: "absolute",
                                    top: "15px",
                                    right: "15px",
                                    zIndex: 2,
                                    cursor: "pointer",
                                    transition: "transform 0.3s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                {wishlistLoading.includes(product.id) ? (
                                    <div
                                        className="spinner-border spinner-border-sm text-primary"
                                        style={{ animation: "pulse 1s infinite" }}
                                        role="status"
                                    />
                                ) : (
                                    isInWishlist(product.id) ? (
                                        <HeartFill className="text-danger" size={28} />
                                    ) : (
                                        <Heart
                                            className="text-white"
                                            size={28}
                                            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
                                        />
                                    )
                                )}
                            </div>


                            <div className="image-container overflow-hidden position-relative" style={{ height: "320px" }}>
                                {product.images && product.images.length > 0 ? (
                                    <motion.img
                                        src={product.images[0].image}
                                        alt={product.name}
                                        className="img-fluid h-100 w-100 object-fit-contain"
                                        loading="lazy"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    />
                                ) : (
                                    <div className="h-100 w-100 bg-gradient-secondary d-flex align-items-center justify-content-center">
                                        <span className="text-white">📷 Image Coming Soon!</span>
                                    </div>
                                )}
                                <div className="gradient-overlay" />
                            </div>


                            <div className="card-body position-relative bg-light">
                                <div
                                    className="position-absolute top-0 start-0 w-100 bg-primary"
                                    style={{ height: "3px", transform: "translateY(-100%)" }}
                                />
                                <h5 className="card-title fw-bold mb-3 text-truncate">{product.name}</h5>
                                <p className="card-text small text-muted">
                                    {product.description
                                        ? product.description.slice(0, 80) + "..."
                                        : "No description available."}
                                </p>
                                <div className="mb-2">
                                    {product.inventory > 0 ? (
                                        <span className="badge bg-success me-2">In Stock: {product.inventory}</span>
                                    ) : (
                                        <span className="badge bg-danger me-2">Out of Stock</span>
                                    )}
                                    {product.average_rating != null && (
                                        <span>
                                            {renderStars(product.average_rating)}{" "}
                                            <small>({product.reviews?.length || 0} reviews)</small>
                                        </span>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="card-text fs-4 fw-bold text-gradient-primary mb-0">
                                        GH₵ {product.unit_price}
                                    </p>
                                    <motion.button
                                        className="btn btn-gradient-primary rounded-pill px-4"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nav(`/store/products/${product.id}`);
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Explore ➔
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <style jsx="true">{`
                .gradient-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 40%;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
                }
                .product-card:hover {
                    transform: translateY(-10px) rotateZ(1deg);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                }
                .text-gradient-primary {
                    background: linear-gradient(45deg, #007bff, #00ff88);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .btn-gradient-primary {
                    background: linear-gradient(45deg, #007bff, #00ff88);
                    border: none;
                    color: white;
                    transition: all 0.3s ease;
                }
                .bg-gradient-secondary {
                    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </motion.div>
    );
}
