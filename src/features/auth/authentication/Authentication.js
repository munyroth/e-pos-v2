import React, {useEffect} from "react";
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

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const getUser = async () => {
            const url = role === 'admin' ? '/admin/user' : '/user';
            try {
                const res = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal
                });
                if (res.data.status === 200) {
                    if (isMounted) setUser(token, res.data.data.role);
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
                        if (isMounted) login(r.data.data.token, r.data.data.refresh_token, r.data.data.user.role, true);
                    } else {
                        navigate('/login', {state: {from: location}, replace: true});
                    }
                } else {
                    navigate('/login', {state: {from: location}, replace: true});
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error during authentication', err);
                    navigate('/login', {state: {from: location}, replace: true});
                }
            }
        };

        if (token) {
            getUser().then(r => r);
        } else {
            navigate('/login', {state: {from: location}, replace: true});
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [token, refreshToken, role, setUser, login, navigate, location]);

    if (auth?.token) {
        return <Outlet/>;
    }

    return null;
};

export default Authentication;
