import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";

export default function CatHome() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const res = await api.get("/store/categories/");
                setCategories(res.data);
            } catch (err) {
                setError("Failed to fetch categories");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="container my-5 fade-in">
            <h1 className="text-center mb-5">Explore Categories</h1>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : (
                <div className="row">
                    {categories.map((category) => (
                        <div key={category.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                            <div
                                className="card h-100 shadow-sm animate-card"
                                onClick={() => nav(`/category/${category.slug}`)}
                            >
                                {category.images && category.images.length > 0 ? (
                                    <img
                                        src={category.images[0].image}
                                        className="card-img-top"
                                        alt={category.name}
                                        style={{ objectFit: "cover", height: "200px", width: "100%" }}
                                    />
                                ) : (
                                    <div className="card-img-top bg-secondary" style={{ height: "200px" }}></div>
                                )}
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <h5 className="card-title text-center italic-bold-text">
                                        {category.name}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx="true">{`
                /* Fade in animation for the main container */
                .fade-in {
                    animation: fadeInAnimation 1s ease-in-out;
                }
                @keyframes fadeInAnimation {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Card styling and hover animation */
                .animate-card {
                    background-color: #444444;
                    color: ghostwhite;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }
                .animate-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                }

                .card-title {
                    font-weight: bold;
                    font-size: 1.2rem;
                }

                /* Responsive adjustments */
                @media (max-width: 576px) {
                    .card-img-top {
                        height: 150px !important;
                    }
                }
            `}</style>
        </div>
    );
}
