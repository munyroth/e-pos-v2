import LineChart from "../../../components/charts/LineChart";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Loading from "../../../components/loading";
import Filter from "../../../components/form/Filter";


export default function Dashboard() {
    let url = '/admin/report/sale';
    const axiosPrivate = useAxiosPrivate();

    const [report, setReport] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(null);
    const [years] = useState(
        () => {
            let year = [];
            let currentYear = new Date().getFullYear();
            for (let i = 0; i < 5; i++) {
                year.push({
                    id: currentYear - i,
                    name: currentYear - i
                });
            }
            return year;
        }
    );
    const [activeYear, setActiveYear] = useState(null);
    const [months] = useState(
        () => {
            let month = [];
            const monthNames = [
                "មករា", "កុម្ភៈ", "មិនា", "មេសា", "ឧសភា", "មិថុនា",
                "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
            ];
            for (let i = 1; i <= 12; i++) {
                month.push({
                    id: i,
                    name: monthNames[i - 1]
                });
            }
            return month;

        }
    );
    const [activeMonth, setActiveMonth] = useState(1);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getReport = async () => {
            try {
                const res = await axiosPrivate.get(url, {
                    signal: controller.signal,
                    params: {
                        past_day: activeTab,
                        year: activeYear,
                        month: activeYear ? activeMonth : null
                    }
                });
                isMounted && setReport(res.data.data);
                setIsLoading(false);
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        }

        getReport().then();

    }, [url, axiosPrivate, activeTab, activeYear, activeMonth]);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="me-8">ផ្ទាំងព័ត៌មាន</h1>
                    <Filter
                        title="ឆ្នាំ"
                        id="year"
                        onChange={(e) => {
                            const {value} = e.target;
                            value !== "all" ? setActiveYear(value) : setActiveYear(null);
                        }}
                        selectOptions={years}
                    />
                    {activeYear && <Filter
                        title="ខែ"
                        id="month"
                        onChange={(e) => {
                            const {value} = e.target;
                            setActiveMonth(value);
                        }}
                        isHasAll={false}
                        selectOptions={months}
                        className="ml-4"
                    />}
                </div>

                {activeYear ? <></>
                    : <div
                        className="flex items-center text-xs font-medium text-center text-gray-500 dark:text-gray-400 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px border-b border-gray-200">
                            <li className="mr-2">
                                <button
                                    onClick={() => {
                                        setActiveTab(null);
                                    }}
                                    className={classNames((activeTab === null) ? 'text-main border-main rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300', 'inline-block p-4 border-b-2 rounded-t-lg')}
                                >
                                    ទាំងអស់
                                </button>
                            </li>
                            <li className="mr-2">
                                <button
                                    onClick={() => {
                                        setActiveTab(7);
                                    }}
                                    className={classNames((activeTab === 7) ? 'text-main border-main rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300', 'inline-block p-4 border-b-2 rounded-t-lg')}
                                >
                                    ៧ថ្ងៃចុងក្រោយ
                                </button>
                            </li>
                            <li className="mr-2">
                                <button
                                    onClick={() => {
                                        setActiveTab(30);
                                    }}
                                    className={classNames((activeTab === 30) ? 'text-main border-main rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300', 'inline-block p-4 border-b-2 rounded-t-lg')}
                                >
                                    ៣០ថ្ងៃចុងក្រោយ
                                </button>
                            </li>
                            <li className="mr-2">
                                <button
                                    onClick={() => {
                                        setActiveTab(90);
                                    }}
                                    className={classNames((activeTab === 90) ? 'text-main border-main rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300', 'inline-block p-4 border-b-2 rounded-t-lg')}
                                >
                                    ៩០ថ្ងៃចុងក្រោយ
                                </button>
                            </li>

                        </ul>
                    </div>}
            </div>
            {isLoading ? (
                <Loading/>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    <div className="h-full">
                        <div
                            className="w-full h-full py-4 font-bold text-center border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="dark:text-white">
                                <h5 className="text-lg">ចំនួនលក់សរុប</h5>
                                {/*<p className="text-main">+1%</p>*/}
                            </div>
                            <p className="text-3xl mt-2 dark:text-white">{report?.total_sales}</p>
                        </div>
                    </div>
                    <div className="h-full">
                        <div
                            className="w-full h-full py-4 font-bold text-center border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="dark:text-white">
                                <h5 className="text-lg">ចំនួនទំនិញលក់សរុប</h5>
                                {/*<p className="text-main">+1%</p>*/}
                            </div>
                            <p className="text-3xl mt-2 dark:text-white">{report?.total_items_sales}</p>
                        </div>
                    </div>
                    <div className="h-full">
                        <div
                            className="w-full h-full py-4 font-bold text-center border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="dark:text-white">
                                <h5 className="text-lg">ចំនួនទំនិញលក់បង់ដោយក្រដាសប្រាក់</h5>
                                {/*<p className="text-main">+1%</p>*/}
                            </div>
                            <p className="text-3xl mt-2 dark:text-white">{report?.total_sales_by_payment_type?.cash}</p>
                        </div>
                    </div>
                    <div className="h-full">
                        <div
                            className="w-full h-full py-4 font-bold text-center border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="dark:text-white">
                                <h5 className="text-lg">ចំនួនទំនិញលក់បង់ដោយអនឡាញ</h5>
                                {/*<p className="text-main">+1%</p>*/}
                            </div>
                            <p className="text-3xl mt-2 dark:text-white">{report?.total_sales_by_payment_type?.khqr}</p>
                        </div>
                    </div>
                    <div className="col-span-4 flex items-start h-full">
                        <div
                            className="flex flex-col justify-between w-full h-full border border-gray-200 rounded-lg shadow sm:pt-4 sm:px-4 dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex-col items-center mb-4">
                                <h2 className="text-main mb-4">
                                    $ {report?.gross_sales?.total.toFixed(2)}
                                </h2>
                                <h3 className="">
                                    ចំនួនលក់
                                </h3>
                            </div>
                            <LineChart
                                data={report.gross_sales?.daily || {}}
                                title="ចំនួនលក់"/>
                        </div>
                    </div>
                    <div className="col-span-2 flex items-start row-span-2 mb-4">
                        <div
                            className="w-full h-full border border-gray-200 rounded-lg shadow sm:pt-4 sm:px-4 sm:pb-2 dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="">
                                    កំពូលផលិតផល
                                </h3>
                                <Link
                                    to=""
                                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                    មើលទាំងអស់
                                </Link>
                            </div>
                            <div className="flow-root">
                                <ul
                                    role="listitem"
                                    className="divide-y divide-gray-200 dark:divide-gray-700">

                                    {report?.top_selling_products?.map(product => (
                                        <li className="py-3 sm:py-4" key={product.product_id}>
                                            <div className="flex items-center space-x-4 h-8">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="w-8 h-8 rounded-full"
                                                        src={product.product_info.img_url}
                                                        alt={product.product_info.name_kh}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        {product.product_info.name_kh}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        $ {product.product_info.price}
                                                    </p>
                                                </div>
                                                <div
                                                    className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    {product.total_quantity}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 flex items-start row-span-2 mb-4">
                        <div
                            className="w-full h-full border border-gray-200 rounded-lg shadow sm:pt-4 sm:px-4 sm:pb-2 dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="">
                                    កំពូលសាខាលក់ច្រើនបំផុត
                                </h3>
                                <Link
                                    to=""
                                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                    មើលទាំងអស់
                                </Link>
                            </div>
                            <div className="flow-root">
                                <ul role="listitem" className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {report?.top_shops_performance?.map(shop => (
                                        <li className="py-3 sm:py-4">
                                            <div className="flex items-center space-x-4 h-8">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        {shop.shop_name}
                                                    </p>
                                                </div>
                                                <div
                                                    className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    ${shop?.amount_earn?.toFixed(2)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}