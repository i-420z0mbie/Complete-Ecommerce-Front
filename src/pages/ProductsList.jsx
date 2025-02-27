import { useState, useEffect } from "react";
import api from "../api.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, HeartFill } from "react-bootstrap-icons";

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState([]);
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

    // Toggle wishlist status using normal alerts for feedback.
    // Note: We pass { skipAuthRefresh: true } to bypass the token refresh interceptor.
    const toggleWishlist = async (productId, e) => {
        e.stopPropagation();
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
        }
    };

    // Helper to check if a product is already in the wishlist
    const isInWishlist = (productId) => {
        return wishlist.some(item => item.product === productId);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger text-center">{error}</div>
            </div>
        );
    }

    // Main render: product list
    return (
        <div className="container my-5">
            <div className="row">
                {products.map((product) => (
                    <div key={product.id} className="col-md-4 col-sm-6 mb-4">
                        <div
                            className="card h-100 shadow-sm hover-effect"
                            onClick={() => nav(`/store/products/${product.id}`)}
                        >
                            <div
                                className="wishlist-button"
                                onClick={(e) => toggleWishlist(product.id, e)}
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    zIndex: 2,
                                    cursor: "pointer",
                                }}
                            >
                                {isInWishlist(product.id) ? (
                                    <HeartFill className="text-danger" size={24} />
                                ) : (
                                    <Heart className="text-muted" size={24} />
                                )}
                            </div>
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0].image}
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{
                                        objectFit: "cover",
                                        height: "200px",
                                        width: "100%",
                                    }}
                                />
                            ) : (
                                <div className="card-img-top bg-secondary" style={{ height: "200px" }}></div>
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">GH₵ {product.unit_price}</p>
                            </div>
                            <div className="card-footer bg-transparent border-top">
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nav(`/store/products/${product.id}`);
                                    }}
                                >
                                    View Product
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
