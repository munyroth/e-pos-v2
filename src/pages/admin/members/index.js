import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";
import search from "../../../functions/search";

export default function Products() {
    let url = '/employee';
    const axiosPrivate = useAxiosPrivate();

    const [member, setMember] = useState([]);
    const [meta, setMeta] = useState({});
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        meta?.total === 0 ? setIsEmpty(true) : setIsEmpty(false);
    }, [meta]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getMembers = async () => {
            try {
                const res = await axiosPrivate.get(url, {
                    signal: controller.signal
                });
                isMounted && setMember(res.data.data);
                setMeta(res.data.meta);
                setIsLoading(false);
            } catch (err) {

            }
        }

        getMembers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <h1 className="">សមាជិក</h1>
                <button
                    onClick={() => {

                    }}
                    type="button"
                    className="rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-50 shadow-sm hover:bg-blue-600 active:ring-1 active:outline-none active:ring-blue-300"
                >
                    បន្ថែមសមាជិក
                </button>
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
                        onChange={(e) => search(e, setContent, setIsLoading, setMember, setMeta, url)}
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
                        {/*<th scope="col" className="p-4 rounded-l-lg">*/}
                        {/*    <div className="flex items-center">*/}
                        {/*        <input id="checkbox-all-search" type="checkbox"*/}
                        {/*               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>*/}
                        {/*        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>*/}
                        {/*    </div>*/}
                        {/*</th>*/}
                        <th scope="col" className="px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            លេខទូរស័ព្ទ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            តួនាទី
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
                                        <span className="">មិនមានសមាជិក</span>
                                    </div>
                                </th>
                            </tr>
                            : member.map(item => (
                                <tr className="h-14 border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                    {/*<td className="w-4 p-4">*/}
                                    {/*    <div className="flex items-center">*/}
                                    {/*        <input id="checkbox-table-search-1" type="checkbox"*/}
                                    {/*               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>*/}
                                    {/*        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>*/}
                                    {/*    </div>*/}
                                    {/*</td>*/}
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="w-10 h-10"
                                             src={item.image_url} alt={item.name}/>
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">{item.name}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.phone}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.role === "manager" ? (
                                            "អ្នកគ្រប់គ្រង"
                                        ) : item.role === "sale" ? (
                                            "អ្នកលក់"
                                        ) : (
                                            "សមាជិក"
                                        )}
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
                setItems={setMember}
                setLoader={setIsLoading}
                url={url}/>
        </>
    )
}