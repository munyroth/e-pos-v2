import Input from "components/form/Input";
import React, {useEffect, useState} from "react";
import useGetDataObject from "hooks/useGetDataObject";
import handleChange from "features/handleChange";

const USER_API_URL = '/user';

export default function Security() {
    const [user] = useGetDataObject(USER_API_URL);
    const {
        name,
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
        <>
            <div className="text-center text-xl font-bold py-4 dark:text-white">
                កែប្រែពាក្យសំងាត់
            </div>
            <div className="flex space-x-8 justify-center">
                <Input
                    title="ពាក្យសំងាត់ចាស់"
                    label="old_password"
                    onChange={handleChangeProfile}
                    type="password"
                    isValidate={isValidate.password}
                />
            </div>
            <div className="flex space-x-8 justify-center">
                <Input
                    title="ពាក្យសំងាត់ថ្មី"
                    label="password"
                    onChange={handleChangeProfile}
                    type="password"
                />
            </div>
            <div className="flex space-x-8 justify-center">
                <Input
                    title="បញ្ជាក់ពាក្យសំងាត់ថ្មី"
                    label="password_confirmation"
                    onChange={handleChangeProfile}
                    type="password"
                />
            </div>

            <div className="flex justify-center">
                <button type="button"
                        className={isDisabled ? "absolute bottom-4 button-disabled cursor-default w-1/4" : "absolute bottom-4 button w-1/4"}
                >រក្សាទុក
                </button>
            </div>
        </>
    )
}