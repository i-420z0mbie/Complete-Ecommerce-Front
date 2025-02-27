import React, { createContext, useContext, useState } from 'react';
import api from '../api';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    // Function to fetch and update the cart count from the backend
    const fetchCartCount = async () => {
        try {
            const { data } = await api.get("/store/cart-items/");
            // Adjust if your response data structure differs
            const items = Array.isArray(data) ? data : data.results;
            const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(count);
        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    };

    // Updated addToCart function accepts an optional config parameter
    const addToCart = async (productId, quantity, config = {}) => {
        try {
            const response = await api.post(
                "/store/cart-items/",
                { product_id: productId, quantity },
                config
            );
            window.dispatchEvent(new CustomEvent("cartUpdated"));
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return (
        <CartContext.Provider value={{ cartCount, addToCart, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
