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
                            <h3 className="logo-text glow-text">NaoMall | Shopping</h3>
                        </div>
                        <p className="mb-4 footer-description">
                            Giving you all good things in one place
                        </p>
                        <div className="contact-info">
                            <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-geo-alt-fill me-2 pulse-icon"></i>
                                <span>naomall.com</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-envelope-fill me-2 pulse-icon"></i>
                                <a href="mailto:support@naomall.com" className="hvr-underline">support@naomall.com</a>
                            </div>
                        </div>
                    </div>


                    <div className="col-xl-3 col-lg-8 col-md-6">
                        <h5 className="footer-heading mb-4">Stay Connected</h5>
                        <div className="newsletter-card">
                            <p className="mb-3">Join our elite community for exclusive access:</p>
                            <div className="social-links mt-4">
                                <a href="https://www.facebook.com/noobNz0mbie/" className="social-icon hvr-float">
                                    <FaFacebookF className="icon-fb"/>
                                </a>
                                <a href="https://www.instagram.com/naomall_shopping/" className="social-icon hvr-float">
                                    <FaInstagram className="icon-ig"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="footer-bottom mt-5 pt-4 border-top border-secondary">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-md-start text-center mb-3 mb-md-0">
                            <p className="mb-0 small">
                                © {new Date().getFullYear()} NaoMall | Shopping - OutWorld Excellence And Smile Guaranteed.
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