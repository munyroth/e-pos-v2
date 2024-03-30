import {Fragment, useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import {Dialog, Transition} from '@headlessui/react';
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";

export default function Items() {
    const axiosPrivate = useAxiosPrivate();

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);

    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({});
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const handleDelete = async id => {
        const controller = new AbortController();

        try {
            const res = await axiosPrivate.delete('/product/' + id, {
                signal: controller.signal
            });
            setItems(items.filter(item => item.id !== id));
            setOpenModalDelete(false);
        } catch (err) {

        }
    }

    const searchProduct = async (e) => {
        setContent(e.target.value);
        setIsLoading(true);
        const controller = new AbortController();
        const res = await axiosPrivate.get('/product', {
            signal: controller.signal,
            params: {
                content: e.target.value,
                page: 1
            }
        });
        setItems(res.data.data);
        setMeta(res.data.meta);
        setIsLoading(false);
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getItems = async () => {
            const res = await axiosPrivate.get('/product', {
                signal: controller.signal
            });
            isMounted && setItems(res.data.data);
            setMeta(res.data.meta);
            res.data.data.length === 0 && setIsEmpty(true);
            setIsLoading(false);
        }

        getItems().catch(() => console.log("fail"));

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [axiosPrivate]);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <h1 className="">ទំនិញ</h1>
                <Link
                    to="stock_in"
                    type="button"
                    className="rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-50 shadow-sm hover:bg-blue-600 active:ring-4 active:outline-none active:ring-blue-300"
                >
                    បន្ថែមទំនិញទៅក្នុងស្តុក
                </Link>
                <label htmlFor="table-search" className="sr-only">ស្វែងរក</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <input
                        onChange={searchProduct}
                        type="text"
                        id="table-search-users"
                        className="input w-80 pl-10"
                        placeholder="ស្វែងរក"/>
                </div>
            </div>
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-3/6 px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="w-1/6 px-6 py-3">
                            តម្លៃ
                        </th>
                        <th scope="col" className="w-1/6 px-6 py-3 rounded-r-lg">
                            សកម្មភាព
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading
                        ? null
                        : isEmpty
                            ?
                            <tr className="border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="w-10 h-10"></div>
                                    <div className="pl-3" role="status">
                                        <span className="">មិនមានទំនិញ</span>
                                    </div>
                                </th>
                            </tr>
                            : items.map(item => (
                                <tr className="border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="w-10 h-10"
                                             src={item.img_url} alt={item.name_kh}/>
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">{item.name_kh}</div>
                                            <div className="text-xs font-normal text-gray-500">{item.barcode}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="pl-3">
                                            <div className="text-base font-semibold text-main">${item.price}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="pl-1 font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            កែ
                                        </button>
                                        <button
                                            className="pl-3 font-medium text-red-600 dark:text-red-500 hover:underline"

                                            onClick={() => {
                                                setDeleteId(item.id);
                                                setOpenModalDelete(true);
                                            }}
                                        >
                                            លុប
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {isLoading && (
                <Loading/>
            )}
            <Pagination
                content={content}
                meta={meta}
                setMeta={setMeta}
                setItems={setItems}
                setLoader={setIsLoading}
                url="/product"/>
            <Transition.Root show={openModalDelete} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelModalDeleteRef}
                        onClose={setOpenModalDelete}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div
                                                className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600"
                                                                         aria-hidden="true"/>
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3"
                                                              className="text-base font-semibold leading-6 text-gray-900">
                                                    លុបទំនិញ
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        តើអ្នកពិតជាចង់លុបទំនិញនេះ? ទំនិញនឹងលុបចេញ
                                                        សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => handleDelete(deleteId)}
                                        >
                                            លុប
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpenModalDelete(false)}
                                            ref={cancelModalDeleteRef}
                                        >
                                            បោះបង់
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}