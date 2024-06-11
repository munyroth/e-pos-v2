import {Fragment, useEffect, useState} from 'react'
import {Disclosure, Listbox, Menu, Transition} from '@headlessui/react'
import {Link} from "react-router-dom";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import {CheckIcon} from "@heroicons/react/20/solid";
import useAuth from "hooks/useAuth";
import useGetDataObject from "hooks/useGetDataObject";
import useGetDataList from "hooks/useGetDataList";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const storageTheme = localStorage.getItem('theme');
    const [theme, setTheme] = useState(storageTheme || systemTheme);

    const applyTheme = (newTheme) => {
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        const handleSystemThemeChange = (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkThemeMediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            darkThemeMediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, []);

    const axiosPrivate = useAxiosPrivate();
    const {auth, logout} = useAuth();

    const [user, isLoadingUser] = useGetDataObject('/user')
    let url = auth.role === 'admin' ? '/business?is_all=true' : '/shop?is_all=true';
    // eslint-disable-next-line
    const [shops, meta, isLoadingShops] = useGetDataList(url)
    const [selected, setSelected] = useState({
        id: 0,
        name: ""
    })

    useEffect(() => {
        let shopId = localStorage.getItem('shopId');
        if (shopId && !isLoadingShops) {
            const foundShop = shops.find(shop => shop.id === parseInt(shopId));
            if (foundShop) {
                setSelected(foundShop);
            }
        }
    }, [shops, isLoadingShops]);

    return (
        <Disclosure as="nav" className="px-4 border-b dark:bg-gray-800 dark:border-gray-700">
            {({open}) => (
                <>
                    <div className="relative flex h-16 items-center justify-between">
                        {isLoadingShops
                            ? <svg aria-hidden="true"
                                   className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500"
                                   viewBox="0 0 100 101" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            : <Listbox value={selected.id} onChange={e => {
                                const foundShop = shops.find(shop => shop.id === e);
                                if (foundShop) {
                                    setSelected(foundShop);
                                    window.location.reload(); // Refresh the page
                                }
                            }}>
                                {({open}) => (
                                    <div className="">
                                        <Listbox.Button
                                            className="relative w-full cursor-pointer rounded-md py-1.5 px-3 text-left sm:leading-6 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex items-center">
                                            <span className="block truncate">{selected.name || "ជ្រើសរើសហាង"}</span>
                                        </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options
                                                className="absolute z-10 mt-1 max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-900">
                                                {shops.map((shop) => (
                                                    <Listbox.Option
                                                        key={shop.id}
                                                        className={({active}) =>
                                                            classNames(
                                                                active ? 'bg-gray-200 text-gray-900 dark:bg-gray-700' : 'text-gray-900',
                                                                'relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
                                                            )
                                                        }
                                                        value={shop.id}
                                                    >
                                                        {({selected, active}) => {
                                                            selected && localStorage.setItem('shopId', shop.id)
                                                            return (
                                                                <>
                                                                    <div className="flex items-center">
                                                                <span
                                                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}
                                                                >
                                                                {shop.name}
                                                              </span>
                                                                    </div>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active ? 'text-main' : 'text-main',
                                                                                'absolute inset-y-0 right-0 flex items-center px-2'
                                                                            )}
                                                                        >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                                                </span>
                                                                    ) : null}
                                                                </>
                                                            )
                                                        }}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                )}
                            </Listbox>
                        }
                        <div className="flex items-center">
                            <button
                                onClick={toggleTheme}
                                className="me-3 p-1.5 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {theme === 'light'
                                    ? (<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                        <path fillRule="evenodd"
                                              d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z"
                                              clipRule="evenodd"/>
                                    </svg>)
                                    : (<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd"
                                              d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                                              clipRule="evenodd"/>
                                    </svg>)
                                }
                            </button>
                            {isLoadingUser
                                ? <svg aria-hidden="true"
                                       className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500"
                                       viewBox="0 0 100 101" fill="none"
                                       xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"/>
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"/>
                                </svg>
                                : <Menu as="div" className="relative">
                                    <Menu.Button
                                        className="text-start p-1.5 flex justify-center rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={user.img_url || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random&color=fff'}
                                                alt="profile"
                                            />
                                            <div className="font-medium dark:text-white">
                                                <div>{user.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.role === "admin" ? (
                                                        "ម្ចាស់ហាង"
                                                    ) : user.role === "manager" ? (
                                                        "អ្នកគ្រប់គ្រង"
                                                    ) : user.role === "sale" ? (
                                                        "អ្នកលក់"
                                                    ) : (
                                                        "សមាជិក"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items
                                            className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900">
                                            <Menu.Item>
                                                {({active}) => (
                                                    <Link
                                                        to={user.role === 'admin' ? '/admin/profile/information' : '/profile/information'}
                                                        className={classNames(active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-white')}
                                                    >
                                                        គណនី
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            {(user.role === 'admin')
                                                && <Menu.Item>
                                                    {({active}) => (
                                                        <Link
                                                            to="/admin/dashboard"
                                                            className={classNames(active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-white')}
                                                        >
                                                            ផ្ទាំងទិន្នន័យ
                                                        </Link>
                                                    )}
                                                </Menu.Item>}
                                            <Menu.Item>
                                                {({active}) => (
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
                                                        className={classNames(active ? 'bg-gray-100 dark:bg-gray-700' : '', 'w-full text-start block px-4 py-2 text-sm text-red-600')}
                                                    >
                                                        ចាកចេញ
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            }
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    )
}
