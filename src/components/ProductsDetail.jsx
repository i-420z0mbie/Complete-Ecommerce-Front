// src/components/ProductsDetail.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import { useCart } from "../contexts/CartContext";

const ProductsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartId } = useCart();

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

    const handleAddToCart = useCallback(async () => {
        if (!product || product.inventory < 1) {
            console.warn("No product available or out of stock");
            return;
        }
        try {
            console.log("Adding product to cart:", { productId: product.id, quantity });
            // Pass the custom flag to bypass token refresh for this call
            await addToCart(product.id, quantity, { skipAuthRefresh: true });
            toast.success("Product added to cart!");
        } catch (err) {
            console.error("Error adding product to cart:", err.response || err.message);
            if (err.response && err.response.status === 401) {
                alert("You need to log in to add products to your cart.");
            } else {
                toast.error("Failed to add product to cart. Please try again.");
            }
        }
    }, [product, quantity, addToCart]);

    const handleConfirmOrder = useCallback(async () => {
        if (!shippingAddress.trim() || !contactInfo.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

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
                    return;
                }
            } catch (err) {
                toast.error("No active cart found");
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
        }
    }, [cartId, shippingAddress, contactInfo, navigate]);

    const handleBuyNow = useCallback(async () => {
        if (!product || product.inventory < 1) {
            toast.error("Product is out of stock");
            return;
        }
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
                alert("You need to log in to add products to your cart.");
            } else {
                toast.error("Failed to add to cart. Please try again.");
            }
        }
    }, [product, quantity, addToCart, showCheckoutForm, shippingAddress, contactInfo, handleConfirmOrder]);

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

    // Toggle contact details visibility
    const handleContactSeller = () => {
        setShowContactDetails((prev) => !prev);
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
                        <small className="text-muted">({product.reviews?.length || 0} reviews)</small>
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
                            className="btn btn-primary flex-grow-1"
                            onClick={handleAddToCart}
                            disabled={product.inventory < 1}
                        >
                            <i className="bi bi-cart-plus me-2"></i>
                            Add to Cart
                        </button>
                        <button
                            className="btn btn-success flex-grow-1"
                            onClick={handleBuyNow}
                            disabled={product.inventory < 1}
                        >
                            Buy Now
                        </button>
                    </div>
                    <div className="alert alert-info">
                        <i className="bi bi-truck me-2"></i>
                        Free shipping on orders over GH₵500
                    </div>

                    {/* Checkout form for "Buy Now" */}
                    {showCheckoutForm && (
                        <div className="mt-4 p-3 border rounded">
                            <h5>Enter Shipping Details</h5>
                            <div className="mb-3">
                                <label htmlFor="shippingAddress" className="form-label">
                                    Shipping Address
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
                            <button className="btn btn-success" onClick={handleConfirmOrder}>
                                Confirm Order
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
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review, index) => {
                                const userRating = product.ratings?.find((rating) => rating.username === review.author);
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
                                            <button className="btn btn-outline-secondary" onClick={handleContactSeller}>
                                                <i className="bi bi-chat-dots me-2"></i>
                                                Contact Seller
                                            </button>
                                        </div>
                                        {/* Conditionally Render Contact Details */}
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
                                            <small className="text-success">Free on orders over GH₵500</small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-arrow-counterclockwise fs-5 text-primary"></i>
                                        <div>
                                            <small className="d-block text-muted">Returns</small>
                                            <small className="text-primary">30-Day Free Returns</small>
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

                    {/* Related Posts Section */}
                    <section ref={sectionRefs.relatedPosts} className="mb-5">
                        <h2 className="mb-4">Related Posts</h2>
                        <p>Related posts go here.</p>
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
