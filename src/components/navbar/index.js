import {Fragment, useEffect, useState} from 'react'
import {Disclosure, Listbox, Menu, Transition} from '@headlessui/react'
import {Link} from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Cookies from "js-cookie";
import {CheckIcon} from "@heroicons/react/20/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const axiosPrivate = useAxiosPrivate();

    const [user, setUser] = useState(null);
    const [shops, setShops] = useState([
        {id: 1, name: null},
    ]);

    let shopId = Cookies.get('shopId')

    const [selected, setSelected] = useState(shops[0])

    useEffect(() => {
        shops[0].name && setSelected(shops.find(shop => shop.id === parseInt(shopId)))
    }, [shops]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async () => {
            try {
                const res = await axiosPrivate.get('/user', {
                    signal: controller.signal
                });
                isMounted && setUser(res.data.data)
            } catch (err) {

            }
        }

        const getShop = async () => {
            try {
                const res = await axiosPrivate.get('/business', {
                    signal: controller.signal
                });
                isMounted && setShops(res.data.data)
            } catch (err) {

            }
        }

        getUser();
        getShop();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    return (
        <Disclosure as="nav" className="px-4 border-b dark:bg-gray-800 dark:border-gray-700">
            {({open}) => (
                <>
                    <div className="relative flex h-16 items-center justify-between">
                        <Listbox value={selected.id} onChange={e => {
                            setSelected(shops.find(shop => shop.id === e))
                        }}>
                            {({open}) => (
                                <div className="">
                                    <Listbox.Button
                                        className="relative w-full cursor-pointer rounded-md py-1.5 px-3 text-left sm:leading-6 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span className="flex items-center">
                                            {selected.name
                                                ? <span className="block truncate">{selected.name}</span>
                                                : <svg aria-hidden="true"
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
                                            }
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
                                                            active ? 'bg-gray-700 text-white' : 'text-gray-900',
                                                            'relative cursor-default select-none py-2 pl-3 pr-9 dark:text-white dark:hover:bg-gray-700'
                                                        )
                                                    }
                                                    value={shop.id}
                                                >
                                                    {({selected, active}) => (
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
                                                                        active ? 'text-white' : 'text-main',
                                                                        'absolute inset-y-0 right-0 flex items-center px-2'
                                                                    )}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            )}
                        </Listbox>

                        <Menu as="div" className="relative ml-3">
                            <Menu.Button
                                className="text-start p-1.5 flex justify-center rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <div className="w-36 flex items-center justify-center space-x-3">
                                    {user && <img
                                        className="h-10 w-10 rounded-full"
                                        src={user.img_url || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random&color=fff'
                                        }
                                        alt="profile"
                                    />}
                                    <div className="font-medium dark:text-white">
                                        <div>{user?.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user?.role}
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
                                <Menu.Items
                                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900">
                                    <Menu.Item>
                                        {({active}) => (
                                            <Link
                                                to={user?.role === 'admin' ? '/admin/profile' : '/profile'}
                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-700')}
                                            >
                                                គណនី
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    {(user?.role === 'admin')
                                        && <Menu.Item>
                                            {({active}) => (
                                                <Link
                                                    to="/admin/dashboard"
                                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-700')}
                                                >
                                                    ផ្ទាំងទិន្នន័យ
                                                </Link>
                                            )}
                                        </Menu.Item>}
                                    <Menu.Item>
                                        {({active}) => (
                                            <Link
                                                to="/signout"
                                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-700')}
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
