import React, {useEffect, useCallback} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axios";

const Authentication = () => {
    const {auth, setUser, login} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');

    const getUser = useCallback(async () => {
        console.log('getUser');
        const url = role === 'admin' ? '/admin/user' : '/user';
        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.data.status === 200) {
                setUser(token, res.data.data.role);
            } else if (res.data.status === 401) {
                const r = await axios.post('/refresh-token', {
                    refresh_token: refreshToken
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (r.data.status === 200) {
                    login(r.data.data.token, r.data.data.refresh_token, r.data.data.user.role);
                } else {
                    navigate('/login', {state: {from: location}, replace: true});
                }
            } else {
                navigate('/login', {state: {from: location}, replace: true});
            }
        } catch (err) {
            navigate('/login', {state: {from: location}, replace: true});
        }
    }, [token, refreshToken, role, setUser, login, navigate, location]);

    useEffect(() => {
        let isMounted = true;

        if (!auth?.token && token) {
            getUser().then(() => {
                if (isMounted) {
                    // Additional logic if needed after getUser resolves
                }
            });
        } else if (!token) {
            navigate('/login', {state: {from: location}, replace: true});
        }

        return () => {
            isMounted = false;
        };
    }, [auth?.token, token, getUser, navigate, location]);

    if (auth?.token) {
        return <Outlet/>;
    }

    return null;
};

export default Authentication;
