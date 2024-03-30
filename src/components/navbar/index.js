import {Fragment, useEffect, useState} from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {

    const axiosPrivate = useAxiosPrivate();

    const [user, setUser] = useState();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async  () => {
            try {
                const res = await axiosPrivate.get('/user', {
                    signal: controller.signal
                });
                isMounted && setUser(res.data.data)
            } catch (err) {

            }
        }

        getUser();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    return (
        <Disclosure as="nav" className="px-4 border-b dark:bg-gray-800 dark:border-gray-700">
            {({ open }) => (
                <>
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="relative">
                            <div className="text-white absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                {user?.name}
                            </div>
                        </div>

                        <Menu as="div" className="relative ml-3">
                            <Menu.Button className="text-start p-1.5 flex justify-center rounded-lg text-sm hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-200">
                                <div className="w-36 flex items-center justify-center space-x-4">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={user?.img_url}
                                        alt="profile"
                                    />
                                    <div className="font-medium dark:text-white">
                                        <div>{user?.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user?.role.name_km}
                                        </div>
                                    </div>
                                </div>
                                <span className="sr-only">Open user menu</span>
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
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to={user?.role.name_en === 'Owner' ? '/admin/profile' : '/profile'}
                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                            >
                                                គណនី
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    {(user?.role.name_en === 'Admin' || user?.role.name_en === 'Owner')
                                    && <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/admin/dashboard"
                                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                >
                                                    ផ្ទាំងទិន្នន័យ
                                                </Link>
                                            )}
                                        </Menu.Item>}
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/signout"
                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                            >
                                                ចាកចេញ
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </>
            )}
        </Disclosure>
    )
}
