import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";

export default function Products() {
    const axiosPrivate = useAxiosPrivate();

    const [shop, setShop] = useState([]);
    const [meta, setMeta] = useState({});
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getShop = async () => {
            try {
                const res = await axiosPrivate.get('/shop', {
                    signal: controller.signal
                });
                isMounted && setShop(res.data.data);
                res.data.data.length === 0 && setIsEmpty(true);
                setMeta(res.data.meta);
                setIsLoading(false);
            } catch (err) {

            }
        }

        getShop();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <h1 className="">សាខា</h1>
                <Link
                    to="add"
                    type="button"
                    className="rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-50 shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    បន្ថែមសាខា
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
                        <th scope="col" className="px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            ចំនួនលក់សរុប
                        </th>
                        <th scope="col" className="px-6 py-3">
                            ចំណូលសរុប
                        </th>
                        <th scope="col" className="px-6 py-3 rounded-r-lg">
                            សកម្មភាព
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading
                        ? null
                        : isEmpty
                            ? <tr className="dark:bg-gray-800 dark:border-gray-700 ">
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="w-10 h-10"></div>
                                    <div className="pl-3" role="status">
                                        <span className="">មិនមានសាខា</span>
                                    </div>
                                </th>
                            </tr>
                            : shop.map(item => (
                                <tr className="h-14 border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.orders_count}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${parseFloat(item?.orders_sum_total ?? 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href="#"
                                           className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            កែ
                                        </a>
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
                setItems={setShop}
                setLoader={setIsLoading}
                url="/shop"/>
        </>
    )
}