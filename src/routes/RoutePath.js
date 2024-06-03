import {BrowserRouter, Route, Routes} from "react-router-dom";
import Admin from "../pages/admin";
import Dashboard from "../pages/admin/dashboard";
import Products from "../pages/admin/products";
import Bills from "../pages/admin/bills";
import Members from "../pages/admin/members";
import Branches from "../pages/admin/branches";
import AddStore from "../pages/admin/stores/add";
import Sale from "../pages/sale";
import Cashier from "../pages/sale/cashier";
import Profile from "../pages/profile";
import Login from "../pages/Login";
import Page404 from "../pages/Page404";
import Authentication from "../features/auth/authentication/Authentication";
import Authorization from "../features/auth/authorization/Authorization";
import PERMISSIONS from "../features/auth/permissions/Permissions";
import {AuthProvider} from "../features/auth/AuthProvider";
import React from "react";
import CheckAuth from "../pages/CheckAuth";
import Register from "../pages/Register";
import Stores from "../pages/admin/stores";
import BranchDetail from "../pages/admin/branches/branchDetail";
import Categories from "../pages/admin/categories";

const RoutePath = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<Authentication/>}>
                        <Route exact path="stores" element={<Stores/>}/>
                        <Route exact path="stores/add" element={<AddStore/>}/>
                        <Route path="/admin/" element={<Admin/>}>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_CASHIER]}/>}>
                                <Route exact path="profile" element={<Profile/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_DASHBOARD]}/>}>
                                <Route exact path="dashboard" element={<Dashboard/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_PRODUCTS]}/>}>
                                <Route exact path="products" element={<Products/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_PRODUCTS]}/>}>
                                <Route exact path="categories" element={<Categories/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_BILLS]}/>}>
                                <Route exact path="bills" element={<Bills/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_MEMBERS]}/>}>
                                <Route exact path="members" element={<Members/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_BRANCHES]}/>}>
                                <Route path="branches">
                                    <Route
                                        index
                                        element={<Branches/>}
                                    />
                                    <Route
                                        path=":id"
                                        element={<BranchDetail/>}
                                    />
                                </Route>
                            </Route>
                        </Route>

                        <Route element={<Sale/>}>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_CASHIER]}/>}>
                                <Route exact path="profile" element={<Profile/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_DASHBOARD]}/>}>
                                <Route exact path="dashboard" element={<Dashboard/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_BILLS]}/>}>
                                <Route exact path="bills" element={<Bills/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_CASHIER]}/>}>
                                <Route exact path="cashier" element={<Cashier/>}/>
                            </Route>
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