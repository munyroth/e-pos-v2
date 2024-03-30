import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const LOGIN_URL = '/register'

export default function Register() {
    const {login} = useAuth();

    const userRef = useRef();
    const errRef = useRef();

    const [isValidate, setIsValidate] = useState({
        phone: false,
        password: false,
        name: false,
        otp: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleChange = e => {
        const {name} = e.target;
        setIsValidate(prevData => {
            return {
                ...prevData,
                [name]: false
            }
        });
        setErrMsg('');
    }

    const handleRegister = async e => {
        e.preventDefault();
        const {phone, password, name, otp} = e.target;
        if (phone.value.length === 0 &&
            password.value.length === 0 &&
            name.value.length === 0 &&
            otp.value.length === 0
        ) {
            setIsValidate(prevData => {
                return {
                    phone: true,
                    password: true,
                    name: true,
                    otp: true
                }
            });
            return false;
        } else if (phone.value.length === 0) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    phone: true
                }
            });
            return false;
        } else if (password.value.length === 0) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    password: true
                }
            });
            return false;
        } else if (name.value.length === 0) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    name: true
                }
            });
            return false;
        } else if (otp.value.length === 0) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    otp: true
                }
            });
            return false;
        }

        setIsLoading(true);

        const data = {
            phone: phone.value,
            password: password.value,
            name: name.value,
            otp: otp.value
        }

        try {
            const res = await axios.post(LOGIN_URL, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (res.data.status === 200) login(res.data.data.token, "Admin", "Admin");
            else if (res.data.status === 422) {
                setErrMsg(res.data.message);
            } else {
                setErrMsg(res.data.message);
            }
        } catch (err) {
            setErrMsg('មានបញ្ហាក្នុងការចូល សូមព្យាយាមម្តងទៀត');
            errRef.current.focus();
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        userRef.current.focus();
    }, [])

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-16 w-auto"
                        src="https://res.cloudinary.com/dlb5onqd6/image/upload/v1673491430/data/logo_ioru7h.png"
                        alt="ePOS"
                    />
                </div>

                <div
                    className="mt-10 w-full bg-white rounded-lg shadow dark:border sm:mx-auto sm:w-full sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <form className="p-6 space-y-6 md:space-y-6 sm:p-8" onSubmit={handleRegister}>
                        <h1 className="text-center">
                            ចុះឈ្មោះគណនី
                        </h1>
                        {isValidate.name
                            ? <div>
                                <label htmlFor="name" className="label-error">
                                    ឈ្មោះ
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        ref={userRef}
                                        onChange={handleChange}

                                        className="input-error w-full"
                                        placeholder="សូមបញ្ចូលឈ្មោះ"
                                    />
                                </div>
                            </div>
                            : <div>
                                <label htmlFor="name" className="dark:text-white">
                                    ឈ្មោះ
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        ref={userRef}
                                        onChange={handleChange}

                                        className="input w-full"
                                    />
                                </div>
                            </div>}
                        {isValidate.phone
                            ? <div>
                                <label htmlFor="phone" className="label-error">
                                    លេខទូរស័ព្ទ
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        autoComplete="email"
                                        ref={userRef}
                                        onChange={handleChange}

                                        className="input-error w-full"
                                        placeholder="សូមបញ្ចូលលេខទូរស័ព្ទ"
                                    />
                                </div>
                            </div>
                            : <div>
                                <label htmlFor="phone" className="dark:text-white">
                                    លេខទូរស័ព្ទ
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        autoComplete="email"
                                        ref={userRef}
                                        onChange={handleChange}

                                        className="input w-full"
                                    />
                                </div>
                            </div>}
                        {isValidate.otp
                            ? <div>
                                <label htmlFor="otp" className="label-error">
                                    លេខ OTP
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        autoComplete="otp"
                                        onChange={handleChange}

                                        className="input-error w-full"
                                        placeholder="សូមបញ្ចូលលេខ OTP"
                                    />
                                </div>
                            </div>
                            : <div>
                                <label htmlFor="otp" className="dark:text-white">
                                    លេខ OTP
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        autoComplete="otp"
                                        onChange={handleChange}

                                        className="input w-full"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-1 right-4 rounded-2xl font-medium text-blue-600 hover:underline dark:text-blue-500">
                                        ផ្ញើ OTP
                                    </button>
                                </div>
                            </div>
                        }
                        {isValidate.password
                            ? <div>
                                <label htmlFor="password" className="label-error">
                                    បង្កើតពាក្យសំងាត់
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="password"
                                        onChange={handleChange}

                                        className="input-error w-full"
                                        placeholder="សូមបញ្ចូលពាក្យសម្ងាត់"
                                    />
                                </div>
                            </div>
                            : <div>
                                <label htmlFor="password" className="dark:text-white">
                                    បង្កើតពាក្យសំងាត់
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="password"
                                        onChange={handleChange}

                                        className="input w-full"
                                    />
                                </div>
                            </div>}
                        <p
                            ref={errRef}
                            className={errMsg ? "text-sm font-medium leading-6 text-red-900" : "hidden"}
                            aria-live="assertive"
                        >
                            {errMsg}
                        </p>
                        <div className="flex items-center">
                            <input id="terms" aria-describedby="terms" type="checkbox"
                                   className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                   required=""/>
                            <label htmlFor="terms"
                                   className="text-gray-500 dark:text-gray-300 ms-2 text-sm">
                                I accept the <Link
                                className="font-medium text-blue-600 hover:underline dark:text-blue-500" to="#">
                                Terms and Conditions
                            </Link>
                            </label>
                        </div>
                        <div>
                            {isLoading
                                ? <button
                                    disabled
                                    type="button"
                                    className="button-loading w-full"
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
                                    className="button w-full"
                                >
                                    ចុះឈ្មោះ
                                </button>
                            }
                        </div>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            មានគណនី?
                            <Link
                                to="/login"
                                className="ml-2 font-medium text-blue-600 hover:underline dark:text-blue-500">
                                ចូល
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
