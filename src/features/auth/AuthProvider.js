import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PERMISSIONS from "./permissions/Permissions";

const COOKIE_TOKEN = 'token';
const COOKIE_BRANCH_INDEX = 'branchIndex';
const COOKIE_PERMISSION = 'permission';

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const [auth, setAuth] = useState({
        token: Cookies.get(COOKIE_TOKEN) || '',
        permissions: Cookies.get(COOKIE_PERMISSION) ? JSON.parse(Cookies.get(COOKIE_PERMISSION)) : []
    });

    const setUser = (token, role) => {
        const permissions = role === 'admin' ? [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_DASHBOARD,
            PERMISSIONS.CAN_VIEW_ITEMS,
            PERMISSIONS.CAN_VIEW_BILLS,
            PERMISSIONS.CAN_VIEW_MEMBERS,
            PERMISSIONS.CAN_VIEW_BRANCHES,
            PERMISSIONS.CAN_VIEW_CASHIER
        ] : [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_CASHIER
        ];
        setAuth({token, permissions});
    };

    const register = (token) => {
        Cookies.set(COOKIE_TOKEN, token);
        const permissions = [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_DASHBOARD,
            PERMISSIONS.CAN_VIEW_ITEMS,
            PERMISSIONS.CAN_VIEW_BILLS,
            PERMISSIONS.CAN_VIEW_MEMBERS,
            PERMISSIONS.CAN_VIEW_BRANCHES,
            PERMISSIONS.CAN_VIEW_CASHIER
        ];
        setAuth({token, permissions});
        navigate(location.state?.path || '/stores/add', {replace: true});
    };

    const login = (token, role) => {
        Cookies.set(COOKIE_TOKEN, token);
        const permissions = role === 'admin' ? [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_DASHBOARD,
            PERMISSIONS.CAN_VIEW_ITEMS,
            PERMISSIONS.CAN_VIEW_BILLS,
            PERMISSIONS.CAN_VIEW_MEMBERS,
            PERMISSIONS.CAN_VIEW_BRANCHES,
            PERMISSIONS.CAN_VIEW_CASHIER
        ] : [
            PERMISSIONS.CAN_VIEW_PROFILE,
            PERMISSIONS.CAN_VIEW_CASHIER
        ];
        setAuth({token, permissions});
        Cookies.set(COOKIE_BRANCH_INDEX, 0, {expires: 15});
        Cookies.set(COOKIE_PERMISSION, JSON.stringify(permissions));
        const defaultPath = role === 'admin' ? '/stores' : '/cashier';
        navigate(location.state?.path || defaultPath, {replace: true});
    };

    const logout = async () => {
        const controller = new AbortController();
        try {
            await axiosPrivate.get('/logout', {signal: controller.signal});
            Cookies.remove(COOKIE_TOKEN);
            Cookies.remove(COOKIE_BRANCH_INDEX);
            Cookies.remove(COOKIE_PERMISSION);
            setAuth({token: '', permissions: []});
            navigate(location.state?.path || '/login', {replace: true});
        } catch (err) {
            // Handle error, maybe display a message to the user
            console.error("Error during logout:", err);
        }
    };

    return (
        <AuthContext.Provider value={{auth, setAuth, setUser, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
