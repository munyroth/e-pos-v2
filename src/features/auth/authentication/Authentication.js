import React from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axios";

const Authentication = () => {
    const {auth, setUser, login} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    let token = localStorage.getItem('token');
    let refreshToken = localStorage.getItem('refresh_token');
    let role = localStorage.getItem('role');

    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
        let url = role === 'admin' ? '/admin/user' : '/user';
        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (res.data.status === 200) isMounted && setUser(token, res.data.data.role);
            else if (res.data.status === 401) {
                const r = await axios.post('/refresh-token', {
                    refresh_token: refreshToken
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                if (r.data.status === 200) {
                    isMounted && login(r.data.data.token, r.data.data.refresh_token, r.data.data.user.role);
                } else {
                    navigate('/login', {state: {from: location}, replace: true});
                }
            } else {
                navigate('/login', {state: {from: location}, replace: true});
            }
        } catch (err) {
            navigate('/login', {state: {from: location}, replace: true});
        }
    }

    if (auth?.token) {
        return (<Outlet/>)
    } else if (token) {
        getUser().then();
        return () => {
            isMounted = false;
            controller.abort();
        }
    } else {
        navigate('/login', {state: {from: location}, replace: true});
    }

    return (
        <></>
    )
};

export default Authentication;