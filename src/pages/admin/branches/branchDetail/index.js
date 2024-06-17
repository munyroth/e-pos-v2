import {useParams} from "react-router";
import useGetDataObject from "hooks/useGetDataObject";
import React, {useState} from "react";
import Loading from "components/loading";
import useGetDataList from "hooks/useGetDataList";
import Empty from "components/empty";

export default function BranchDetail() {
    const ACTIVE_TABS = {
        MEMBER: 'member',
        PAYMENT: 'payment',
    }

    const PAYMENT_METHODS = {
        'Cash': 'សាច់ប្រាក់',
        'KHQR Photo': 'រូបថតKHQR',
        'KHQR': 'ប្រព័ន្ធបាគង',
        'ABA Bank': 'ធនាគារABA',
        'Wing Bank': 'ធនាគារWing',
    }

    const STATUS = {
        'Active': 'សកម្ម',
        'Inactive': 'មិនសកម្ម',
    }

    const {id} = useParams();

    const url = '/shop/' + id;
    const [branch, isLoading] = useGetDataObject(url);

    const urlMembers = '/employee';
    // eslint-disable-next-line
    const [members, metaMembers, isLoadingMembers, setMembers, setMetaMembers, setIsLoadingMembers] = useGetDataList(
        urlMembers, null, null, {
            shop_id: id
        }, ''
    );

    const urlPayments = '/payment-method';
    // eslint-disable-next-line
    const [payments, metaPayments, isLoadingPayments, setPayments, setMetaPayments, setIsLoadingPayments] = useGetDataList(
        urlPayments, null, null, {
            shop_id: id
        }, ''
    );

    const [activeTab, setActiveTab] = useState(ACTIVE_TABS.MEMBER);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="h-full flex flex-col dark:text-white">
            <div className="h-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => window.history.back()}
                        className="">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                    </button>
                    <h1 className="">{branch.name}</h1>
                </div>
            </div>

            {isLoading
                ? <Loading/>
                : <>
                    <div
                        className="flex items-center font-medium text-center text-gray-500 dark:text-gray-400 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px border-b border-gray-200">
                            <li className="">
                                <button
                                    onClick={() => {
                                        setActiveTab(ACTIVE_TABS.MEMBER);
                                    }}
                                    className={classNames((activeTab === ACTIVE_TABS.MEMBER) ? 'text-main border-main rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300', 'inline-block p-4 border-b-2 rounded-t-lg')}
                                >
                                    សមាជិក
                                </button>
                            </li>
                            <li className="">
                                <button
                                    onClick={() => {
                                        setActiveTab(ACTIVE_TABS.PAYMENT);
                                    }}
                                    className={classNames((activeTab === ACTIVE_TABS.PAYMENT) ? 'text-main border-main rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300', 'inline-block p-4 border-b-2 rounded-t-lg')}
                                >
                                    វិធីសាស្រ្តទូទាត់
                                </button>
                            </li>
                        </ul>
                    </div>
                    {activeTab === ACTIVE_TABS.MEMBER && <>
                        <div className="mt-4 dark:bg-gray-800 dark:border-gray-700">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="w-4/12 px-6 py-3 rounded-l-lg">
                                        ឈ្មោះ
                                    </th>
                                    <th scope="col" className="w-4/12 px-6 py-3">
                                        លេខទូរស័ព្ទ
                                    </th>
                                    <th scope="col" className="w-2/12 px-6 py-3">
                                        តួនាទី
                                    </th>
                                    {/*<th scope="col" className="text-center w-2/12 px-6 py-3 rounded-r-lg">*/}
                                    {/*    សកម្មភាព*/}
                                    {/*</th>*/}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {isLoadingMembers
                                    ? null
                                    : members.map(member => (
                                        <tr className="h-14 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row"
                                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <img className="w-10 h-10 rounded-md object-cover"
                                                     src={
                                                         member.img_url || 'https://ui-avatars.com/api/?name=' + member.name + '&background=random&color=fff'
                                                     } alt={member.name}/>
                                                <div className="pl-3">
                                                    <div className="text-base font-semibold">{member.name}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                {member.phone}
                                            </td>
                                            <td className="px-6 py-4">
                                                {member.role === "admin" ? (
                                                    "ម្ចាស់ហាង"
                                                ) : member.role === "manager" ? (
                                                    "អ្នកគ្រប់គ្រង"
                                                ) : member.role === "sale" ? (
                                                    "អ្នកលក់"
                                                ) : (
                                                    "សមាជិក"
                                                )}
                                            </td>
                                            {/*<td className="px-6 py-4">*/}

                                            {/*</td>*/}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {isLoadingMembers
                            ? <Loading/>
                            : members.length === 0
                                ? <Empty title="សមាជិក"/>
                                : <div className="flex-1"></div>
                        }
                    </>}
                    {activeTab === ACTIVE_TABS.PAYMENT && <>
                        <div className="mt-4 dark:bg-gray-800 dark:border-gray-700">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="w-4/12 px-6 py-3 rounded-l-lg">
                                        វិធីសាស្រ្តទូទាត់
                                    </th>
                                    <th scope="col" className="w-4/12 px-6 py-3">
                                        ឈ្មោះគណនី
                                    </th>
                                    <th scope="col" className="w-2/12 px-6 py-3">
                                        លេខគណនី
                                    </th>
                                    <th scope="col" className="w-2/12 px-6 py-3 text-center">
                                        ស្ថានភាព
                                    </th>
                                    {/*<th scope="col" className="text-center w-2/12 px-6 py-3 rounded-r-lg">*/}
                                    {/*    សកម្មភាព*/}
                                    {/*</th>*/}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {isLoadingPayments
                                    ? null
                                    : payments.map(payment => (
                                        <tr className="h-14 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row"
                                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <img className="w-10 h-10 rounded-md object-cover"
                                                     src={
                                                         payment.img_url || 'https://ui-avatars.com/api/?name=' + payment.name + '&background=random&color=fff'
                                                     } alt={payment.name}/>
                                                <div className="pl-3">
                                                    <div
                                                        className="text-base font-semibold">{PAYMENT_METHODS[payment.payment_method]}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                {payment.account_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {payment.account_number}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {STATUS[payment.status]}
                                            </td>
                                            {/*<td className="px-6 py-4">*/}

                                            {/*</td>*/}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {isLoadingPayments
                            ? <Loading/>
                            : null
                        }
                    </>}
                </>}
        </div>
    )
}