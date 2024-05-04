import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext from "../../contexts/AuthContext";
import PERMISSIONS from "./permissions/Permissions";

const COOKIE_TOKEN = 'token';
const COOKIE_ROLE = 'role';
const SHOP_ID = 'shopId';

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [auth, setAuth] = useState({
        token: '',
        role: '',
        permissions: []
    });

    const setUser = (token, role) => {
        const permissions = role === 'admin' ? [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_DASHBOARD,
            PERMISSIONS.CAN_VIEW_PRODUCTS,
            PERMISSIONS.CAN_VIEW_BILLS,
            PERMISSIONS.CAN_VIEW_MEMBERS,
            PERMISSIONS.CAN_VIEW_BRANCHES,
            PERMISSIONS.CAN_VIEW_CASHIER
        ] : [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_CASHIER
        ];
        setAuth({token, role, permissions});
    };

    const register = (token) => {
        Cookies.set(COOKIE_TOKEN, token);
        Cookies.set(COOKIE_ROLE, 'admin');
        const permissions = [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_DASHBOARD,
            PERMISSIONS.CAN_VIEW_PRODUCTS,
            PERMISSIONS.CAN_VIEW_BILLS,
            PERMISSIONS.CAN_VIEW_MEMBERS,
            PERMISSIONS.CAN_VIEW_BRANCHES,
            PERMISSIONS.CAN_VIEW_CASHIER
        ];
        setAuth({token, role: 'admin', permissions});
        navigate(location.state?.path || '/stores/add', {replace: true});
    };

    const login = (token, role) => {
        Cookies.set(COOKIE_TOKEN, token);
        Cookies.set(COOKIE_ROLE, role);
        const permissions = role === 'admin' ? [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_DASHBOARD,
            PERMISSIONS.CAN_VIEW_PRODUCTS,
            PERMISSIONS.CAN_VIEW_BILLS,
            PERMISSIONS.CAN_VIEW_MEMBERS,
            PERMISSIONS.CAN_VIEW_BRANCHES,
            PERMISSIONS.CAN_VIEW_CASHIER
        ] : [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_CASHIER
        ];
        setAuth({token, role, permissions});
        const defaultPath = '/stores';
        navigate(location.state?.path || defaultPath, {replace: true});
    };

    const logout = () => {
        Cookies.remove(COOKIE_TOKEN);
        Cookies.remove(SHOP_ID);
        Cookies.remove(COOKIE_ROLE);
        setAuth({token: '', role: '', permissions: []});
        navigate(location.state?.path || '/login', {replace: true});
    };

    return (
        <AuthContext.Provider value={{auth, setAuth, setUser, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
