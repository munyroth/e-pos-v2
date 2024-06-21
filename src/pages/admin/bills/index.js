import React, {useEffect, useRef, useState} from 'react';
import Loading from "components/loading";
import Pagination from "components/pagination";
import {DocumentTextIcon} from "@heroicons/react/24/outline";
import BaseDialog from "components/dialog";
import useGetDataList from "hooks/useGetDataList";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import Search from "components/form/Search";
import useAuth from "hooks/useAuth";
import Empty from "components/empty";
import searchData from "requestApi/searchData";
import Filter from "components/form/Filter";
import getData from "requestApi/getData";

const DISCOUNT_TYPE = {
    VALUE: 'value',
    PERCENTAGE: 'percentage'
}

export default function Bills() {
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();

    let shopId = localStorage.getItem('shopId');
    let url = '/order';
    const [params, setParams] = useState(() => {
        return auth.role === 'admin'
            ? {business_id: shopId}
            : {shop_id: shopId}
    });
    const [bills, meta, isLoading, setBills, setMeta, setIsLoading] = useGetDataList(url, null, null, params);
    const [branches, setBranches] = useState([]);
    const [members, setMembers] = useState([]);

    const [billDetail, setBillDetail] = useState(null);
    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [openModalBillDetail, setOpenModalBillDetail] = useState(false);
    const cancelModalBillDetail = useRef(null);

    // Filter
    const handleFilterChange = (key, value) => {
        const updatedParams = {...params};
        updatedParams[key] = value !== "all" ? parseInt(value) : null;

        setParams(updatedParams);

        searchData(content, url, setContent, setIsLoading, setBills, setMeta, updatedParams)
            .then(r => r)
            .catch(e => console.error("Error while fetching data:", e)); // Proper error handling
    };

    const getBillDetail = async (id) => {
        try {
            const u = auth.role === 'admin' ? 'admin' + url : url;
            const res = await axiosPrivate.get(`${u}/${id}`);
            setBillDetail(res.data.data);
            setOpenModalBillDetail(true)
        } catch (error) {
            console.error("Failed to fetch bill details:", error);
        }
    }

    useEffect(() => {
        meta?.total === 0 ? setIsEmpty(true) : setIsEmpty(false);
    }, [meta]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        if (auth.role === 'admin') {
            getData(
                controller,
                isMounted,
                '/shop?is_all=true&business_id=' + shopId,
                0,
                setBranches
            ).then(r => r).catch(e => e);

            getData(
                controller,
                isMounted,
                '/employee?is_all=true&business_id=' + shopId,
                0,
                setMembers
            ).then(r => r).catch(e => e);
        }

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [shopId, auth.role]);


    return (
        <div className="h-full flex flex-col">
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="me-8">ការបញ្ជាទិញ</h1>
                    {auth.role === 'admin'
                        ? <>
                            <Filter
                                title="សាខា"
                                id="filter-branch"
                                onChange={(e) => handleFilterChange('shop_id', e.target.value)}
                                selectOptions={branches}
                                className="me-8"
                            />

                            <Filter
                                title="អ្នកលក់"
                                id="filter-member"
                                onChange={(e) => handleFilterChange('created_by', e.target.value)}
                                selectOptions={members}
                                className="me-8"
                            />
                        </> : null}
                </div>

                <Search
                    id="search-bill"
                    placeholder="ស្វែងរកលេខការបញ្ជាទិញ"
                    url={url}
                    params={params}
                    role={auth.role}
                    setContent={setContent}
                    setIsLoading={setIsLoading}
                    setData={setBills}
                    setMeta={setMeta}
                />
            </div>
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="2/12 px-6 py-3 rounded-l-lg">
                            លេខការបញ្ជាទិញ
                        </th>
                        <th scope="col" className="2/12 px-6 py-3">
                            តម្លៃទំនិញសរុប
                        </th>
                        <th scope="col" className="1/12 px-6 py-3">
                            ការបញ្ចុះតម្លៃ
                        </th>
                        <th scope="col" className="2/12 px-6 py-3">
                            តម្លៃសរុប
                        </th>
                        <th scope="col" className="2/12 px-6 py-3">
                            ប្រាក់ទទួល
                        </th>
                        <th scope="col" className="1/12 px-6 py-3">
                            ប្រាក់អាប់
                        </th>
                        {auth.role === 'admin'
                            ? <>
                                <th scope="col" className="1/12 px-6 py-3">
                                    អ្នកលក់
                                </th>
                                <th scope="col" className="1/12 px-6 py-3 rounded-r-lg">
                                    សាខា
                                </th>
                            </> : null}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading
                        ? null
                        : bills.map(bill => (
                            <tr className="h-14 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600 cursor-pointer"
                                onClick={() => getBillDetail(bill.id)}
                            >
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    {bill.order_no}
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
                                {auth.role === 'admin'
                                    ? <>
                                        <td className="px-6 py-4">
                                            {bill.user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {bill.shop.name}
                                        </td>
                                    </>
                                    : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isLoading
                ? <Loading/>
                : isEmpty
                    ? <Empty title="ការបញ្ជាទិញ"/>
                    : <div className="flex-1"></div>
            }
            <Pagination
                content={content}
                meta={meta}
                setMeta={setMeta}
                setItems={setBills}
                setLoader={setIsLoading}
                url={url}
                params={params}
            />

            <BaseDialog
                icon={<div
                    className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DocumentTextIcon className="h-6 w-6 text-green-600"
                                      aria-hidden="true"/>
                </div>}
                title="លម្អិតការបញ្ជាទិញ"
                openModal={openModalBillDetail}
                setOpenModal={setOpenModalBillDetail}
                cancelModalRef={cancelModalBillDetail}
            >
                <div className="mb-2 px-3 dark:text-white">
                    <p className="text-lg font-semibold">កាលបរិច្ឆេទ: {
                        new Date(billDetail?.created_at).toLocaleString('km-KH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric'
                        })}</p>
                    <p className="text-lg font-semibold">លេខការបញ្ជាទិញ: {billDetail?.order_no}</p>
                    {auth.role === 'admin'
                        ? <>
                            <p className="text-lg font-semibold">អ្នកលក់: {billDetail?.user.name}</p>
                            <p className="text-lg font-semibold">សាខា: {billDetail?.shop.name}</p>
                        </>
                        : null}
                    <p className="text-lg font-semibold">ផលិតផលសរុប: {billDetail?.order_details.length}</p>
                </div>
                <div className="flex-1">
                    <ul role="listitem" className="h-full flex flex-col space-y-4 overflow-y-scroll no-scrollbar">
                        {billDetail?.order_details?.map(item => (
                                <li className="p-3 border border-gray-200 rounded-lg flow-root dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="w-20 h-20"
                                                src={item.img_url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                                                alt={item.name_kh}/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate dark:text-white">
                                                {item.name_kh}
                                            </p>
                                            <p className="text-sm text-gray-600 truncate dark:text-gray-400">
                                                {item.barcode}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <div className="font-bold text-main w-3/12">
                                                    ${item.price}
                                                </div>
                                                <div className="text-gray-600 truncate dark:text-gray-300  w-3/12">
                                                    x{item.qty}
                                                </div>
                                                <div className="font-bold text-red-600 w-3/12">
                                                    {item.discount_type === DISCOUNT_TYPE.PERCENTAGE
                                                        ? `-${item.discount * 100}%`
                                                        : `-$${item.discount}`
                                                    }
                                                </div>
                                                <div className="font-bold text-lg text-main w-3/12 text-end">
                                                    ${((item.price * item.qty) - item.discount).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="mt-2 px-3 dark:text-white">
                    <div
                        className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <p>សរុប:</p>
                        <p className="font-bold text-main">${billDetail?.subtotal}</p>
                    </div>
                    <div
                        className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <p>បញ្ចុះតម្លៃ:</p>
                        <p className="font-bold text-red-600">-${billDetail?.discount}</p>
                    </div>
                    <div
                        className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <p>សរុបចុងក្រោយ:</p>
                        <p className="font-bold text-main text-lg">${billDetail?.total.toFixed(2)}</p>
                    </div>
                </div>
            </BaseDialog>
        </div>
    );
}
