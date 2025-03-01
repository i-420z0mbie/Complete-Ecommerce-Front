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
            {/* Animated Background Elements */}
            <div className="animated-bg-elements">
                <div className="gradient-circle-1"></div>
                <div className="gradient-circle-2"></div>
                <div className="floating-particles"></div>
            </div>

            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-5 display-3 fw-bold text-stroke"
            >
                Discover Our
                <br />
                <span className="text-gradient">Collections</span>
            </motion.h1>

            {isLoading ? (
                <motion.div
                    className="text-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    <div className="spinner-grow text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-light pulse-text">Curating Experiences...</p>
                </motion.div>
            ) : error ? (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="alert alert-glass-danger text-center mx-auto"
                    style={{ maxWidth: "500px" }}
                >
                    ⚠️ {error}
                </motion.div>
            ) : (
                <div className="row g-4 px-3 px-md-5">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            // Fewer columns per row now: 4 on xl, 3 on lg, 2 on md and full-width on sm
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
                                whileHover={{
                                    scale: 1.05,
                                    rotateX: 5,
                                    rotateY: -5,
                                    boxShadow: "0 35px 60px -15px rgba(0,0,0,0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="card h-100 shadow-lg border-0 overflow-hidden category-card"
                                onClick={() => nav(`/category/${category.slug}`)}
                                style={{ cursor: "pointer", minWidth: "300px" }}
                            >
                                {/* Image Container with Parallax Effect */}
                                <div className="card-img-container parallax-container">
                                    {category.images?.length > 0 ? (
                                        <motion.img
                                            src={category.images[0].image}
                                            className="card-img-top parallax-image"
                                            alt={category.name}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        />
                                    ) : (
                                        <div className="placeholder-art">
                                            <div className="geometric-pattern"></div>
                                        </div>
                                    )}
                                    <div className="gradient-overlay"></div>
                                    <div className="shine-effect"></div>
                                </div>

                                {/* Card Content */}
                                <div className="card-body position-relative z-2">
                                    <h5 className="card-title text-center text-light mb-0">
                                        {category.name}
                                        <FiChevronRight className="ms-2 arrow-icon" />
                                    </h5>
                                    <div className="floating-tags">
                                        <span>New</span>
                                        <span>Trending</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            )}

            <style jsx="true">{`
                .cat-home-container {
                    position: relative;
                    background: linear-gradient(
                            45deg,
                            #1c1b2b 0%,
                            #e3e2e8 50%,
                            #9273b5 100%
                    );
                    overflow: hidden;
                }

                .animated-bg-elements {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                }

                .gradient-circle-1 {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(
                            rgba(154, 69, 181, 0.15),
                            transparent 70%
                    );
                    top: -200px;
                    left: -200px;
                    animation: float 12s infinite linear;
                }

                .gradient-circle-2 {
                    position: absolute;
                    width: 800px;
                    height: 800px;
                    background: radial-gradient(
                            rgba(33, 150, 243, 0.1),
                            transparent 70%
                    );
                    bottom: -400px;
                    right: -300px;
                    animation: float 15s infinite linear reverse;
                }

                @keyframes float {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    25% {
                        transform: translate(100px, 100px) rotate(90deg);
                    }
                    50% {
                        transform: translate(50px, 200px) rotate(180deg);
                    }
                    75% {
                        transform: translate(-100px, 100px) rotate(270deg);
                    }
                    100% {
                        transform: translate(0, 0) rotate(360deg);
                    }
                }

                .category-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(12px);
                    border-radius: 20px;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transform-style: preserve-3d;
                }

                .parallax-container {
                    height: 250px;
                    overflow: hidden;
                    position: relative;
                    perspective: 1000px;
                }

                .parallax-image {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                    transform: translateZ(30px);
                }

                .gradient-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                            180deg,
                            rgba(0, 0, 0, 0) 0%,
                            rgba(0, 0, 0, 0.6) 100%
                    );
                    z-index: 1;
                }

                .shine-effect {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                            45deg,
                            rgba(255, 255, 255, 0) 45%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 55%
                    );
                    animation: shine 5s infinite;
                    z-index: 2;
                }

                @keyframes shine {
                    0% {
                        transform: translate(-50%, -50%) rotate(45deg);
                    }
                    100% {
                        transform: translate(150%, 150%) rotate(45deg);
                    }
                }

                .text-gradient {
                    background: linear-gradient(45deg, #ff6b6b, #ffd93d);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .text-stroke {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }

                .arrow-icon {
                    transition: transform 0.3s ease;
                }

                .category-card:hover .arrow-icon {
                    transform: translateX(5px);
                }

                .floating-tags {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                }

                .floating-tags span {
                    background: linear-gradient(45deg, #4caf50, #8bc34a);
                    padding: 4px 12px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    animation: float-up 3s infinite;
                }

                @keyframes float-up {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }

                .alert-glass-danger {
                    background: rgba(255, 0, 0, 0.15);
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255, 0, 0, 0.2);
                    border-radius: 15px;
                }

                .pulse-text {
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                @media (max-width: 768px) {
                    .parallax-container {
                        height: 180px;
                    }

                    .category-card {
                        margin-bottom: 1.5rem;
                    }
                }
            `}</style>
        </motion.div>
    );
}
