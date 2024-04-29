import {BrowserRouter, Route, Routes} from "react-router-dom";
import Admin from "../pages/admin";
import Dashboard from "../pages/admin/dashboard";
import Items from "../pages/admin/items";
import Bills from "../pages/admin/bills";
import Members from "../pages/admin/members";
import Branches from "../pages/admin/branches";
import AddStore from "../pages/admin/stores/add";
import Home from "../pages/home";
import Cashier from "../pages/cashier";
import Profile from "../pages/profile";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Page404 from "../pages/Page404";
import Authentication from "../features/auth/authentication/Authentication";
// import Authorization from "../features/auth/authorization/Authorization";
// import PERMISSIONS from "../features/auth/permissions/Permissions";
import {AuthProvider} from "../features/auth/AuthProvider";
import React from "react";
import CheckAuth from "../pages/CheckAuth";
import Register from "../pages/Register";
import Stores from "../pages/admin/stores";

const RoutePath = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<Authentication/>}>
                        <Route exact path="stores" element={<Stores/>}/>
                        <Route exact path="stores/add" element={<AddStore/>}/>
                        <Route path="/admin/" element={<Admin/>}>
                            <Route exact path="profile" element={<Profile/>}/>
                            <Route exact path="cashier" element={<Cashier/>}/>
                            <Route exact path="dashboard" element={<Dashboard/>}/>
                            {/*<Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_DASHBOARD]}/>}>*/}
                            {/*    <Route exact path="dashboard" element={<Dashboard/>}/>*/}
                            {/*</Route>*/}
                            <Route exact path="items" element={<Items/>}/>
                            <Route exact path="bills" element={<Bills/>}/>
                            <Route exact path="members" element={<Members/>}/>
                            <Route exact path="branches" element={<Branches/>}/>
                        </Route>

                        <Route element={<Home/>}>
                            <Route exact path="cashier" element={<Cashier/>}/>
                            <Route exact path="profile" element={<Profile/>}/>
                            <Route exact path="signout" element={<Logout/>}/>
                        </Route>
                    </Route>

                    <Route exact path="login" element={<Login/>}/>
                    <Route exact path="register" element={<Register/>}/>
                    <Route exact path="/" element={<CheckAuth/>}/>
                    <Route path="*" element={<Page404/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default RoutePath;