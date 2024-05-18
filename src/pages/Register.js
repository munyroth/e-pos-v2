import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import BaseForm from "../components/form";
import Input from "../components/form/Input";

const REGISTER_URL = '/register'

export default function Register() {
    const {register} = useAuth();

    const firstCodeRef = useRef();
    const errRef = useRef();

    const [isShowPassword, setsShowPassword] = useState(false);

    const [isValidate, setIsValidate] = useState({
        phone: false,
        password: false,
        password_confirmation: false,
        name: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [invalidOTP, setInvalidOTP] = useState(false);
    const [request, setRequest] = useState({
        phone: '',
        password: '',
        name: ''
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
            if (res.data.status === 200) {
                setIsSendOTP(true);

                // Start the countdown timer
                setExpirationTime(300);

                firstCodeRef.current.focus();
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

        if (currentLength === maxLength) {
            const next = target.getAttribute('data-focus-input-next');
            const nextElement = document.getElementById(next);
            if (nextElement) {
                nextElement.focus();
            } else {
                target.blur();
                handleRegister();
            }
        } else if (currentLength > maxLength) {
            target.value = target.value.slice(0, maxLength);
        }

        setInvalidOTP(false)
    }

    const handleKeyDown = e => {
        const target = e.target;
        const currentLength = target.value.length;

        if (e.key === 'Backspace') {
            if (currentLength === 0) {
                const prev = target.getAttribute('data-focus-input-prev');
                const prevElement = document.getElementById(prev);
                if (prevElement) {
                    prevElement.focus();
                }
            }
        }
    };

    const handleRegister = async () => {
        setIsLoading(true);

        let otp = '';
        for (let i = 1; i <= 6; i++) {
            const code = document.getElementById(`code-${i}`).value;
            otp += code;
        }

        try {
            const res = await axios.post(
                REGISTER_URL,
                {
                    phone: request.phone,
                    password: request.password,
                    name: request.name,
                    otp: otp
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            if (res.data.status === 201) register(res.data.data.token, res.data.data.refresh_token);
            else if (res.data.status === 422) {
                if (res.data.message === 'Invalid OTP') {
                    setInvalidOTP(true);
                }
            } else {
                console.log(res.data.message);
            }
        } catch (err) {
            setErrMsg('មានបញ្ហាក្នុងការចូល សូមព្យាយាមម្តងទៀត');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isSendOTP && firstCodeRef.current) {
            firstCodeRef.current.focus();
        }
    }, [isSendOTP])

    useEffect(() => {
        if (isSendOTP && firstCodeRef.current) {
            let timer = null;
            // Start countdown timer
            if (expirationTime > 0) {
                timer = setInterval(() => {
                    setExpirationTime(prevTime => prevTime - 1);
                }, 1000);
            }

            // Clear timer when component unmounts or when expirationTime reaches 0
            return () => clearInterval(timer);
        }
    }, [isSendOTP, firstCodeRef, expirationTime]);

    return (
        <BaseForm>
            {isSendOTP ? <form className="p-6 space-y-6 md:space-y-6 sm:p-8">
                    <h1 className="text-center">
                        បញ្ជាក់លេខកូដ OTP
                    </h1>
                    <p
                        id="helper-text-explanation"
                        className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        សូមបញ្ចូលលេខកូដ៦ខ្ទង់ដែលបានផ្ញើទៅកាន់លេខទូរស័ព្ទរបស់អ្នក។
                    </p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                        {[...Array(6)].map((_, index) => (
                            <div key={`code-${index + 1}`}>
                                <label htmlFor={`code-${index + 1}`} className="sr-only">{`Code ${index + 1}`}</label>
                                <input
                                    ref={index === 0 ? firstCodeRef : null}
                                    onChange={handleFocusNextInput}
                                    onKeyDown={handleKeyDown}
                                    type="text"
                                    maxLength="1"
                                    data-focus-input-prev={`code-${index}`}
                                    data-focus-input-next={`code-${index + 2}`}
                                    id={`code-${index + 1}`}
                                    className={invalidOTP ? "input-error w-10 text-center" : "input w-10 text-center"}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    {isLoading ?
                        <div className="flex items-center justify-center">
                            <svg aria-hidden="true"
                                 className="inline w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                        </div> :
                        (expirationTime > 0) ? (
                            <p className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                លេខកូដនឹងផុតកំណត់ក្នុងរយៈពេល {formatTime(expirationTime)}នាទី
                            </p>
                        ) : (
                            <p className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                មិនបានទទួលលេខកូដរបស់អ្នកទេ? <button
                                onClick={handleSendOTP}
                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                            >ផ្ញើម្តងទៀត</button>
                            </p>
                        )}

                </form> :
                <form className="p-6 space-y-6 md:space-y-6 sm:p-8">
                    <h1 className="text-center">
                        ចុះឈ្មោះគណនី
                    </h1>
                    <Input
                        title="ឈ្មោះ"
                        id="name"
                        type="text"
                        autoComplete="name"
                        onChange={handleChange}
                        isFocus={true}
                        isValidate={isValidate.name}
                    />
                    <Input
                        title="លេខទូរស័ព្ទ"
                        id="phone"
                        type="text"
                        autoComplete="phone"
                        onChange={handleChange}
                        isValidate={isValidate.phone}
                    />
                    <Input
                        title="ពាក្យសំងាត់"
                        id="password"
                        type="password"
                        onChange={handleChange}
                        isValidate={isValidate.password}
                        isShowPassword={isShowPassword}
                        setShowPassword={setsShowPassword}
                    />
                    <Input
                        title="បញ្ជាក់ពាក្យសំងាត់"
                        id="password_confirmation"
                        type="password"
                        onChange={handleChange}
                        isValidate={isValidate.password_confirmation}
                        isShowPassword={isShowPassword}
                        setShowPassword={setsShowPassword}
                    />
                    <p
                        ref={errRef}
                        className={errMsg ? "text-sm font-medium leading-6 text-red-600" : "hidden"}
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
                            ខ្ញុំបានអាន និងយល់ព្រមចំពោះ <Link
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500" to="#">
                            កិច្ចព្រមព្រៀងអ្នកប្រើប្រាស់
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
        </BaseForm>
    )
}
