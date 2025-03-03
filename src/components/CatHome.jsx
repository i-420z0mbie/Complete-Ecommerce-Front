import React, { useEffect, useState } from "react";
import api from "../api.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";

export default function CatHome() {
    // Define state variables for categories, loading status, and errors
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="cat-home-container container-fluid min-vh-100 d-flex flex-column justify-content-center py-5"
        >
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-5 display-3 fw-bold"
            >
                Discover Our Collections
            </motion.h1>

            {isLoading ? (
                <motion.div
                    className="text-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    <div className="spinner-grow text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-dark">Curating Experiences...</p>
                </motion.div>
            ) : error ? (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="alert alert-danger text-center mx-auto"
                    style={{ maxWidth: "500px" }}
                >
                    ⚠️ {error}
                </motion.div>
            ) : (
                <div className="row g-4 px-3 px-md-5">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                type: "spring",
                                delay: index * 0.05,
                                stiffness: 100,
                                damping: 20,
                            }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="card h-100 shadow border-0 category-card"
                                onClick={() => nav(`/category/${category.slug}`)}
                                style={{ cursor: "pointer", minWidth: "300px" }}
                            >
                                <div className="card-img-container">
                                    {category.images?.length > 0 ? (
                                        <motion.img
                                            src={category.images[0].image}
                                            className="card-img-top"
                                            alt={category.name}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        />
                                    ) : (
                                        <div className="placeholder-art">
                                            <div className="geometric-pattern"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="card-body text-center">
                                    <h5 className="card-title text-dark mb-0">
                                        {category.name}
                                        <FiChevronRight className="ms-2 arrow-icon" />
                                    </h5>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            )}

            <style jsx="true">{`
                .cat-home-container {
                    position: relative;
                    background: #f7f7f7;
                    overflow: hidden;
                    padding: 3rem 0;
                }

                /* Clean Card Design */
                .category-card {
                    background: #ffffff;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .card-img-container {
                    height: 200px;
                    overflow: hidden;
                    position: relative;
                }

                .card-img-container img {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .card-img-container img:hover {
                    transform: scale(1.05);
                }

                .card-body {
                    padding: 1rem;
                }

                .arrow-icon {
                    transition: transform 0.3s ease;
                }

                .category-card:hover .arrow-icon {
                    transform: translateX(5px);
                }

                @media (max-width: 768px) {
                    .card-img-container {
                        height: 150px;
                    }
                }
            `}</style>
        </motion.div>
    );
}
