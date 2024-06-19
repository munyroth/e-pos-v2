import {useParams} from "react-router";
import useGetDataObject from "hooks/useGetDataObject";
import React, {useState} from "react";
import Loading from "components/loading";
import PaymentMethods from "./paymentMethods";
import Members from "./members";
import {Toaster} from "react-hot-toast";

export default function BranchDetail() {
    const ACTIVE_TABS = {
        MEMBER: 'member',
        PAYMENT: 'payment',
    }

    const {id} = useParams();

    const url = '/shop/' + id;
    const [branch, isLoading] = useGetDataObject(url);

    const [activeTab, setActiveTab] = useState(ACTIVE_TABS.MEMBER);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <>
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
                        {activeTab === ACTIVE_TABS.MEMBER && <Members
                            shopId={id}
                        />}
                        {activeTab === ACTIVE_TABS.PAYMENT && <PaymentMethods
                            shopId={id}
                        />}
                    </>}
            </div>
            <Toaster/>
        </>
    )
}