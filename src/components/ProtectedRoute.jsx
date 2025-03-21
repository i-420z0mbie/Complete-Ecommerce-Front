import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../api.js";
import {jwtDecode} from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children, openModal }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [modalTriggered, setModalTriggered] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {

                localStorage.setItem("next", location.pathname);
                setIsAuthorized(false);
                return;
            }
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;
            if (tokenExpiration < now) {
                try {
                    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                    if (!refreshToken) {
                        localStorage.setItem("next", location.pathname);
                        setIsAuthorized(false);
                        return;
                    }
                    const res = await api.post("/refresh/token/", { refresh: refreshToken });
                    if (res.status === 200) {
                        localStorage.setItem(ACCESS_TOKEN, res.data.access);
                        setIsAuthorized(true);
                    } else {
                        localStorage.setItem("next", location.pathname);
                        setIsAuthorized(false);
                    }
                } catch (err) {
                    console.error("Error refreshing token:", err);
                    localStorage.setItem("next", location.pathname);
                    setIsAuthorized(false);
                }
            } else {
                setIsAuthorized(true);
            }
        };

        auth().catch(() => {
            localStorage.setItem("next", location.pathname);
            setIsAuthorized(false);
        });
    }, [location]);


    useEffect(() => {
        if (isAuthorized === false && !modalTriggered && openModal) {
            openModal("login");
            setModalTriggered(true);
        }
    }, [isAuthorized, modalTriggered, openModal]);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : (
        <div className="container text-center mt-5">
            <h2>You must log in to access this page.</h2>
            <p>Please use the login option from the profile dropdown.</p>
        </div>
    );
}

export default ProtectedRoute;
