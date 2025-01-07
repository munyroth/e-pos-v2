import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import React from "react";
import Admin from "pages/admin";
import Dashboard from "pages/admin/dashboard";
import Products from "pages/admin/products";
import Bills from "pages/admin/bills";
import Members from "pages/admin/members";
import Branches from "pages/admin/branches";
import AddStore from "pages/admin/stores/add";
import Sale from "pages/sale";
import Cashier from "pages/sale/cashier";
import Profile from "pages/profile";
import Login from "pages/Login";
import Page404 from "pages/Page404";
import Authentication from "features/auth/authentication/Authentication";
import Authorization from "features/auth/authorization/Authorization";
import PERMISSIONS from "features/auth/permissions/Permissions";
import {AuthProvider} from "features/auth/AuthProvider";
import CheckAuth from "pages/CheckAuth";
import Register from "pages/Register";
import Stores from "pages/admin/stores";
import BranchDetail from "pages/admin/branches/branchDetail";
import Categories from "pages/admin/categories";
import Assign from "pages/admin/members/assign";
import Information from "pages/profile/information";
import Security from "pages/profile/security";
import Business from "pages/profile/business";
import ForgotPassword from "pages/ForgotPassword";

const RoutePath = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<Authentication/>}>
                        <Route path="stores" element={<Stores/>}/>
                        <Route path="stores/add" element={<AddStore/>}/>

                        {/* Admin Routes */}
                        <Route path="admin" element={<Admin/>}>
                            <Route index element={<Navigate to="dashboard"/>}/>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_CASHIER]}/>}>
                                <Route path="profile" element={<Profile/>}>
                                    <Route index element={<Navigate to="information"/>}/>
                                    <Route path="information" element={<Information/>}/>
                                    <Route path="security" element={<Security/>}/>
                                    <Route path="business" element={<Business/>}/>
                                </Route>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_DASHBOARD]}/>}>
                                <Route path="dashboard" element={<Dashboard/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_PRODUCTS]}/>}>
                                <Route path="products" element={<Products/>}/>
                                <Route path="categories" element={<Categories/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_BILLS]}/>}>
                                <Route path="bills" element={<Bills/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_MEMBERS]}/>}>
                                <Route path="members">
                                    <Route index element={<Members/>}/>
                                    <Route path=":id" element={<Assign/>}/>
                                </Route>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_BRANCHES]}/>}>
                                <Route path="branches">
                                    <Route index element={<Branches/>}/>
                                    <Route path=":id" element={<BranchDetail/>}/>
                                </Route>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_CASHIER]}/>}>
                                <Route path="cashier" element={<Cashier/>}/>
                            </Route>
                        </Route>

                        {/* Sale Routes */}
                        <Route element={<Sale/>}>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_CASHIER]}/>}>
                                <Route path="profile" element={<Profile/>}>
                                    <Route index element={<Navigate to="information"/>}/>
                                    <Route path="information" element={<Information/>}/>
                                    <Route path="security" element={<Security/>}/>
                                </Route>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_DASHBOARD]}/>}>
                                <Route path="dashboard" element={<Dashboard/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_BILLS]}/>}>
                                <Route path="bills" element={<Bills/>}/>
                            </Route>
                            <Route element={<Authorization permissions={[PERMISSIONS.CAN_VIEW_CASHIER]}/>}>
                                <Route path="cashier" element={<Cashier/>}/>
                            </Route>
                        </Route>
                    </Route>

                    {/* Authentication Routes */}
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="password/forgot" element={<ForgotPassword/>}/>

                    {/* Root and Fallback Routes */}
                    <Route path="/" element={<CheckAuth/>}/>
                    <Route path="*" element={<Page404/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default RoutePath;
