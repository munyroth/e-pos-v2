import BaseForm from "components/form";
import Input from "components/form/Input";
import {useState} from "react";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import toast, {Toaster} from "react-hot-toast";
import handleChange from "features/handleChange";
import handleValidation from "features/validation/validation";
import useAuth from "hooks/useAuth";

export default function ForgotPassword() {
    const {login} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);

    const [isValidate, setIsValidate] = useState({
        phone: false,
        otp: false,
        password: false,
        password_confirmation: false
    });
    const [data, setData] = useState({
        phone: '',
        otp: '',
        password: '',
        password_confirmation: ''
    });

    const [isSendOTP, setIsSendOTP] = useState(false);
    const [isShowPassword, setsShowPassword] = useState(false);

    const handleInputChange = e => {
        handleChange(
            e,
            setData,
            setIsValidate
        )
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!handleValidation(
            ['phone'],
            data,
            setIsValidate
        )) return;
        setIsLoading(true);

        try {
            const res = await axiosPrivate.post('/password/forgot', data);
            if (res.data.status === 200) {
                toast.success(res.data.data.otp);
                setIsSendOTP(true);
            } else if (res.data.status === 404) {
                toast.error('រកមិនឃើញគណនីរបស់អ្នក');
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!handleValidation(
            ['otp', 'password', 'password_confirmation'],
            data,
            setIsValidate
        )) return;

        setIsLoading(true);
        if (data.password !== data.password_confirmation) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    password_confirmation: true
                }
            });
            return false;
        }

        try {
            const res = await axiosPrivate.post('/password/reset', data);
            if (res.data.status === 200) {
                login(res.data.data.token, res.data.data.refresh_token, res.data.data.user, true);
            } else if (res.data.status === 404) {
                toast.error('រកមិនឃើញគណនីរបស់អ្នក');
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    }

    return (
        <>
            <BaseForm>
                {!isSendOTP
                    ? <form className="p-6 space-y-6 md:space-y-6 sm:p-8" onSubmit={handleForgotPassword}>
                        <h1 className="text-center">
                            រកមើលគណនីរបស់អ្នក
                        </h1>
                        <Input
                            type="text"
                            id="phone"
                            title="លេខទូរស័ព្ទ"
                            onChange={handleInputChange}
                            autoComplete="phone"
                            value={data.phone}
                            isFocus={true}
                            isValidate={isValidate.phone}
                            isRequire={true}
                        />
                        <div className="flex space-x-8">
                            <button
                                className="inline-flex items-center justify-center py-2 px-4 text-base text-white font-semibold leading-6 rounded-lg bg-gray-600 shadow-sm hover:bg-gray-700 active:bg-gray-700 active:scale-98 w-1/2"
                                type="button"
                                onClick={() => window.history.back()}
                            >
                                បោះបង់
                            </button>
                            {isLoading
                                ? <button
                                    disabled
                                    type="button"
                                    className="button-loading w-1/2"
                                >
                                    <svg aria-hidden="true" role="status"
                                         className="inline w-4 h-4 mr-3 text-white animate-spin"
                                         viewBox="0 0 100 101"
                                         fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="#E5E7EB"/>
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentColor"/>
                                    </svg>
                                    កំពុងផ្ទុក...
                                </button>
                                : <button
                                    type="submit"
                                    className="button w-1/2"
                                >
                                    ស្វែងរក
                                </button>
                            }
                        </div>
                    </form>
                    : <form className="p-6 space-y-6 md:space-y-6 sm:p-8" onSubmit={handleResetPassword}>
                        <h1 className="text-center">
                            កំណត់ពាក្យសំងាត់ថ្មី
                        </h1>
                        <Input
                            title="លេខកូដOTP"
                            id="otp"
                            type="text"
                            onChange={handleInputChange}
                            value={data.otp}
                            isFocus={true}
                            isValidate={isValidate.otp}
                            isRequire={true}
                        />
                        <Input
                            title="ពាក្យសំងាត់ថ្មី"
                            id="password"
                            type="password"
                            onChange={handleInputChange}
                            value={data.password}
                            isValidate={isValidate.password}
                            isShowPassword={isShowPassword}
                            setShowPassword={setsShowPassword}
                            isRequire={true}
                        />
                        <Input
                            title="បញ្ជាក់ពាក្យសំងាត់"
                            id="password_confirmation"
                            type="password"
                            onChange={handleInputChange}
                            value={data.password_confirmation}
                            isValidate={isValidate.password_confirmation}
                            isShowPassword={isShowPassword}
                            setShowPassword={setsShowPassword}
                            isRequire={true}
                        />
                        <div className="flex space-x-8">
                            <button
                                className="inline-flex items-center justify-center py-2 px-4 text-base text-white font-semibold leading-6 rounded-lg bg-gray-600 shadow-sm hover:bg-gray-700 active:bg-gray-700 active:scale-98 w-1/2"
                                type="button"
                                onClick={() => window.history.back()}
                            >
                                បោះបង់
                            </button>
                            {isLoading
                                ? <button
                                    disabled
                                    type="button"
                                    className="button-loading w-1/2"
                                >
                                    <svg aria-hidden="true" role="status"
                                         className="inline w-4 h-4 mr-3 text-white animate-spin"
                                         viewBox="0 0 100 101"
                                         fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="#E5E7EB"/>
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentColor"/>
                                    </svg>
                                    កំពុងផ្ទុក...
                                </button>
                                : <button
                                    type="submit"
                                    className="button w-1/2"
                                >
                                    កំណត់ឡើងវិញ
                                </button>
                            }
                        </div>
                    </form>
                }
            </BaseForm>
            <Toaster/>
        </>
    )
}