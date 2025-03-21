// src/components/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (query) {
                setLoading(true);
                try {
                    const response = await api.get(`/store/products/?search=${query}`);
                    setProducts(response.data);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="container mt-4">
            <h2>Search Results for "{query}"</h2>
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : products.length > 0 ? (
                <div className="row">
                    {products.map((product) => (
                        <div key={product.id} className="col-xl-4 col-lg-4 col-md-6 mb-3">
                            <div
                                className="card h-100 shadow-lg border-0 overflow-hidden product-card hover-effect"
                                style={{ borderRadius: "20px", cursor: "pointer", minWidth: "350px" }}
                            >
                                {/* Image Container */}
                                <div className="image-container overflow-hidden position-relative" style={{ height: "320px" }}>
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].image}
                                            alt={product.name}
                                            className="img-fluid h-100 w-100 object-fit-contain"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-100 w-100 bg-gradient-secondary d-flex align-items-center justify-content-center">
                                            <span className="text-white">📷 Image Coming Soon!</span>
                                        </div>
                                    )}
                                    <div className="gradient-overlay" />
                                </div>

                                {/* Product Info */}
                                <div className="card-body bg-light">
                                    <h5 className="card-title fw-bold text-truncate">{product.name}</h5>
                                    <p className="card-text">
                                        GH₵{" "}
                                        {product.unit_price
                                            ? parseFloat(product.unit_price).toFixed(2)
                                            : "N/A"}
                                    </p>
                                    <a href={`/store/products/${product.id}`} className="btn btn-primary">
                                        View Product
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found.</p>
            )}
            <style jsx="true">{`
                .gradient-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 40%;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
                }
            `}</style>
        </div>
    );
};

export default SearchResults;
