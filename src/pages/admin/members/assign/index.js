import React, {useEffect, useState} from "react";
import Pagination from "components/pagination";
import Loading from "components/loading";
import useGetDataList from "hooks/useGetDataList";
import Search from "components/form/Search";
import Empty from "components/empty";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";
import {axiosPrivate} from "api/axios";
import useGetDataObject from "hooks/useGetDataObject";
import toast, {Toaster} from "react-hot-toast";

export default function Assign() {
    const navigate = useNavigate();
    const {id} = useParams();

    let shopId = localStorage.getItem('shopId');
    let url = '/shop';
    const [params] = useState({
        business_id: shopId
    });
    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);
    const [user] = useGetDataObject('/employee/' + id);
    const [shops, meta, isShopsLoading, setShops, setMeta, setIsShopsLoading] = useGetDataList(url, null, null, params);

    const [isLoadingAssign, setIsLoadingAssign] = useState({});
    const [isLoadingUnassign, setIsLoadingUnassign] = useState({});

    const handleAssign = async (shopId) => {
        setIsLoadingAssign(prevState => ({...prevState, [shopId]: true}));
        const controller = new AbortController();
        const data = {
            type: 'shop',
            id: shopId,
            phone: user.phone
        }
        try {
            const response = await axiosPrivate.post("/admin/employee/assign", data, {
                signal: controller.signal
            });
            if (response.data.status === 200) {
                // Add employee to shop
                setShops(prevState => prevState.map(shop => {
                    if (shop.id === shopId) {
                        return {
                            ...shop,
                            employees: [...shop.employees, user]
                        }
                    }
                    return shop;
                }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('មានបញ្ហាកើតឡើងនៅពេលតែងតាំង');
        } finally {
            setIsLoadingAssign(prevState => ({...prevState, [shopId]: false}));
        }
    }

    const handleUnassign = (shopId) => {
        setIsLoadingUnassign(prevState => ({...prevState, [shopId]: true}));
        const controller = new AbortController();
        const data = {
            type: 'shop',
            id: shopId,
            phone: user.phone
        }
        axiosPrivate.post("/admin/employee/unassign", data, {
            signal: controller.signal
        }).then(response => {
            if (response.data.status === 200) {
                // Remove employee from shop
                setShops(prevState => prevState.map(shop => {
                    if (shop.id === shopId) {
                        return {
                            ...shop,
                            employees: shop.employees.filter(employee => employee.id !== Number(id))
                        }
                    }
                    return shop;
                }));
            } else {
                toast.error(response.data.message);
            }
        }).catch(error => {
            toast.error('មានបញ្ហាកើតឡើងនៅពេលដកចេញ');
        }).finally(() => {
            setIsLoadingUnassign(prevState => ({...prevState, [shopId]: false}));
        });
    }

    useEffect(() => {
        meta?.total === 0 ? setIsEmpty(true) : setIsEmpty(false);
    }, [meta]);

    return (
        <div className="h-full flex flex-col">
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="me-8">តែងតាំងអ្នកលក់</h1>
                    <button
                        onClick={() => {
                            navigate(-1);
                        }}
                        type="button"
                        className="button me-8">
                        រួចរាល់
                    </button>
                </div>

                <Search
                    id="search-branch"
                    placeholder="ស្វែងរកឈ្មោះសាខា"
                    url={url}
                    setContent={setContent}
                    setIsLoading={setIsShopsLoading}
                    setData={setShops}
                    setMeta={setMeta}
                    params={params}
                />
            </div>
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-4/6 px-6 py-3 rounded-l-lg">
                            ឈ្មោះហាង
                        </th>
                        <th scope="col" className="text-center w-2/6 px-6 py-3 rounded-r-lg">
                            សកម្មភាព
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isShopsLoading
                        ? null
                        : shops.map(shop => (
                            <tr className="h-14 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <img className="w-10 h-10"
                                         src={
                                             shop.img_url || 'https://ui-avatars.com/api/?name=' + shop.name + '&background=random&color=fff'
                                         } alt={shop.name}/>
                                    <div className="pl-3">
                                        <div className="text-base font-semibold">{shop.name}</div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        {shop.employees.map(employee => employee.id).includes(Number(id)) ? (
                                            <>
                                                <div
                                                    className="me-4 rounded-md bg-gray-700 flex items-center px-4 py-2 text-sm font-semibold text-white shadow-sm cursor-default"
                                                >
                                                    បានតែងតាំង
                                                </div>
                                                <button
                                                    disabled={isLoadingUnassign[shop.id] ? true : ""}
                                                    type="button"
                                                    className="rounded-md bg-red-600 flex items-center px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                                                    onClick={() => handleUnassign(shop.id)}
                                                >{isLoadingUnassign[shop.id] ? (
                                                    <>
                                                        <svg aria-hidden="true" role="status"
                                                             className="inline w-4 h-4 mr-1 text-white animate-spin"
                                                             viewBox="0 0 100 101"
                                                             fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                fill="#E5E7EB"/>
                                                            <path
                                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                fill="currentColor"/>
                                                        </svg>
                                                        កំពុងដកចេញ...
                                                    </>
                                                ) : ('ដកចេញ')}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                disabled={isLoadingAssign[shop.id] ? true : ""}
                                                type="button"
                                                className="rounded-md bg-green-600 flex items-center px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                                                onClick={() => handleAssign(shop.id)}
                                            >{isLoadingAssign[shop.id] ? (
                                                <>
                                                    <svg aria-hidden="true" role="status"
                                                         className="inline w-4 h-4 mr-1 text-white animate-spin"
                                                         viewBox="0 0 100 101"
                                                         fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="#E5E7EB"/>
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentColor"/>
                                                    </svg>
                                                    កំពុងតែងតាំង...
                                                </>
                                            ) : ('តែងតាំង')}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isShopsLoading
                ? <Loading/>
                : isEmpty
                    ? <Empty title="សាខា"/>
                    : <div className="flex-1"></div>
            }
            <Pagination
                content={content}
                meta={meta}
                setMeta={setMeta}
                setItems={setShops}
                setLoader={setIsShopsLoading}
                params={params}
                url={url}/>
            <Toaster/>
        </div>
    )
}