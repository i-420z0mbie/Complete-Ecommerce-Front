import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Wishlist() {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [removing, setRemoving] = useState([]);
    const navigate = useNavigate();

    // Fetch wishlist entries and then load full product details for each entry.
    useEffect(() => {
        const fetchWishlistProducts = async () => {
            setIsLoading(true);
            try {
                // Fetch wishlist entries (each entry contains { id, product, date_added })
                const res = await api.get("/store/wishlists/");
                const wishlistEntries = res.data;
                // For each wishlist entry, fetch the full product details.
                const productPromises = wishlistEntries.map(async (entry) => {
                    const productRes = await api.get(`/store/products/${entry.product}/`);
                    return {
                        wishlist_id: entry.id,
                        date_added: entry.date_added,
                        product: productRes.data,
                    };
                });
                const items = await Promise.all(productPromises);
                setWishlistProducts(items);
            } catch (err) {
                setError("Error fetching wishlist products!");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlistProducts();
    }, []);

    // Remove a wishlist entry using its wishlist_id.
    const removeFromWishlist = async (wishlistId) => {
        // Add wishlistId to removing state to show loading animation
        setRemoving(prev => [...prev, wishlistId]);
        try {
            await api.delete(`/store/wishlists/${wishlistId}/`);
            setWishlistProducts((prev) =>
                prev.filter((item) => item.wishlist_id !== wishlistId)
            );
        } catch (err) {
            console.error("Error removing product from wishlist", err);
        } finally {
            // Remove wishlistId from removing state after request completes
            setRemoving(prev => prev.filter(id => id !== wishlistId));
        }
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4">Your Wishlist</h2>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : wishlistProducts.length === 0 ? (
                <div className="text-center">
                    <h4>Your wishlist is empty</h4>
                </div>
            ) : (
                <div className="row">
                    {wishlistProducts.map((item) => (
                        <div key={item.wishlist_id} className="col-md-4 col-sm-6 mb-4">
                            <div
                                className="card h-100 shadow-sm"
                                style={{ position: "relative", cursor: "pointer" }}
                                onClick={() => navigate(`/store/products/${item.product.id}`)}
                            >
                                {/* Remove button */}
                                <button
                                    className="btn btn-sm btn-danger"
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        zIndex: 2,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent navigating to product details.
                                        removeFromWishlist(item.wishlist_id);
                                    }}
                                    disabled={removing.includes(item.wishlist_id)}
                                >
                                    {removing.includes(item.wishlist_id) ? (
                                        <div className="spinner-border spinner-border-sm text-light" role="status">
                                            <span className="visually-hidden">Removing...</span>
                                        </div>
                                    ) : (
                                        "Remove"
                                    )}
                                </button>
                                {item.product.images && item.product.images.length > 0 ? (
                                    <img
                                        src={item.product.images[0].image}
                                        alt={item.product.name}
                                        className="card-img-top"
                                        style={{
                                            objectFit: "cover",
                                            height: "200px",
                                            width: "100%",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="card-img-top bg-secondary"
                                        style={{ height: "200px" }}
                                    ></div>
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{item.product.name}</h5>
                                    <p className="card-text">${item.product.unit_price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
