import React from "react";
import {Outlet} from "react-router-dom";
import useAuth from "hooks/useAuth";
import Unauthorized from "pages/Unauthorized";

const Authorization = ({permissions}) => {
    const {auth} = useAuth();
    const userPermission = auth.permissions;
    const isAllowed = permissions.some((allowed) => userPermission.includes(allowed));
    return isAllowed ? <Outlet/> : <Unauthorized/>;
};

export default Authorization;