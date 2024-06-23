import Input from "components/form/Input";
import React, {useEffect, useState} from "react";
import handleChange from "features/handleChange";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import {useOutletContext} from "react-router-dom";
import handleValidation from "features/validation/validation";
import toast from "react-hot-toast";

export default function Information() {
    const axiosPrivate = useAxiosPrivate();
    const [user, setUser] = useOutletContext();
    const {
        img_url,
        name,
        phone
    } = user || {};

    const [data, setData] = useState({
        name: '',
        phone: '',
        image: null
    });

    const [isValidate, setIsValidate] = useState({
        name: false,
        phone: false,
        image: false
    });

    const [isImage, setIsImage] = useState(false);
    const [imageURL, setImageURL] = useState("");

    const [isLoadingSave, setIsLoadingSave] = useState(false);

    const handleInputChange = e => {
        handleChange(
            e,
            setData,
            setIsValidate,
            setIsImage,
            setImageURL,
        )
    }

    const handleSave = async () => {
        if (!handleValidation(
            ['name', 'phone'],
            data,
            setIsValidate
        )) return;

        setIsLoadingSave(true);

        try {
            let formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('name', data.name);
            formData.append('phone', data.phone);
            data.image
                ? formData.append('file', data.image)
                : formData.append('file', 'keep');

            const res = await axiosPrivate.post('/user/me', formData);
            if (res.data.status === 200) {
                setUser(res.data.data);
                setData(prevState => {
                        return {
                            ...prevState,
                            image: null
                        }
                    }
                )
                setIsImage(false);
                toast.success('បានកែប្រែព័ត៌មានបានជោគជ័យ');
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            console.error(e);
        }

        setIsLoadingSave(false);
    }

    const [isDisabled, setIsDisabled] = useState(true);

    const [isSetData, setIsSetData] = useState(false);

    useEffect(() => {
        if (data.phone !== phone || data.name !== name || isImage) {
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
    }, [phone, name, data, isSetData, isImage]);

    return (
        <>
            <div className="text-center text-xl font-bold py-4 dark:text-white">
                កែប្រែព័ត៌មានផ្ទាល់ខ្លួន
            </div>
            <div className="relative w-32 h-32 mx-auto">
                <img className="w-full h-full rounded-full object-contain"
                     src={isImage
                         ? imageURL
                         : img_url || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`}
                     alt="profile"/>
                <div className="absolute bottom-0 right-0">
                    <label htmlFor="image"
                           className="bg-gray-500 cursor-pointer text-white rounded-full p-1">
                        <svg className="w-6 h-6 text-gray-100" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                             viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
                        </svg>
                    </label>
                    <input
                        onChange={handleInputChange}
                        type="file"
                        id="image"
                        name="image"
                        className="hidden"
                    />
                </div>
            </div>
            <div className="lg:w-72 md:w-64 sm:w-44 mx-auto">
                <Input
                    title="ឈ្មោះ"
                    id="name"
                    value={data.name}
                    isValidate={isValidate.name}
                    onChange={handleInputChange}
                />
            </div>
            <div className="lg:w-72 md:w-64 sm:w-44 mx-auto">
                <Input
                    title="លេខទូរស័ព្ទ"
                    id="phone"
                    value={data.phone}
                    isValidate={isValidate.phone}
                    onChange={handleInputChange}
                />
            </div>

            <div className="lg:w-72 md:w-64 sm:w-44 mx-auto">
                <button
                    disabled={isDisabled || isLoadingSave}
                    onClick={handleSave}
                    type="button"
                    className={isDisabled
                        ? "absolute bottom-4 button-disabled lg:w-72 md:w-64 sm:w-44"
                        : isLoadingSave
                            ? "absolute bottom-4 button-loading lg:w-72 md:w-64 sm:w-44"
                            : "absolute bottom-4 button lg:w-72 md:w-64 sm:w-44"}
                >{isLoadingSave ? (
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
                        កំពុងរក្សាទុក...
                    </>
                ) : ('រក្សាទុក')}
                </button>
            </div>
        </>
    )
}