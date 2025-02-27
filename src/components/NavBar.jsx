import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import api from "../api";
import "../Navbar.css";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = ({ openModal }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [subSubcategories, setSubSubcategories] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Optional refs for smooth scrolling if needed
    const sectionRefs = {
        description: useRef(null),
        reviews: useRef(null),
        specification: useRef(null),
        store: useRef(null),
        relatedPosts: useRef(null),
    };

    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const suggestionBoxRef = useRef(null);

    // Use a single ref for hover timeouts
    const hoverTimeoutRef = useRef(null);

    // Custom hover handlers allowing for an optional delay parameter.
    const handleMouseEnter = useCallback((setState, value, delay = 100) => {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => setState(value), delay);
    }, []);

    const handleMouseLeave = useCallback((setState, delay = 200) => {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => setState(null), delay);
    }, []);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await api.get("/store/categories/");
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error loading categories:", err);
                setError("Error loading categories");
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Fetch cart count
    const fetchCartCount = async () => {
        try {
            const { data } = await api.get("/store/cart-items/");
            const items = Array.isArray(data) ? data : data.results;
            const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(count);
        } catch (err) {
            console.error("Error fetching cart count:", err);
        }
    };

    useEffect(() => {
        fetchCartCount();
    }, []);

    useEffect(() => {
        const handleCartUpdated = () => {
            fetchCartCount();
        };
        window.addEventListener("cartUpdated", handleCartUpdated);
        return () => window.removeEventListener("cartUpdated", handleCartUpdated);
    }, []);

    // Debounce and fetch suggestions as the user types
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length > 1) {
                fetchSuggestions(searchQuery);
            } else {
                setSuggestions([]);
            }
        }, 100);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const fetchSuggestions = async (query) => {
        try {
            const response = await api.get(`/store/products/?search=${query}`);
            setSuggestions(response.data);
        } catch (err) {
            console.error("Error fetching suggestions:", err);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSuggestions([]);
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    const handleSuggestionClick = (suggestion) => {
        navigate(`/store/products/${suggestion.id}`);
        setSuggestions([]);
        setSearchQuery("");
    };

    // Load subcategories for a category
    const loadSubcategories = async (categoryId) => {
        if (!subcategories[categoryId]) {
            try {
                const response = await api.get(`/store/ajax/load-subcategories/`, {
                    params: { category_id: categoryId },
                });
                setSubcategories((prev) => ({
                    ...prev,
                    [categoryId]: response.data.subcategories,
                }));
            } catch (error) {
                console.error("Error loading subcategories:", error);
            }
        }
    };

    // Load sub-subcategories for a subcategory
    const loadSubSubcategories = async (subcategoryId) => {
        if (!subSubcategories[subcategoryId]) {
            try {
                const response = await api.get(`/store/ajax/load-sub-subcategories/`, {
                    params: { subcategory_id: subcategoryId },
                });
                setSubSubcategories((prev) => ({
                    ...prev,
                    [subcategoryId]: response.data.sub_subcategories,
                }));
            } catch (error) {
                console.error("Error loading sub-subcategories:", error);
            }
        }
    };

    // Function to display star ratings with reduced size.
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


    const toAllProduct = async (e) => {
        e.preventDefault()
        navigate('/products')
    }

    // Smooth scrolling function
    const scrollToSection = useCallback(
        (section) => {
            const ref = sectionRefs[section];
            if (ref && ref.current) {
                ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        },
        [sectionRefs]
    );

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

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark ali-nav">
            <div className="container-fluid flex-column p-0">

                <div className="top-row d-flex align-items-center w-100">
                    <a className="navbar-brand ms-3" href="/">
                        z0mbified: The store
                    </a>
                    <form
                        className="search-container mx-auto position-relative"
                        onSubmit={handleSearchSubmit}
                        autoComplete="off"
                    >
                        <input
                            className="form-control search-input"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button className="btn search-button" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                        {suggestions.length > 0 && (
                            <ul
                                ref={suggestionBoxRef}
                                className="suggestions-list list-group position-absolute"
                                style={{
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    zIndex: 1000,
                                }}
                            >
                                {suggestions.slice(0, 5).map((suggestion) => (
                                    <li
                                        key={suggestion.id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {suggestion.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                    <ul className="navbar-nav me-3 d-flex flex-row align-items-center">
                        <li className="nav-item dropdown me-3">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="profileDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-person" style={{ fontSize: "1.2rem" }}></i> Profile
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                                {isAuthenticated ? (
                                    <>
                                        <li>
                                            <a className="dropdown-item" href="/orders">
                                                <i className="bi bi-receipt me-2"></i> My Orders
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="/wishlist">
                                                <i className="bi bi-heart me-2"></i> WishList
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="/messages">
                                                <i className="bi bi-chat-dots me-2"></i> Messages
                                            </a>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={logout}>
                                                <i className="bi bi-box-arrow-right me-2"></i> Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <button className="dropdown-item" onClick={() => openModal("login")}>
                                                Login
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => openModal("register")}>
                                                Register
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/cart">
                                <i className="bi bi-cart" style={{ fontSize: "1.2rem" }}></i>
                                {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
                            </a>
                        </li>
                    </ul>
                </div>
                {/* Bottom Row: All Categories + Additional Links */}
                <div className="bottom-row d-flex align-items-center w-100 mt-2">
                    <div className="all-categories-container ms-3">
                        <div className="dropdown">
                            <a
                                className="dropdown-toggle all-categories-link"
                                href="#"
                                id="allCategoriesDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                All Categories
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="allCategoriesDropdown">
                                {categories.map((cat) => (
                                    <li
                                        key={cat.id}
                                        className="dropdown-submenu-wrapper"
                                        onMouseEnter={() => {
                                            handleMouseEnter(setActiveCategory, cat.id);
                                            loadSubcategories(cat.id);
                                        }}
                                        onMouseLeave={() => handleMouseLeave(setActiveCategory)}
                                    >
                                        <a
                                            className="dropdown-item dropdown-toggle"
                                            href={`/category/${cat.slug}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/category/${cat.slug}`);
                                            }}
                                        >
                                            {cat.name}
                                        </a>
                                        {activeCategory === cat.id && subcategories[cat.id] && (
                                            <ul className="dropdown-menu submenu-right">
                                                {subcategories[cat.id].map((sub) => (
                                                    <li
                                                        key={sub.id}
                                                        className="dropdown-submenu-wrapper"
                                                        onMouseEnter={() => {
                                                            handleMouseEnter(setActiveSubcategory, sub.id, 100);
                                                            loadSubSubcategories(sub.id);
                                                        }}
                                                        onMouseLeave={() => handleMouseLeave(setActiveSubcategory)}
                                                    >
                                                        <a
                                                            className="dropdown-item dropdown-toggle"
                                                            href={`/category/${cat.slug}/${sub.slug}`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                navigate(`/category/${cat.slug}/${sub.slug}`);
                                                            }}
                                                        >
                                                            {sub.name}
                                                        </a>
                                                        {activeSubcategory === sub.id && subSubcategories[sub.id] && (
                                                            <ul className="dropdown-menu submenu-right">
                                                                {subSubcategories[sub.id].map((subSub) => (
                                                                    <li key={subSub.id}>
                                                                        <a
                                                                            className="dropdown-item"
                                                                            href={`/category/${cat.slug}/${sub.slug}/${subSub.slug}`}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                navigate(`/category/${cat.slug}/${sub.slug}/${subSub.slug}`);
                                                                            }}
                                                                        >
                                                                            {subSub.name}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <ul className="nav ms-4 flex-row gap-3 ali-links">
                        <li className="nav-item">
                            <a className="nav-link text-white" href="/products">
                                All Products
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="/category/bundle-deals">
                                Bundle deals
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="/category/weekly-sensation">
                                Weekly sensation
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="/category/top-brands">
                                Top Brands
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="/category/directors-pick">
                                Director's Pick
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="/category/mobile-phones-communication">
                                Phones & Telecom
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
