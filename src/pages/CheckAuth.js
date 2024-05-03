import {Navigate, useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";

const CheckAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();

    let token = Cookies.get('token');
    let shop = Cookies.get('shopId');

    return (
        (auth.token || token)
            ? shop
                ? auth.role === 'admin'
                    ? <Navigate to='/admin/dashboard' state={{from: location}} replace/>
                    : <Navigate to='/cashier' state={{from: location}} replace/>
                : <Navigate to='/stores' state={{from: location}} replace/>
            : <Navigate to='/login' state={{from: location}} replace/>
    )
};

export default CheckAuth;