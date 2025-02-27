import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaRocket } from "react-icons/fa";
import "../Footer.css";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <footer className="footer bg-gradient-anim pt-5 pb-3">
            <div className="container">
                <div className="row g-5">
                    {/* Company Info */}
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="footer-logo-wrapper mb-4">
                            <h3 className="logo-text glow-text">z0mbiefied: The store</h3>
                        </div>
                        <p className="mb-4 footer-description">
                            Giving you all good things in one place
                        </p>
                        <div className="contact-info">
                            <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-geo-alt-fill me-2 pulse-icon"></i>
                                <span>z0mbified street</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-envelope-fill me-2 pulse-icon"></i>
                                <a href="mailto:info@yourcompany.com" className="hvr-underline">info@thestorez0mbie.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links with Hover Effects */}
                    <div className="col-xl-2 col-lg-4 col-md-6">
                        <h5 className="footer-heading mb-4">Explore</h5>
                        <ul className="list-unstyled">
                            <li className="mb-3">
                                <a href="/shop" className="footer-link hvr-slide-right">
                                    <span className="link-icon">→</span> Premium Products
                                </a>
                            </li>
                            <li className="mb-3">
                                <a href="/about" className="footer-link hvr-slide-right">
                                    <span className="link-icon">→</span> Our Vision
                                </a>
                            </li>
                            <li className="mb-3">
                                <a href="/careers" className="footer-link hvr-slide-right">
                                    <span className="link-icon">→</span> Join Our Team
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Customer Service with Interactive Icons */}
                    <div className="col-xl-2 col-lg-4 col-md-6">
                        <h5 className="footer-heading mb-4">Support</h5>
                        <ul className="list-unstyled">
                            <li className="mb-3">
                                <a href="/help" className="footer-link hvr-bounce-in">
                                    <FaRocket className="me-2 service-icon"/> Live Chat
                                </a>
                            </li>
                            <li className="mb-3">
                                <a href="/contact" className="footer-link hvr-bounce-in">
                                    <FaRocket className="me-2 service-icon"/> VIP Support
                                </a>
                            </li>
                            <li className="mb-3">
                                <a href="/returns" className="footer-link hvr-bounce-in">
                                    <FaRocket className="me-2 service-icon"/> Instant Returns
                                </a>
                            </li>
                            <li>
                                <a href="/faq" className="footer-link hvr-bounce-in">
                                    <FaRocket className="me-2 service-icon"/> Smart FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & Social Media */}
                    <div className="col-xl-3 col-lg-8 col-md-6">
                        <h5 className="footer-heading mb-4">Stay Connected</h5>
                        <div className="newsletter-card">
                            <p className="mb-3">Join our elite community for exclusive access:</p>
                            <form className="needs-validation" noValidate>
                                <div className="input-group mb-3">
                                    <input
                                        type="email"
                                        className="form-control futuristic-input"
                                        placeholder="Enter your email"
                                        required
                                    />
                                    <button className="btn btn-glow-primary" type="submit">
                                        Elevate Me
                                    </button>
                                </div>
                            </form>
                            <div className="social-links mt-4">
                                <a href="https://facebook.com" className="social-icon hvr-float">
                                    <FaFacebookF className="icon-fb"/>
                                </a>
                                <a href="https://twitter.com" className="social-icon hvr-float">
                                    <FaTwitter className="icon-tw"/>
                                </a>
                                <a href="https://instagram.com" className="social-icon hvr-float">
                                    <FaInstagram className="icon-ig"/>
                                </a>
                                <a href="https://linkedin.com" className="social-icon hvr-float">
                                    <FaLinkedinIn className="icon-li"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="footer-bottom mt-5 pt-4 border-top border-secondary">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-md-start text-center mb-3 mb-md-0">
                            <p className="mb-0 small">
                                © {new Date().getFullYear()} z0mbified: The store - Outworld Excellence Guaranteed.
                                <span className="legal-links ms-2">
                                    <a href="/privacy" className="text-white-50">Privacy Matrix</a> |
                                    <a href="/terms" className="text-white-50">Terms of Wonder</a>
                                </span>
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end text-center">
                            <button
                                onClick={scrollToTop}
                                className="back-to-top btn btn-dark hvr-bob"
                            >
                                <FaRocket className="me-2"/> To the Stars ↑
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;