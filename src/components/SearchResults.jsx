// src/components/SearchResults.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (query) {
                try {
                    const response = await api.get(`/store/products/?search=${query}`);
                    setProducts(response.data);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="container mt-4">
            <h2>Search Results for "{query}"</h2>
            {products.length > 0 ? (
                <div className="row">
                    {products.map((product) => (
                        <div key={product.id} className="col-md-4 mb-3">
                            <div className="card h-100">
                                {/* Image Gallery */}
                                <div className="ratio ratio-1x1 bg-light rounded-3 overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].image}
                                            alt={product.name}
                                            className="img-fluid object-fit-md-contain"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center text-muted">
                                            <i className="bi bi-image fs-1"></i>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">
                                        GH₵{" "}
                                        {product.unit_price
                                            ? parseFloat(product.unit_price).toFixed(2)
                                            : "N/A"}
                                    </p>
                                    <a href={`store/products/${product.id}`} className="btn btn-primary">
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
        </div>
    );
};

export default SearchResults;
