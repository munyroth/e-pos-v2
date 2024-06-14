import useGetDataObject from "hooks/useGetDataObject";
import Loading from "components/loading";
import React from "react";
import {NavLink, Outlet} from "react-router-dom";
import classNames from "classnames";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import useAuth from "hooks/useAuth";

const USER_API_URL = '/user';

export default function Profile() {
    const axiosPrivate = useAxiosPrivate();
    const {auth, logout} = useAuth();

    const items = auth.role === 'admin'
        ? [
            {
                link: "information",
                name: "ព័ត៌មានផ្ទាល់ខ្លួន",
                icon: <svg className="w-6 h-6" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg"
                           width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd"
                          d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                          clipRule="evenodd"/>
                </svg>
            },
            {
                link: "business",
                name: "ព័ត៌មានហាង",
                icon: <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z"/>
                    <path fillRule="evenodd"
                          d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z"
                          clipRule="evenodd"/>
                </svg>
            },
            {
                link: "security",
                name: "សុវត្ថិភាព",
                icon: <svg className="w-6 h-6" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z"/>
                </svg>

            }
        ] : [
            {
                link: "information",
                name: "ព័ត៌មានផ្ទាល់ខ្លួន",
                icon: <svg className="w-6 h-6" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg"
                           width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd"
                          d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                          clipRule="evenodd"/>
                </svg>
            },
            {
                link: "security",
                name: "សុវត្ថិភាព",
                icon: <svg className="w-6 h-6" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z"/>
                </svg>

            }
        ];

    const [user, isLoading, setUser] = useGetDataObject(USER_API_URL);
    const {
        img_url,
        name,
        role,
        orders_sum_total,
        orders_count,
    } = user || {};

    return (
        <div className="pb-4 h-full">
            {isLoading ? (
                <Loading/>
            ) : (
                <div className="flex h-full space-x-4">
                    <div
                        className="min-w-64 p-4 space-y-4 w-1/3 border border-gray-200 rounded-lg shadow dark:border-gray-700">
                        {/* Basic Profile */}
                        <div className="text-center space-y-2">
                            <div className="relative w-32 h-32 mx-auto">
                                <img className="w-full h-full rounded-full object-contain"
                                     src={img_url || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`}
                                     alt="profile"/>
                            </div>
                            <h2 className="text-2xl font-semibold">{name}</h2>
                            <div className="text-gray-600 dark:text-gray-400">
                                {role === "admin" ? "ម្ចាស់ហាង" :
                                    role === "manager" ? "អ្នកគ្រប់គ្រង" :
                                        role === "sale" ? "អ្នកលក់" : "សមាជិក"}
                            </div>
                        </div>

                        {/* Total income and order */}
                        <div className="flex space-x-4 dark:text-white w-full justify-center items-center">
                            <div className="w-1/2 flex flex-col items-center space-y-1">
                                <div className="text-2xl font-semibold">${orders_sum_total.toFixed(2)}</div>
                                <div className="text-gray-600 dark:text-gray-400">ចំណូល</div>
                            </div>
                            <div className="border-r h-16 border-gray-300 dark:border-gray-700"></div>
                            <div className="w-1/2 flex flex-col items-center space-y-1">
                                <div className="text-2xl font-semibold">{orders_count}</div>
                                <div className="text-gray-600 dark:text-gray-400">ការបញ្ជាទិញ</div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-b w-full border-gray-300 dark:border-gray-700"></div>

                        {/* Items */}
                        <ul className="space-y-2 font-medium">
                            {items.map(n => (
                                <li>
                                    <NavLink
                                        to={n.link}
                                        className={({isActive}) => classNames(
                                            "flex items-center w-full p-2 transition duration-75 rounded-lg group",
                                            {"bg-main text-white": isActive},
                                            {"text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700": !isActive}
                                        )}
                                    >
                                        {n.icon}
                                        <span className="ml-3">{n.name}</span>
                                    </NavLink>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={async () => {
                                        const controller = new AbortController();
                                        try {
                                            await axiosPrivate.get('/logout', {signal: controller.signal});
                                            logout(auth.token);
                                        } catch (err) {
                                            console.error("Error during logout:", err);
                                        }
                                    }}
                                    className='flex items-center w-full p-2 transition duration-75 rounded-lg group text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                >
                                    <svg className="w-6 h-6" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                         viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
                                    </svg>
                                    <span className="ml-3">ចាកចេញ</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="relative p-4 space-y-4 w-2/3 border border-gray-200 rounded-lg shadow dark:border-gray-700">
                        <Outlet
                            context={[user, setUser]}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
