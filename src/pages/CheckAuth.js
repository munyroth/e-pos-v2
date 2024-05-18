import {Navigate, useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CheckAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');
    const shop = localStorage.getItem('shopId');

    return (
        (auth.token || token)
            ? shop
                ? role === 'admin'
                    ? <Navigate to='/admin/dashboard' state={{from: location}} replace/>
                    : <Navigate to='/cashier' state={{from: location}} replace/>
                : <Navigate to='/stores' state={{from: location}} replace/>
            : <Navigate to='/login' state={{from: location}} replace/>
    )
};

export default CheckAuth;