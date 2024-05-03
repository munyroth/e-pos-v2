import React, {useEffect, useRef, useState} from 'react';
import searchData from "../../../requestApi/searchData";
import Loading from "../../../components/loading";
import Pagination from "../../../components/pagination";
import {DocumentTextIcon} from "@heroicons/react/24/outline";
import BaseDialog from "../../../components/dialog";
import useGetDataList from "../../../hooks/useGetDataList";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function Bills() {
    const axiosPrivate = useAxiosPrivate();

    let url = '/order';
    const [bills, meta, isLoading, setBills, setMeta, setIsLoading] = useGetDataList(url);

    const [billDetail, setBillDetail] = useState(null);
    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [openModalBillDetail, setOpenModalBillDetail] = useState(false);
    const cancelModalBillDetail = useRef(null);

    const getBillDetail = async (id) => {
        try {
            const res = await axiosPrivate.get(url + '/' + id);
            setBillDetail(res.data.data);
            setOpenModalBillDetail(true)
        } catch (error) {
            console.error("Failed to fetch bill details:", error);
        }
    }

    useEffect(() => {
        meta?.total === 0 ? setIsEmpty(true) : setIsEmpty(false);
    }, [meta]);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="">វិក្កយបត្រ</h1>
                </div>
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
                        onChange={(e) => searchData(e.target.value, url, setContent, setIsLoading, setBills, setMeta)}
                        type="text"
                        id="table-search"
                        className="input w-80 pl-10"
                        placeholder="ស្វែងរកលេខវិក្កយបត្រ"/>
                </div>
            </div>
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 rounded-l-lg">
                            លេខវិក្កយបត្រ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            តម្លៃទំនិញសរុប
                        </th>
                        <th scope="col" className="px-6 py-3">
                            ការបញ្ចុះតម្លៃ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            តម្លៃសរុបចុងក្រោយ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            ប្រាក់ទទួល
                        </th>
                        <th scope="col" className="px-6 py-3">
                            ប្រាក់អាប់
                        </th>
                        <th scope="col" className="px-6 py-3">
                            អ្នកលក់
                        </th>
                        <th scope="col" className="px-6 py-3 rounded-r-lg">
                            ហាង
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading
                        ? null
                        : isEmpty
                            ? <tr className="dark:bg-gray-800 dark:border-gray-700 ">
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="w-10 h-10"></div>
                                    <div className="pl-3" role="status">
                                        <span className="">មិនមានវិក្កយបត្រទេ</span>
                                    </div>
                                </th>
                            </tr>
                            : bills.map(bill => (
                                <tr className="hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600"
                                    onClick={() => getBillDetail(bill.id)}
                                >
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        {bill.shop.name}-{bill.invoice_no}
                                    </th>
                                    <td className="px-6 py-4 text-main">
                                        ${bill.subtotal.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-red-500">
                                        ${bill.discount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-main">
                                        ${bill.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-main font-semibold">
                                        ${bill.received_usd.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-red-500 font-semibold">
                                        ${bill.return_usd.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {bill.user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {bill.shop.name}
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
                setItems={setBills}
                setLoader={setIsLoading}
                url={url}/>

            <BaseDialog
                icon={<div
                    className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DocumentTextIcon className="h-6 w-6 text-green-600"
                                      aria-hidden="true"/>
                </div>}
                title="លម្អិតវិក្កយបត្រ"
                openModal={openModalBillDetail}
                setOpenModal={setOpenModalBillDetail}
                cancelModalRef={cancelModalBillDetail}
            >
                <div className="flex-1">
                    <ul role="listitem" className="h-full flex flex-col space-y-4 overflow-y-scroll no-scrollbar">
                        {(billDetail !== null) ? billDetail.order_details?.map(item => (
                                <li className="p-3 border border-gray-200 rounded-lg flow-root dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="w-20 h-20"
                                                src={item.img_url}
                                                alt={item.name_kh}/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate dark:text-white">
                                                {item.name_kh}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {item.barcode}
                                            </p>
                                            <div className="flex justify-between items-end">
                                                <div className="flex">
                                                    <div className="relative rounded-md text-main">
                                                        តម្លៃ {item.price}៛
                                                    </div>
                                                </div>
                                                <div className="text-gray-900 truncate dark:text-white">
                                                    បរិមាណ {item.qty}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        ) : <div></div>}
                    </ul>
                </div>
            </BaseDialog>
        </>
    );
}
