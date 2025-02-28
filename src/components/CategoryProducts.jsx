import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { Heart, HeartFill } from "react-bootstrap-icons";

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
                // Build query string based on URL parameters:
                // For example, if URL is /category/electronics/graphics-cards,
                // then query becomes ?category__slug=electronics&subcategory__slug=graphics-cards
                let query = "?";
                if (categorySlug) query += `category__slug=${categorySlug}&`;
                if (subCategorySlug) query += `subcategory__slug=${subCategorySlug}&`;
                if (subSubCategorySlug)
                    query += `subsubcategory__slug=${subSubCategorySlug}&`;
                query = query.slice(0, -1); // remove trailing &
                const res = await api.get(`/store/products/${query}`);
                // In case your API is paginated:
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

    // Render a heading showing the category hierarchy
    const renderBreadcrumb = () => {
        const parts = [];
        if (categorySlug) parts.push(categorySlug.replace(/-/g, " "));
        if (subCategorySlug) parts.push(subCategorySlug.replace(/-/g, " "));
        if (subSubCategorySlug)
            parts.push(subSubCategorySlug.replace(/-/g, " "));
        return parts.join(" > ");
    };

    if (isLoading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading products...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger text-center">{error}</div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="container my-5">
                <div className="text-center">
                    <h4>No products found in this category.</h4>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h1 className="mb-4 text-center">{renderBreadcrumb()}</h1>
            <div className="row">
                {products.map((product) => (
                    <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div
                            className="card h-100 shadow-sm hover-effect"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/store/products/${product.id}`)}
                        >
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0].image}
                                    alt={product.name}
                                    className="img-fluid object-fit-md-contain"
                                    loading="lazy"
                                />
                            ) : (
                                <div
                                    className="card-img-top bg-secondary"
                                    style={{ height: "400px" }}
                                ></div>
                            )}
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-primary fw-bold">
                                    GH₵ {product.unit_price}
                                </p>
                                <button
                                    className="btn btn-outline-primary mt-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/store/products/${product.id}`);
                                    }}
                                >
                                    View Product
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style jsx="true">{`
        .hover-effect:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
      `}</style>
        </div>
    );
}
