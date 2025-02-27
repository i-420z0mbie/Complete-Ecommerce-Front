// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import OrderDetail from "./components/OrderDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./components/WishList.jsx";
import OrderPage from "./components/OrderPage.jsx";
import CategoryProducts from "./components/CategoryProducts.jsx";
import SearchResults from "./components/SearchResults";
import ProductsList from "./pages/ProductsList.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import Messages from "./components/Messages.jsx";
import Register from "./pages/Register.jsx";
import Modal from "./components/Modal.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ProductsDetail from "./components/ProductsDetail.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

function AppContent() {
    const [modalType, setModalType] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const openModal = (type) => {
        if (searchParams.has("dismissed")) {
            searchParams.delete("dismissed");
            setSearchParams(searchParams);
        }
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
        searchParams.set("dismissed", "true");
        setSearchParams(searchParams);
    };

    return (
        <>
            <Navbar openModal={openModal} />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route
                    path="/category/:categorySlug/:subCategorySlug?/:subSubCategorySlug?"
                    element={<CategoryProducts />}
                />
                <Route path="/store/products/:id" element={<ProductsDetail />} />
                <Route path="/products" element={<ProductsList />} />

                {/* Protected Routes */}
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute openModal={openModal}>
                            <Cart />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute openModal={openModal}>
                            <Messages />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute openModal={openModal}>
                            <Wishlist />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute openModal={openModal}>
                            <OrderPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/order/:orderId"
                    element={
                        <ProtectedRoute openModal={openModal}>
                            <OrderDetail />
                        </ProtectedRoute>
                    }
                />
                {/* Payment Route */}
                <Route
                    path="/payment/:orderId"
                    element={
                        <ProtectedRoute openModal={openModal}>
                            <PaymentPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <Modal show={modalType !== null} onClose={closeModal}>
                {modalType === "login" && (
                    <Login onClose={closeModal} toggleModal={() => setModalType("register")} />
                )}
                {modalType === "register" && (
                    <Register onClose={closeModal} toggleModal={() => setModalType("login")} />
                )}
            </Modal>

            <Footer />

        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
