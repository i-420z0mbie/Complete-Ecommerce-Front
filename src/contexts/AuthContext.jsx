import React, { createContext, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize isAuthenticated from localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem(ACCESS_TOKEN)
    );

    // Call this after a successful login to update both localStorage and state
    const login = (accessToken, refreshToken) => {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
