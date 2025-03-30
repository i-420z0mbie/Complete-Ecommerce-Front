import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import { useCart } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";

const ProductsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartId } = useCart();
    const { isAuthenticated } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // State for checkout form (for "Buy Now")
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [shippingAddress, setShippingAddress] = useState("");
    const [contactInfo, setContactInfo] = useState("");

    // State for showing seller contact details
    const [showContactDetails, setShowContactDetails] = useState(false);

    // Loading states for buttons
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [isContactingSeller, setIsContactingSeller] = useState(false);
    const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

    // New state for added notification
    const [showAddedNotification, setShowAddedNotification] = useState(false);

    // New state for the currently showcased image
    const [selectedImage, setSelectedImage] = useState(null);

    // New state for review submission
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(1);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Refs for sections (smooth scrolling, etc.)
    const sectionRefs = {
        description: useRef(null),
        reviews: useRef(null),
        specification: useRef(null),
        store: useRef(null),
        relatedPosts: useRef(null),
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/store/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                setError("Failed to load product");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // When the product loads, set the first image as the default selected image
    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setSelectedImage(product.images[0].image);
        }
    }, [product]);

    const handleAddToCart = useCallback(async () => {
        if (!product || product.inventory < 1) {
            console.warn("No product available or out of stock");
            return;
        }
        setIsAddingToCart(true);
        try {
            console.log("Adding product to cart:", { productId: product.id, quantity });
            // Pass the custom flag to bypass token refresh for this call
            await addToCart(product.id, quantity, { skipAuthRefresh: true });
            toast.success("Product added to cart!");
            setShowAddedNotification(true);
            setTimeout(() => {
                setShowAddedNotification(false);
            }, 2000);
        } catch (err) {
            console.error("Error adding product to cart:", err.response || err.message);
            if (err.response && err.response.status === 401) {
                alert("You need to log in to add products to your cart.");
            } else {
                toast.error("Failed to add product to cart. Please try again.");
            }
        } finally {
            setIsAddingToCart(false);
        }
    }, [product, quantity, addToCart]);

    const handleConfirmOrder = useCallback(async () => {
        if (!shippingAddress.trim() || !contactInfo.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsConfirmingOrder(true);
        let activeCartId = cartId;
        if (!activeCartId) {
            try {
                const res = await api.get("/store/carts/");
                console.log("Carts response:", res.data);
                if (Array.isArray(res.data) && res.data.length > 0) {
                    activeCartId = res.data[0].id;
                } else if (res.data && res.data.id) {
                    activeCartId = res.data.id;
                } else {
                    toast.error("No active cart found");
                    setIsConfirmingOrder(false);
                    return;
                }
            } catch (err) {
                toast.error("No active cart found");
                setIsConfirmingOrder(false);
                return;
            }
        }

        try {
            console.log("Checkout: Creating order with cartId:", activeCartId);
            const { data: order } = await api.post("/store/orders/", {
                shipping_address: shippingAddress,
                contact_info: contactInfo,
                cart: activeCartId,
            });
            toast.success("Order placed!");
            navigate(`/order/${order.id}`);
        } catch (err) {
            console.error("Error placing order:", err.response || err.message);
            toast.error("Failed to place order");
        } finally {
            setIsConfirmingOrder(false);
        }
    }, [cartId, shippingAddress, contactInfo, navigate]);

    const handleBuyNow = useCallback(async () => {
        if (!product || product.inventory < 1) {
            toast.error("Product is out of stock");
            return;
        }
        setIsBuyingNow(true);
        try {
            // Pass the custom flag to bypass token refresh for this call as well
            await addToCart(product.id, quantity, { skipAuthRefresh: true });
            if (showCheckoutForm && shippingAddress.trim() && contactInfo.trim()) {
                await handleConfirmOrder();
            } else {
                setShowCheckoutForm(true);
            }
        } catch (err) {
            console.error("Error in Buy Now:", err.response || err.message);
            if (err.response && err.response.status === 401) {
                alert("You need to log in purchase a product.");
            } else {
                toast.error("Failed. Try again later");
            }
        } finally {
            setIsBuyingNow(false);
        }
    }, [product, quantity, addToCart, showCheckoutForm, shippingAddress, contactInfo, handleConfirmOrder]);

    const handleSubmitReview = useCallback(async () => {
        if (!isAuthenticated) {
            alert("You need to log in to submit a review and rating.");
            return;
        }
        if (newReview.trim() === "" || newRating <= 0) {
            alert("Please provide both a review and a rating.");
            return;
        }
        setIsSubmittingReview(true);
        try {
            // Post the review and rating to their separate endpoints
            await Promise.all([
                api.post(`/store/products/${id}/reviews/`, { review: newReview }),
                api.post(`/store/products/${id}/ratings/`, { rating: newRating }),
            ]);
            alert("Review submitted and pending verification.");
            // Clear the form on successful submission
            setNewReview("");
            setNewRating(1);
        } catch (err) {
            console.error("Error submitting review:", err.response || err.message);
            if (err.response && err.response.status === 403) {
                alert(err.response.data.detail || "You must purchase the product before leaving a review.");
            } else {
                alert("Failed to submit review. Please try again.");
            }
        } finally {
            setIsSubmittingReview(false);
        }
    }, [newReview, newRating, id, isAuthenticated]);

    const renderStars = useCallback((rating) => {
        const starStyle = { fontSize: "0.8rem" };
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning" style={starStyle}></i>);
            } else if (rating >= i - 0.5) {
                stars.push(<i key={i} className="bi bi-star-half text-warning" style={starStyle}></i>);
            } else {
                stars.push(<i key={i} className="bi bi-star text-warning" style={starStyle}></i>);
            }
        }
        return stars;
    }, []);

    const scrollToSection = useCallback(
        (section) => {
            const ref = sectionRefs[section];
            if (ref && ref.current) {
                ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        },
        [sectionRefs]
    );

    // Toggle contact details visibility with a loading simulation
    const handleContactSeller = () => {
        setIsContactingSeller(true);
        setTimeout(() => {
            setShowContactDetails((prev) => !prev);
            setIsContactingSeller(false);
        }, 500);
    };

    if (loading) {
        return (
            <div className="container text-center my-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center my-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="container my-5">
            <button
                className="btn btn-outline-secondary mb-4"
                onClick={() => navigate(-1)}
                aria-label="Go back"
            >
                <i className="bi bi-arrow-left me-2"></i>Back to Products
            </button>

            <div className="row g-4 mb-5">
                {/* Image Gallery */}
                <div className="col-md-6">
                    <div className="bg-light rounded-3 overflow-hidden d-flex justify-content-center align-items-center">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                style={{ maxWidth: "100%", height: "auto" }}
                                loading="lazy"
                            />
                        ) : (
                            <div className="d-flex align-items-center justify-content-center text-muted">
                                <i className="bi bi-image fs-1"></i>
                            </div>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="d-flex gap-2 mt-3">
                            {product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.image}
                                    alt={`${product.name} thumbnail ${idx + 1}`}
                                    className={`img-thumbnail ${selectedImage === img.image ? "border-primary" : ""}`}
                                    style={{ width: "80px", height: "80px", objectFit: "cover", cursor: "pointer" }}
                                    onClick={() => setSelectedImage(img.image)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="col-md-6">
                    <h1 className="mb-3">{product.name}</h1>
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <span className="h3 text-primary">GH₵ {product.unit_price}</span>
                        {product.inventory > 0 ? (
                            <span className="badge bg-success">In Stock: {product.inventory}</span>
                        ) : (
                            <span className="badge bg-danger">Out of Stock</span>
                        )}
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        {renderStars(product.average_rating)}
                        <small className="text-muted">({(product.reviews || []).filter(review => review.is_verified).length} reviews)</small>
                    </div>
                    <div className="d-flex flex-wrap gap-3 mb-4">
                        <div className="input-group" style={{ width: "120px" }}>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <input
                                type="number"
                                className="form-control text-center"
                                min="1"
                                max="99"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                aria-label="Quantity"
                            />
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                                disabled={quantity >= 99}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="btn btn-primary flex-grow-1 btn-animate"
                            onClick={handleAddToCart}
                            disabled={product.inventory < 1 || isAddingToCart}
                        >
                            {isAddingToCart ? (
                                <span className="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
                            ) : (
                                <>
                                    <i className="bi bi-cart-plus me-2"></i>Add to Cart
                                </>
                            )}
                        </button>
                        <button
                            className="btn btn-success flex-grow-1 btn-animate"
                            onClick={handleBuyNow}
                            disabled={product.inventory < 1 || isBuyingNow}
                        >
                            {isBuyingNow ? (
                                <span className="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
                            ) : (
                                "Buy Now"
                            )}
                        </button>
                    </div>
                    {showAddedNotification && (
                        <div className="alert alert-success mt-3" role="alert">
                            Item added to cart!
                        </div>
                    )}
                    <div className="alert alert-info">
                        <i className="bi bi-truck me-2"></i>
                        Fast Shipping | Fast Delivery
                    </div>

                    {showCheckoutForm && (
                        <div className="mt-4 p-3 border rounded">
                            <h5>Enter Shipping Details</h5>
                            <div className="mb-3">
                                <label htmlFor="shippingAddress" className="form-label">
                                    Shipping Address / Delivery Address
                                </label>
                                <input
                                    type="text"
                                    id="shippingAddress"
                                    className="form-control"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter your shipping address"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="contactInfo" className="form-label">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    id="contactInfo"
                                    className="form-control"
                                    value={contactInfo}
                                    onChange={(e) => setContactInfo(e.target.value)}
                                    placeholder="Enter your contact number"
                                />
                            </div>
                            <button
                                className="btn btn-success"
                                onClick={handleConfirmOrder}
                                disabled={isConfirmingOrder}
                            >
                                {isConfirmingOrder ? (
                                    <span className="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
                                ) : (
                                    "Confirm Order"
                                )}
                            </button>
                        </div>
                    )}

                    {/* Sticky Tab Navigation */}
                    <div className="sticky-top bg-dark-subtle py-2 border-bottom mb-3" style={{ top: "56px" }}>
                        <nav className="nav nav-pills justify-content-center">
                            {["reviews", "description", "specification", "store", "relatedPosts"].map((section) => (
                                <button
                                    key={section}
                                    className="nav-link"
                                    onClick={() => scrollToSection(section)}
                                    aria-label={`Jump to ${section} section`}
                                >
                                    {section.replace(/([A-Z])/g, " $1").trim()}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Description Section */}
                    <section ref={sectionRefs.description} className="mb-5">
                        <h2 className="mb-4">Product Description</h2>
                        <div className="lead" dangerouslySetInnerHTML={{ __html: product.description }} />
                    </section>

                    {/* Reviews Section */}
                    <section ref={sectionRefs.reviews} className="mb-5">
                        <h2 className="mb-4">Customer Reviews</h2>
                        {product.reviews && product.reviews.filter(review => review.is_verified).length > 0 ? (
                            product.reviews.filter(review => review.is_verified).map((review, index) => {
                                const userRating = product.ratings?.find(
                                    (rating) => rating.username === review.author && rating.is_verified
                                );
                                return (
                                    <article key={index} className="card mb-3">
                                        <div className="card-body">
                                            <div className="d-flex align-items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <i className="bi bi-person-circle fs-3 text-muted"></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h5 className="mb-0">{review.author}</h5>
                                                        <small className="text-muted">
                                                            {new Date(review.date_created).toLocaleDateString()}
                                                        </small>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        {userRating ? renderStars(userRating.rating) : "No rating"}
                                                    </div>
                                                    <p className="mt-2 text-muted">
                                                        {review.review.split("\n").map((line, i) => (
                                                            <React.Fragment key={i}>
                                                                {line}
                                                                <br />
                                                            </React.Fragment>
                                                        ))}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="alert alert-info">
                                No reviews yet. Be the first to review this product!
                            </div>
                        )}
                    </section>

                    {/* Add Review & Rating Section */}
                    <section className="mb-5">
                        <h2 className="mb-4">Add Your Review</h2>
                        <div className="card p-4 shadow-sm">
                            <div className="mb-3">
                                <label htmlFor="newReview" className="form-label">
                                    Your Review
                                </label>
                                <textarea
                                    id="newReview"
                                    className="form-control"
                                    rows="3"
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    placeholder="Write your review here..."
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Your Rating</label>
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-outline-secondary me-2"
                                        onClick={() => setNewRating((prev) => Math.max(1, prev - 1))}
                                    >
                                        <i className="bi bi-arrow-down"></i>
                                    </button>
                                    <div className="fw-bold">{newRating}</div>
                                    <button
                                        className="btn btn-outline-secondary ms-2"
                                        onClick={() => setNewRating((prev) => Math.min(5, prev + 1))}
                                    >
                                        <i className="bi bi-arrow-up"></i>
                                    </button>
                                </div>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmitReview}
                                disabled={isSubmittingReview}
                            >
                                {isSubmittingReview ? (
                                    <span className="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
                                ) : (
                                    "Submit Review"
                                )}
                            </button>
                        </div>
                    </section>

                    {/* Specification Section */}
                    <section ref={sectionRefs.specification} className="mb-5">
                        <h2 className="mb-4">Specification</h2>
                        {product.specification ? (
                            <div dangerouslySetInnerHTML={{ __html: product.specification }} />
                        ) : (
                            <p>No specifications available.</p>
                        )}
                    </section>

                    {/* Store Section */}
                    <section ref={sectionRefs.store} className="mb-5">
                        <h2 className="mb-4">Store</h2>
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="store-logo">
                                        {product.store?.logo ? (
                                            <img
                                                src={product.store.logo}
                                                alt={`${product.store.name} logo`}
                                                className="rounded-circle border p-2"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "100px", height: "100px" }}
                                            >
                                                <i className="bi bi-shop fs-3 text-muted"></i>
                                            </div>
                                        )}
                                    </div>
                                    {/* Store Details */}
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center gap-3 mb-2">
                                            <h3 className="mb-0">{product.store?.name || "Official Store"}</h3>
                                            <span className="badge bg-primary">
                                                <i className="bi bi-patch-check-fill me-2"></i>Verified
                                            </span>
                                        </div>
                                        {/* Store Description */}
                                        {product.store?.description && (
                                            <p className="text-muted mb-3">{product.store.description}</p>
                                        )}
                                        {/* Action Buttons */}
                                        <div className="d-flex gap-3">
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={handleContactSeller}
                                                disabled={isContactingSeller}
                                            >
                                                {isContactingSeller ? (
                                                    <span className="spinner-border spinner-border-sm text-secondary" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-chat-dots me-2"></i>
                                                        Contact Seller
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {showContactDetails && product.store?.contact_info && (
                                            <div className="mt-3 p-3 border rounded">
                                                <h5>Contact Details</h5>
                                                <p>{product.store.contact_info}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Store Badges */}
                            <div className="card-footer bg-transparent border-top">
                                <div className="d-flex flex-wrap gap-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-truck fs-5 text-success"></i>
                                        <div>
                                            <small className="d-block text-muted">Fast Shipping</small>
                                            <small className="text-success">Fast Shipping AnyWhere, AnyDay</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-shield-check fs-5 text-warning"></i>
                                        <div>
                                            <small className="d-block text-muted">Quality</small>
                                            <small className="text-warning">Authenticity Guaranteed</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <style>
                {`
          .btn-animate {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .btn-animate:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .hover-effect:hover {
            transform: translateY(-5px);
            transition: transform 0.3s ease;
          }
        `}
            </style>
        </div>
    );
};

export default ProductsDetail;
