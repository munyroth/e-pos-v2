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

    const items = [
        {
            link: "information",
            name: "ព័ត៌មានទូទៅ",
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

    // const [data, setData] = useState({
    //     phone: '',
    //     name: '',
    //     old_password: '',
    //     password: ''
    // });

    // const [isValidate, setIsValidate] = useState({
    //     phone: false,
    //     name: false,
    //     password: false
    // });
    //
    // const handleChangeProfile = e => {
    //     handleChange(
    //         e,
    //         setData,
    //         setIsValidate
    //     )
    // }

    // const [isDisabled, setIsDisabled] = useState(true);
    //
    // const [isSetData, setIsSetData] = useState(false);
    //
    // useEffect(() => {
    //     if (data.phone !== phone || data.name !== name) {
    //         setIsDisabled(false);
    //     } else {
    //         setIsDisabled(true);
    //     }
    //
    //     if (phone && name && !isSetData) {
    //         setData({
    //             ...data,
    //             phone: phone,
    //             name: name || ''
    //         });
    //         setIsSetData(true);
    //     }
    // }, [phone, name, data, isSetData]);

    return (
        <div className="pb-4 h-full">
            {isLoading ? (
                <Loading/>
            ) : (
                <div className="flex h-full space-x-4">
                    <div
                        className="p-4 space-y-4 w-1/3 border border-gray-200 rounded-lg shadow dark:border-gray-700">
                        {/* Basic Profile */}
                        <div className="text-center space-y-2">
                            <div className="relative w-32 h-32 mx-auto">
                                <img className="w-full h-full rounded-full"
                                     src={img_url || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`}
                                     alt="profile"/>
                                <div className="absolute bottom-0 right-0">
                                    <label htmlFor="file"
                                           className="button cursor-pointer text-white rounded-full p-2">
                                        <svg className="w-6 h-6 text-gray-100" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                             viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                                        </svg>
                                    </label>
                                    <input type="file" id="file" className="hidden"/>
                                </div>

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
                                <div className="text-2xl font-semibold">${orders_sum_total}</div>
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
