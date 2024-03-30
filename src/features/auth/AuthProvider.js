import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const axiosPrivate = useAxiosPrivate();

    const [auth, setAuth] = useState({
        token: '',
        permissions: []
    });

    const setUser = (token, role) => {
        if (role === 'Owner') {
            setAuth({ token: token, permissions: ['view_profile', 'view_dashboard'] });
        } else {
            setAuth({ token: token, permissions: ['view_profile'] });
        }
    };

    const login = (token, role, stores) => {
        Cookies.set('token', token);
        if (role === 'Admin' || role === 'Owner') {
            setAuth({ token: token, permissions: ['view_profile', 'view_dashboard'] });
            if (stores.length === 0) navigate(location.state?.path || '/admin/stores/add', { replace: true });
            else {
                Cookies.set('storeId', stores[0].id, { expires: 15 });
                Cookies.set('branchIndex', 0, { expires: 15 });
                navigate(location.state?.path || '/admin/dashboard', { replace: true });
            }
        } else {
            setAuth({ token: token, permissions: ['view_profile'] });
            navigate(location.state?.path || '/cashier', { replace: true });
        }
    };

    const logout = async () => {
        const controller = new AbortController();
        try {
            const res = await axiosPrivate.get('/logout', {
                signal: controller.signal
            });
            Cookies.remove('token');
            Cookies.remove('storeId');
            setAuth({ token: '', permissions: [] });
            navigate(location.state?.path || '/login', { replace: true });
        } catch (err) {

        }
    };

    return <AuthContext.Provider value={{ auth, setAuth, setUser, login, logout}}>{children}</AuthContext.Provider>;
};