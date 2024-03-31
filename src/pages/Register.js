import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const LOGIN_URL = '/register'

export default function Register() {
    const {login} = useAuth();

    const nameRef = useRef();
    const firstCodeRef = useRef();
    const errRef = useRef();

    const [isValidate, setIsValidate] = useState({
        phone: false,
        password: false,
        password_confirmation: false,
        name: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [request, setRequest] = useState({
        phone: '',
        password: '',
        name: '',
        otp: ''
    });
    const [isSendOTP, setIsSendOTP] = useState(false);

    const handleChange = e => {
        const {name} = e.target;
        setRequest(prevData => {
            return {
                ...prevData,
                [name]: e.target.value
            }
        });
        setIsValidate(prevData => {
            return {
                ...prevData,
                [name]: false
            }
        });
        setErrMsg('');
    }

    const [expirationTime, setExpirationTime] = useState(300); // 300 seconds
    // Function to format seconds to (mm:ss) format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleSendOTP = async () => {
        if (request.phone.length === 0 &&
            request.password.length === 0 &&
            request.name.length === 0
        ) {
            setIsValidate(prevData => {
                return {
                    phone: true,
                    password: true,
                    password_confirmation: true,
                    name: true
                }
            });
            return false;
        } else if (request.phone.length === 0) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    phone: true
                }
            });
            return false;
        } else if (request.password.length === 0) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    password: true
                }
            });
            return false;
        } else if (request.password !== request.password_confirmation) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    password_confirmation: true
                }
            });
            return false;
        } else if (request.name.length === 0) {
            setIsValidate(prevData => {
                return {
                    ...prevData,
                    name: true
                }
            });
            return false;
        }

        setIsLoading(true);

        try {
            const res = await axios.post("/phone/verify", {
                phone: request.phone
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (res.data.status === 200) setIsSendOTP(true);
            else if (res.data.status === 422) {
                if (res.data.message === 'Invalid OTP') {
                    setIsValidate(prevData => {
                        return {
                            ...prevData,
                            otp: true
                        }

                    });
                } else setErrMsg(res.data.message);
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

    const handleFocusNextInput = e => {
        const target = e.target;
        const maxLength = parseInt(target.getAttribute('maxlength'));
        const currentLength = target.value.length;

        request.otp += target.value;

        if (currentLength >= maxLength) {
            const next = target.getAttribute('data-focus-input-next');
            if (next) {
                document.getElementById(next).focus();
            } else {
                target.blur();
                handleRegister();
            }
        }
    }

    const handleRegister = async () => {
        setIsLoading(true);

        try {
            const res = await axios.post(
                LOGIN_URL,
                {
                    phone: request.phone,
                    password: request.password,
                    name: request.name,
                    otp: request.otp
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            if (res.data.status === 201) login(res.data.data.token, res.data.data.user.role);
            else if (res.data.status === 422) {
                if (res.data.message === 'Invalid OTP') {
                    setIsValidate(prevData => {
                        return {
                            ...prevData,
                            otp: true
                        }

                    });
                } else setErrMsg(res.data.message);
            } else {
                setErrMsg(res.data.message);
            }
        } catch (err) {
            console.log(err);
            setErrMsg('មានបញ្ហាក្នុងការចូល សូមព្យាយាមម្តងទៀត');
        } finally {
            setIsLoading(false);
        }
    }

    // useEffect(() => {
    //     nameRef.current.focus();
    // }, [])
    //
    useEffect(() => {
        if (isSendOTP) {
            firstCodeRef.current.focus();
            // Start countdown timer
            const timer = setInterval(() => {
                setExpirationTime(prevTime => prevTime - 1);
            }, 1000);

            // Clear timer when component unmounts or when expirationTime reaches 0
            return () => clearInterval(timer);
        }
    }, [isSendOTP]);

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

                    {isSendOTP ? <form className="p-6 space-y-6 md:space-y-6 sm:p-8">
                            <h1 className="text-center">
                                បញ្ជាក់លេខកូដ OTP
                            </h1>
                            <div className="pt-2 flex justify-center space-x-2 rtl:space-x-reverse">
                                <div>
                                    <label htmlFor="code-1" className="sr-only">First code</label>
                                    <input
                                        ref={firstCodeRef}
                                        onChange={handleFocusNextInput}
                                        type="text" maxLength="1" data-focus-input-next="code-2"
                                        id="code-1"
                                        className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        required/>
                                </div>
                                <div>
                                    <label htmlFor="code-2" className="sr-only">Second code</label>
                                    <input
                                        onChange={handleFocusNextInput}
                                        type="text" maxLength="1" data-focus-input-prev="code-1"
                                        data-focus-input-next="code-3" id="code-2"
                                        className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        required/>
                                </div>
                                <div>
                                    <label htmlFor="code-3" className="sr-only">Third code</label>
                                    <input
                                        onChange={handleFocusNextInput}
                                        type="text" maxLength="1" data-focus-input-prev="code-2"
                                        data-focus-input-next="code-4" id="code-3"
                                        className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        required/>
                                </div>
                                <div>
                                    <label htmlFor="code-4" className="sr-only">Fourth code</label>
                                    <input
                                        onChange={handleFocusNextInput}
                                        type="text" maxLength="1" data-focus-input-prev="code-3"
                                        data-focus-input-next="code-5" id="code-4"
                                        className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        required/>
                                </div>
                                <div>
                                    <label htmlFor="code-5" className="sr-only">Fifth code</label>
                                    <input
                                        onChange={handleFocusNextInput}
                                        type="text" maxLength="1" data-focus-input-prev="code-4"
                                        data-focus-input-next="code-6" id="code-5"
                                        className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        required/>
                                </div>
                                <div>
                                    <label htmlFor="code-6" className="sr-only">Sixth code</label>
                                    <input
                                        onChange={handleFocusNextInput}
                                        type="text" maxLength="1" data-focus-input-prev="code-5"
                                        id="code-6"
                                        className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        required/>
                                </div>
                            </div>
                            <p
                                id="helper-text-explanation"
                                className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                សូមបញ្ចូលលេខកូដ៦ខ្ទង់ដែលបានផ្ញើទៅកាន់លេខទូរស័ព្ទរបស់អ្នក។
                            </p>
                            <p className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                លេខកូដនឹងផុតកំណត់ក្នុងរយៈពេល {formatTime(expirationTime)}នាទី
                            </p>
                        </form> :
                        <form className="p-6 space-y-6 md:space-y-6 sm:p-8">
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
                                            ref={nameRef}
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
                                            ref={nameRef}
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
                                            onChange={handleChange}

                                            className="input w-full"
                                        />
                                    </div>
                                </div>}
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
                            {isValidate.password_confirmation
                                ? <div>
                                    <label htmlFor="password_confirmation" className="label-error">
                                        បញ្ជាក់ពាក្យសំងាត់
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            autoComplete="password"
                                            onChange={handleChange}

                                            className="input-error w-full"
                                            placeholder="សូមបញ្ចូលពាក្យសម្ងាត់"
                                        />
                                    </div>
                                </div>
                                : <div>
                                    <label htmlFor="password_confirmation" className="dark:text-white">
                                        បញ្ជាក់ពាក្យសំងាត់
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
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
                                        onClick={handleSendOTP}
                                        type="button"
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
                        </form>}
                </div>
            </div>
        </>
    )
}
