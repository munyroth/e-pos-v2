import React from "react";
import { Outlet, useLocation, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axios";

const Authentication = () => {
    const { auth, setUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    let token = Cookies.get('token');

    let isMounted = true;
    const controller = new AbortController();

    const getUser = async  () => {
        try {
            const res = await axios.get('/admin/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            isMounted && setUser(token, res.data.data.role.name_en)
        } catch (err) {
            navigate('/login', {state: {from: location}, replace: true});
        }
    }

    if (auth?.token) {
        return (<Outlet />)
    } else if (token) {
            getUser();
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