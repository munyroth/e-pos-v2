import {Component} from "react";
import {Link, NavLink, Outlet} from "react-router-dom";
import Navbar from "../navbar";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowECommerce: false
        };
    }

    render() {
        return (
            <>
                <button
                    aria-controls="logo-sidebar"
                    type="button"
                    className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                        className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            clipRule="evenodd" fillRule="evenodd"
                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button>

                <aside id="logo-sidebar"
                       className="fixed top-0 left-0 w-64 h-screen transition-transform -translate-x-full border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
                       aria-label="Sidebar">
                    <div className="h-full px-3 overflow-y-auto bg-white dark:bg-gray-800">
                        <Link
                            to="dashboard"
                            className="flex items-center justify-center py-4">
                            <img
                                className="h-6 mr-3 sm:h-8"
                                src="https://res.cloudinary.com/dlb5onqd6/image/upload/v1673491430/data/logo_ioru7h.png"
                                alt="ePOS"
                            />
                            <span
                                className="text-main self-center text-xl font-semibold whitespace-nowrap sm:text-2xl">ePOS</span>
                        </Link>
                        <ul className="space-y-2 font-medium mt-4">
                            <li>
                                <NavLink
                                    to="dashboard"
                                    className={({isActive}) => classNames(
                                        isActive ? 'bg-main text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                        'flex items-center w-full p-2 transition duration-75 rounded-lg group'
                                    )}
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-6 h-6"
                                        fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                    </svg>
                                    <span className="ml-3">ផ្ទាំងទិន្នន័យ</span>
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => this.setState({isShowECommerce: !this.state.isShowECommerce})}
                                    className="flex items-center w-full p-2 transition duration-75 rounded-lg group text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-6 h-6"
                                        fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                            clipRule="evenodd"></path>
                                    </svg>
                                    <span
                                        className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">គ្រប់គ្រងទំនិញ</span>
                                    {this.state.isShowECommerce
                                        ? <svg
                                            aria-hidden="true"
                                            className="w-3 h-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 10 6">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="2" d="m1 4 4-4 4 4"/>
                                        </svg>
                                        : <svg
                                            aria-hidden="true"
                                            className="w-3 h-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2" d="m1 1 4 4 4-4"/>
                                        </svg>}
                                </button>
                                {this.state.isShowECommerce && (
                                    <ul className="py-2 space-y-2">
                                        <li>
                                            <NavLink
                                                to="products"
                                                className={({isActive}) => classNames(
                                                    isActive ? 'bg-main text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                                    'flex items-center w-full p-2 transition duration-75 rounded-lg group'
                                                )}
                                            ><span className="ml-9">ទំនិញ</span>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="categories"
                                                className={({isActive}) => classNames(
                                                    isActive ? 'bg-main text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                                    'flex items-center w-full p-2 transition duration-75 rounded-lg group'
                                                )}
                                            ><span className="ml-9">ប្រភេទទំនិញ</span>
                                            </NavLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <NavLink
                                    to="bills"
                                    className={({isActive}) => classNames(
                                        isActive ? 'bg-main text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                        'flex items-center w-full p-2 transition duration-75 rounded-lg group'
                                    )}
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-6 h-6"
                                        fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                                            clipRule="evenodd"/>
                                        <path
                                            d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z"/>
                                    </svg>


                                    <span className="ml-3">វិក្កយបត្រ</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="members"
                                    className={({isActive}) => classNames(
                                        isActive ? 'bg-main text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                        'flex items-center w-full p-2 transition duration-75 rounded-lg group'
                                    )}
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-6 h-6"
                                        fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path fillRule="evenodd"
                                              d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                                              clipRule="evenodd"/>
                                        <path
                                            d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z"/>
                                    </svg>
                                    <span className="ml-3">សមាជិក</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="branches"
                                    className={({isActive}) => classNames(
                                        isActive ? 'bg-main text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                        'flex items-center w-full p-2 transition duration-75 rounded-lg group'
                                    )}
                                >
                                    <svg
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

                                    <span className="ml-3">សាខា</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="cashier"
                                    className={({isActive}) => classNames(
                                        isActive ? 'bg-main text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                        'flex items-center w-full p-2 transition duration-75 rounded-lg group'
                                    )}
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-6 h-6"
                                        fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path fillRule="evenodd"
                                              d="m12.08,5H2C2,2.243,4.243,0,7,0h8.413c-1.768,1.061-3.027,2.876-3.334,5Zm1.92,5v11c0,1.657-1.343,3-3,3H3c-1.657,0-3-1.343-3-3v-11c0-1.657,1.343-3,3-3h8c1.657,0,3,1.343,3,3Zm-8,10h0c0-.552-.448-1-1-1h-1c-.552,0-1,.448-1,1h0c0,.552.448,1,1,1h1c.552,0,1-.448,1-1Zm0-4h0c0-.552-.448-1-1-1h-1c-.552,0-1,.448-1,1h0c0,.552.448,1,1,1h1c.552,0,1-.448,1-1Zm5,4h0c0-.552-.448-1-1-1h-1c-.552,0-1,.448-1,1h0c0,.552.448,1,1,1h1c.552,0,1-.448,1-1Zm0-4h0c0-.552-.448-1-1-1h-1c-.552,0-1,.448-1,1h0c0,.552.448,1,1,1h1c.552,0,1-.448,1-1Zm0-4v-1c0-.552-.448-1-1-1h-6c-.552,0-1,.448-1,1v1c0,.552.448,1,1,1h6c.552,0,1-.448,1-1ZM19,1c-2.757,0-5,2.243-5,5v.024c1.209.912,2,2.348,2,3.976v6.5l.01.003c.002.365.193.717.542.892l1,.5c.326.162.713.136,1.012-.069l1.767-1.209,2.17,1.25c.154.089.326.134.499.134s.346-.045.5-.134c.31-.179.5-.509.5-.866V6c0-2.757-2.243-5-5-5Z"
                                              clipRule="evenodd"/>
                                    </svg>

                                    <span className="ml-3">គិតលុយ</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </aside>

                <div className="relative h-screen sm:ml-64">
                    <div className="absolute top-0 pt-20 px-4 pb-4 h-full w-full">
                        <Outlet/>
                    </div>
                    <Navbar/>
                </div>
            </>
        )
    }
}