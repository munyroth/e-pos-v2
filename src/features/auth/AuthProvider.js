import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const axiosPrivate = useAxiosPrivate();

    const [auth, setAuth] = useState({
        token: '',
        permissions: []
    });

    const setUser = (token, role) => {
        if (role === 'admin') {
            setAuth({token: token, permissions: ['view_profile', 'view_dashboard']});
        } else {
            setAuth({token: token, permissions: ['view_profile']});
        }
    };

    const register = (token) => {
        Cookies.set('token', token);
        setAuth({token: token, permissions: ['view_profile', 'view_dashboard']});
        navigate(location.state?.path || '/stores/add', {replace: true});
    }

    const login = (token, role) => {
        Cookies.set('token', token);
        if (role === 'admin') {
            setAuth({token: token, permissions: ['view_profile', 'view_dashboard']});
            Cookies.set('branchIndex', 0, {expires: 15});
            navigate(location.state?.path || '/admin/dashboard', {replace: true});
        } else {
            setAuth({token: token, permissions: ['view_profile']});
            navigate(location.state?.path || '/cashier', {replace: true});
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
            setAuth({token: '', permissions: []});
            navigate(location.state?.path || '/login', {replace: true});
        } catch (err) {

        }
    };

    return <AuthContext.Provider
        value={{auth, setAuth, setUser, register, login, logout}}>
        {children}
    </AuthContext.Provider>;
};