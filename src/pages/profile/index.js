import useGetDataObject from "../../hooks/useGetDataObject";
import Loading from "../../components/loading";
import Input from "../../components/form/Input";
import {useEffect, useState} from "react";
import handleChange from "../../features/handleChange";

const USER_API_URL = '/user';

export default function Profile() {
    const [user, isLoading] = useGetDataObject(USER_API_URL);
    const {
        img_url,
        name,
        role,
        orders_sum_total,
        orders_count,
        phone
    } = user || {};

    const [data, setData] = useState({
        phone: '',
        name: '',
        old_password: '',
        password: ''
    });

    const [isValidate, setIsValidate] = useState({
        phone: false,
        name: false,
        password: false
    });

    const handleChangeProfile = e => {
        handleChange(
            e,
            setData,
            setIsValidate
        )
    }

    const [isDisabled, setIsDisabled] = useState(true);

    const [isSetData, setIsSetData] = useState(false);

    useEffect(() => {
        if (data.phone !== phone || data.name !== name) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }

        if (phone && name && !isSetData) {
            setData({
                ...data,
                phone: phone,
                name: name || ''
            });
            setIsSetData(true);
        }
    }, [phone, name, data, isSetData]);

    return (
        <div className="p-4 grid place-items-center space-y-4 h-full">
            {isLoading ? (
                <Loading/>
            ) : (
                <>
                    {/* Basic Profile */}
                    <div className="text-center space-y-2">
                        <div className="relative w-32 h-32">
                            <img className="w-full h-full rounded-full"
                                 src={img_url || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`}
                                 alt="profile"/>
                            <div className="absolute bottom-0 right-0">
                                <label htmlFor="file"
                                       className="cursor-pointer bg-gray-500 text-white rounded-full p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                                    </svg>
                                </label>
                                <input type="file" id="file" className="hidden"/>
                            </div>

                        </div>
                        <h2 className="text-2xl font-semibold">{name}</h2>
                        <div className="text-gray-600 dark:text-gray-400">
                            {role === "admin" ? "ម្ចាស់ហាង" :
                                role === "manager" ? "អ្នកគ្រប់គ្រង" :
                                    role === "sale" ? "អ្នកលក់" : "សមាជិក"}
                        </div>
                    </div>

                    {/* Total income and order */}
                    <div className="flex space-x-4 dark:text-white w-1/2 justify-center items-center">
                        <div className="w-1/4 flex flex-col items-center space-y-1">
                            <div className="text-2xl font-semibold">${orders_sum_total}</div>
                            <div className="text-gray-600 dark:text-gray-400">ចំណូល</div>
                        </div>
                        <div className="border-r h-16 border-gray-300 dark:border-gray-700"></div>
                        <div className="w-1/4 flex flex-col items-center space-y-1">
                            <div className="text-2xl font-semibold">{orders_count}</div>
                            <div className="text-gray-600 dark:text-gray-400">ការបញ្ជាទិញ</div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b w-1/2 border-gray-300 dark:border-gray-700"></div>

                    {/* Profile Detail */}
                    <div className="flex space-x-8">
                        <Input
                            title="ឈ្មោះ"
                            id="name"
                            value={data.name}
                            isValidate={isValidate.name}
                            onChange={handleChangeProfile}
                            disabled={false}
                        />
                        <Input
                            title="លេខទូរស័ព្ទ"
                            id="phone"
                            value={data.phone}
                            isValidate={isValidate.phone}
                            onChange={handleChangeProfile}
                            disabled={false}
                        />
                    </div>

                    {/* Change Password */}
                    <div className="flex space-x-8">
                        <Input
                            title="ពាក្យសំងាត់ចាស់"
                            label="old_password"
                            onChange={handleChangeProfile}
                            type="password"
                        />
                        <Input
                            title="ពាក្យសំងាត់ថ្មី"
                            label="password"
                            onChange={handleChangeProfile}
                            type="password"
                        />
                    </div>

                    {/* Fill */}
                    <div className="w-1/2"></div>

                    {/* Save Button */}
                    <button type="button"
                            className={isDisabled ? "button-disabled w-1/4" : "button w-1/4"}
                    >រក្សាទុក
                    </button>
                </>
            )}
        </div>
    )
}
