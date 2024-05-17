import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import PERMISSIONS from "./permissions/Permissions";

const TOKEN = 'token';
const REFRESH_TOKEN = 'refresh_token';
const ROLE = 'role';
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

    const register = (token, refresh_token) => {
        localStorage.setItem(TOKEN, token);
        localStorage.setItem(REFRESH_TOKEN, refresh_token);
        localStorage.setItem(ROLE, 'admin');
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

    const login = (token, refresh_token, role, remember) => {
        if (remember) {
            localStorage.setItem(TOKEN, token);
            localStorage.setItem(REFRESH_TOKEN, refresh_token);
            localStorage.setItem(ROLE, role);
        } else {
            sessionStorage.setItem(TOKEN, token);
            sessionStorage.setItem(ROLE, role);
        }
        let storeId = localStorage.getItem(SHOP_ID);
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
        !storeId && navigate(location.state?.path || defaultPath, {replace: true});
    };

    const logout = () => {
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(ROLE);
        localStorage.removeItem(SHOP_ID);
        setAuth({token: '', role: '', permissions: []});
        navigate(location.state?.path || '/login', {replace: true});
    };

    return (
        <AuthContext.Provider value={{auth, setAuth, setUser, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
