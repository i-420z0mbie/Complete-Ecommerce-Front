import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";

// Helper function to render star ratings based on a numeric rating
const renderStars = (rating) => {
    const starStyle = { fontSize: "0.8rem" };
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(
                <i key={i} className="bi bi-star-fill text-warning" style={starStyle}></i>
            );
        } else if (rating >= i - 0.5) {
            stars.push(
                <i key={i} className="bi bi-star-half text-warning" style={starStyle}></i>
            );
        } else {
            stars.push(
                <i key={i} className="bi bi-star text-warning" style={starStyle}></i>
            );
        }
    }
    return stars;
};

export default function CategoryProducts() {
    const { categorySlug, subCategorySlug, subSubCategorySlug } = useParams();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {

                let query = "?";
                if (categorySlug) query += `category__slug=${categorySlug}&`;
                if (subCategorySlug) query += `subcategory__slug=${subCategorySlug}&`;
                if (subSubCategorySlug) query += `subsubcategory__slug=${subSubCategorySlug}&`;
                query = query.slice(0, -1); // Remove trailing "&"

                const res = await api.get(`/store/products/${query}`);

                const data = Array.isArray(res.data) ? res.data : res.data.results;
                setProducts(data);
            } catch (err) {
                setError("Failed to fetch products.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [categorySlug, subCategorySlug, subSubCategorySlug]);


    const renderBreadcrumb = () => {
        const parts = [];
        if (categorySlug) parts.push(categorySlug.replace(/-/g, " "));
        if (subCategorySlug) parts.push(subCategorySlug.replace(/-/g, " "));
        if (subSubCategorySlug) parts.push(subSubCategorySlug.replace(/-/g, " "));
        return parts.join(" > ");
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="container my-6 text-center"
            >
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
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 h5 text-muted"
                >
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

    if (products.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container my-8 text-center">
                <div className="glass-card p-5 rounded-4">
                    <div className="display-1 mb-3">🛍️</div>
                    <h3 className="text-muted mb-4">No products found in this category.</h3>
                    <button className="btn btn-gradient-primary rounded-pill px-5" onClick={() => navigate(-1)}>
                        Explore Other Categories
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container my-5">
            <h1 className="mb-4 text-center">{renderBreadcrumb()}</h1>
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
                            onClick={() => navigate(`/store/products/${product.id}`)}
                        >
                            {/* Image Section with Hover Effect */}
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
                                            navigate(`/store/products/${product.id}`);
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
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
                    !important;
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
