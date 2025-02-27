import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Hero.css"; // Ensure this file exists with any extra styling you want

const Hero = () => {
    const [heroImages, setHeroImages] = useState([]);
    const navigate = useNavigate();

    // For demonstration, using static data.
    // Replace this with an API call when ready.
    useEffect(() => {
        const staticHeroImages = [
            {
                id: 1,
                title: "Computers & Accessories",
                description: "Everything you need in one place",
                image: "/hero_images/accessories.jpg",
                link: "/category/electronics",
            },
            {
                id: 2,
                title: "Online Shopping Made Easy!",
                description: "Comfort and style at great prices",
                image: "/hero_images/ecommerce-statistics.jpg",
                link: "/category/furniture",
            },
            {
                id: 3,
                title: "Best Deals",
                description: "Build Your Own Rig With Us. Don't Miss Out!",
                image: "/hero_images/hardware.jpg",
                link: "/deals",
            },
            {
                id: 4,
                title: "Jewelly & Watches",
                description: "Find what makes you glow!",
                image: "/hero_images/jewellry.jpg",
                link: "/deals",
            },
            {
                id: 5,
                title: "Computers & Accessories",
                description: "Everything you need in one place",
                image: "/hero_images/accessories.jpg",
                link: "/category/graphics-cards",
            },
        ];
        setHeroImages(staticHeroImages);
    }, []);

    // Initialize the carousel when images are loaded
    useEffect(() => {
        const carouselElement = document.getElementById("heroCarousel");
        if (carouselElement && window.bootstrap) {
            new window.bootstrap.Carousel(carouselElement, {
                interval: 2000,
                ride: "carousel",
            });
        }
    }, [heroImages]);

    if (heroImages.length === 0) return null;

    return (
        <div
            id="heroCarousel"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
            data-bs-interval="5000"
        >
            <div className="carousel-inner">
                {heroImages.map((hero, index) => (
                    <div
                        key={hero.id}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                        <img
                            src={hero.image}
                            className="d-block w-100 hero-image"
                            alt={hero.title || "Hero"}
                            style={{
                                height: "500px", // Adjust height as needed
                                objectFit: "cover", // Use "cover" to fill the container
                                objectPosition: "center",
                            }}
                        />
                        <div className="carousel-caption d-none d-md-block">
                            {hero.title && <h5>{hero.title}</h5>}
                            {hero.description && <p>{hero.description}</p>}
                            {hero.link && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(hero.link)}
                                >
                                    Shop Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default Hero;
