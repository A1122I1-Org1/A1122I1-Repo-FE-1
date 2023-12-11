import React, {useEffect, useState} from 'react';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";

export const PrivateRouter = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const location = useLocation();
    const navigate=useNavigate();
    useEffect(() => {
        const checkTokenExpiration = () => {
            if (!token) return;
            const { exp } = JSON.parse(atob(token.split(".")[1]));
            return Date.now() < exp * 1000;
        };

        if (!checkTokenExpiration()) {
            localStorage.clear();
            toast("Lỗi hết hạn phiên");
            navigate("/login", { state: { from: location } });
        }
    }, [token, location, navigate]);

    if (token) {
        return children;
    }

    return null;
};

