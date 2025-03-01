import React, { useState, useEffect } from "react";
import api from "../api.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, HeartFill } from "react-bootstrap-icons";
import "animate.css/animate.min.css";

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

    // Toggle wishlist status using alerts for feedback.
    // Note: We pass { skipAuthRefresh: true } to bypass the token refresh interceptor.
    const toggleWishlist = async (productId, e) => {
        e.stopPropagation();
        // Add productId to wishlistLoading to show loading animation
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
            // Remove productId from wishlistLoading after the request completes
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

    // Loading state with enhanced animation
    if (isLoading) {
        return (
            <div className="container my-5 text-center">
                <div
                    className="spinner-border text-primary animate__animated animate__pulse animate__infinite"
                    style={{ width: "3rem", height: "3rem" }}
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted animate__animated animate__fadeIn">
                    Curating Amazing Products...
                </p>
            </div>
        );
    }

    // Error state with enhanced styling
    if (error) {
        return (
            <div className="container my-5 animate__animated animate__shakeX">
                <div
                    className="alert alert-danger text-center shadow-lg"
                    style={{ borderRadius: "20px" }}
                >
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    // Main render: product list with enhanced UI & animations
    return (
        <div className="container my-5">
            <div className="row g-4">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="col-md-4 col-sm-6"
                        style={{
                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s`,
                            animationFillMode: "backwards"
                        }}
                    >
                        <div
                            className="card h-100 shadow-lg border-0 overflow-hidden product-card"
                            onClick={() => nav(`/store/products/${product.id}`)}
                            style={{
                                borderRadius: "15px",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                cursor: "pointer"
                            }}
                        >
                            {/* Wishlist Button with animations */}
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
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                {wishlistLoading.includes(product.id) ? (
                                    <div
                                        className="spinner-border spinner-border-sm text-primary"
                                        style={{ animation: "pulse 1s infinite" }}
                                        role="status"
                                    />
                                ) : (
                                    isInWishlist(product.id) ? (
                                        <HeartFill className="text-danger animate__animated animate__heartBeat" size={28} />
                                    ) : (
                                        <Heart
                                            className="text-white animate__animated animate__pulse"
                                            size={28}
                                            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
                                        />
                                    )
                                )}
                            </div>

                            {/* Product Image with Hover Zoom */}
                            <div className="overflow-hidden position-relative" style={{ height: "250px" }}>
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0].image}
                                        alt={product.name}
                                        className="img-fluid h-100 w-100 object-fit-cover product-image"
                                        loading="lazy"
                                        style={{ transition: "transform 0.3s ease-out" }}
                                    />
                                ) : (
                                    <div className="h-100 w-100 bg-gradient-secondary d-flex align-items-center justify-content-center">
                                        <span className="text-white">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="card-body position-relative bg-light">
                                <div
                                    className="position-absolute top-0 start-0 w-100 bg-primary"
                                    style={{ height: "4px", transform: "translateY(-100%)" }}
                                />
                                <h5 className="card-title fw-bold mb-3 text-truncate">
                                    {product.name}
                                </h5>
                                {/* Inventory and Ratings */}
                                <div className="mb-2">
                                    {product.inventory > 0 ? (
                                        <span className="badge bg-success me-2">
                                            In Stock: {product.inventory}
                                        </span>
                                    ) : (
                                        <span className="badge bg-danger me-2">
                                            Out of Stock
                                        </span>
                                    )}
                                    {product.average_rating != null && (
                                        <span>{renderStars(product.average_rating)}</span>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="card-text fs-4 fw-bold text-primary mb-0">
                                        GH₵ {product.unit_price}
                                    </p>
                                    <button
                                        className="btn btn-primary rounded-pill px-4 py-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nav(`/store/products/${product.id}`);
                                        }}
                                        style={{
                                            transition: "all 0.3s",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                                        }}
                                    >
                                        View Product
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom CSS Animations and Styling */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
                }

                .product-image:hover {
                    transform: scale(1.05);
                }

                .hover-effect:hover {
                    transform: scale(1.02);
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                .bg-gradient-secondary {
                    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                }
            `}</style>
        </div>
    );
}
