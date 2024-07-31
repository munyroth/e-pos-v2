import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function AddStore() {

    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const errRef = useRef();

    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({
        image: null,
        name_km: "",
        address_km: ""
    });
    const [errMsg, setErrMsg] = useState('');

    const [isImage, setIsImage] = useState(false);
    const [imageURL, setImageURL] = useState("");

    const handleChange = e => {
        const {name, value, type, files} = e.target;
        setData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "file" ? files[0] : value
            }
        });

        if (files?.[0]) {
            setImageURL(URL.createObjectURL(e.target.files[0]));
            setIsImage(true);
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("logo", data.image);
        formData.append("name_km", data.name_km);
        formData.append("address_km", data.address_km);

        let isMounted = true;
        const controller = new AbortController();

        try {
            const res = await axiosPrivate.post('/stores', formData, {
                signal: controller.signal
            });
            Cookies.set('storeId', res.data.data.id, { expires: 15 });
            Cookies.set('branchIndex', 0, { expires: 15 });
            isMounted && navigate(location.state?.path || "/admin/items", { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('មានបញ្ហាក្នុងការបញ្ចូល សូមព្យាយាមម្តងទៀត');
            } else if (err.response?.status === 422) {
                setErrMsg('សូមបញ្ចុលរូបភាព ឈ្មោះហាង និងទីតាំងហាង');
            } else {
                setErrMsg('មានបញ្ហាក្នុងការបញ្ចូល សូមព្យាយាមម្តងទៀត');
            }
            errRef.current.focus();
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setErrMsg('');
    }, [data])

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        បន្ថែមហាង
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                រូបភាព
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <div className="w-full h-64">
                                    <label htmlFor="image"
                                           className="flex items-center justify-center w-full h-full">
                                        {isImage ? (
                                            <img src={imageURL} alt="image" className="h-full rounded-lg"/>
                                        ) : (
                                            <div

                                                className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or
                                                    drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    JPG or PNG (MAX. 800x400px)
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            className="hidden" accept=".png, .jpg, .jpeg"
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                ឈ្មោះហាង
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name_km"
                                    name="name_km"
                                    type="text"
                                    autoComplete="false"
                                    value={data.name_km}
                                    onChange={handleChange}
                                    required

                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    អាសយដ្ឋាន
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="address_km"
                                    name="address_km"
                                    type="text"
                                    autoComplete="false"
                                    value={data.address_km}
                                    onChange={handleChange}
                                    required

                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <p
                            ref={errRef}
                            className={errMsg ? "text-sm font-medium leading-6 text-red-900" : "hidden"}
                            aria-live="assertive"
                        >
                            {errMsg}
                        </p>

                        <div>
                            {isLoading
                                ? <button disabled type="button"
                                          className="w-full inline-flex items-center justify-center rounded-md bg-main px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm dark:bg-main"
                                >
                                    <svg aria-hidden="true" role="status"
                                         className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101"
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
                                    className="flex w-full justify-center rounded-md bg-main px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 active:ring-4 active:outline-none active:ring-green-300"
                                >
                                    បន្ថែមហាង
                                </button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}