import {Fragment, useEffect, useRef, useState} from 'react';
import {ExclamationTriangleIcon, PlusCircleIcon} from '@heroicons/react/24/outline';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";
import toast, {Toaster} from "react-hot-toast";
import BaseDialog from "../../../components/dialog";
import search from "../../../functions/search";

export default function Items() {
    let url = '/product';
    const axiosPrivate = useAxiosPrivate();

    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const cancelModalAddItemRef = useRef(null);

    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [data, setData] = useState({
        category_id: 1,
        barcode: "",
        name: "",
        price: "",
        file: null
    });

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);

    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState({});
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const handleChangeAdd = e => {
        const {name, value, type, files} = e.target;
        setData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "file" ? files[0] : value
            }
        });

        if (files && files[0]) {
            setImageURL(URL.createObjectURL(e.target.files[0]));
            setIsImage(true);
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoadingAdd(true);

        const formData = new FormData();
        formData.append('category_id', data.category_id);
        formData.append('barcode', data.barcode);
        formData.append('name_en', data.name);
        formData.append('name_kh', data.name);
        formData.append('price', data.price);
        data.file && formData.append('file', data.file);

        const controller = new AbortController();

        const addProduct = async () => {
            try {
                const response = await axiosPrivate.post(url, formData, {
                    signal: controller.signal
                });

                if (response.data.status === 201) {
                    // Update state after successful request
                    const newData = {
                        category_id: 1,
                        barcode: "",
                        name: "",
                        price: "",
                        file: null
                    };
                    setOpenModalAddItem(false);
                    setData(newData);
                    setImageURL("");
                    setIsImage(false);
                    isEmpty && setIsEmpty(false);

                    toast.success('បានបញ្ចូលទំនិញជោគជ័យ');
                } else toast.error(response.data.message);

                return response;
            } catch (error) {
                // Handle errors
                console.error('Error adding product:', error);
                toast.error('មានបញ្ហាក្នុងការបញ្ចូល');
                return Promise.reject(error);
            } finally {
                setIsLoadingAdd(false);
            }
        }

        addProduct()
            .then(() => {
                // Do something after successful addition
            })
            .catch(() => {
                // Do something in case of error
            });
    }

    const handleDelete = async id => {
        const controller = new AbortController();

        try {
            const res = await axiosPrivate.delete(url + '/' + id, {
                signal: controller.signal
            });
            setOpenModalDelete(false);
        } catch (err) {

        }
    }

    useEffect(() => {
        meta?.total === 0 ? setIsEmpty(true) : setIsEmpty(false);
    }, [meta]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getItems = async () => {
            const res = await axiosPrivate.get(url, {
                signal: controller.signal
            });
            isMounted && setItems(res.data.data);
            setMeta(res.data.meta);
            setIsLoading(false);
        }

        if (!openModalAddItem && !openModalDelete) {
            getItems().catch(() => console.log("fail"));
        }

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [axiosPrivate, openModalAddItem, openModalDelete]);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <h1 className="">ទំនិញ</h1>
                <button
                    onClick={() => {
                        setOpenModalAddItem(true);
                    }}
                    type="button"
                    className="rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-50 shadow-sm hover:bg-blue-600 active:ring-1 active:outline-none active:ring-blue-300"
                >
                    បន្ថែមទំនិញ
                </button>
                <label htmlFor="table-search" className="sr-only">ស្វែងរក</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <input
                        onChange={(e) => search(e, setContent, setIsLoading, setItems, setMeta, url)}
                        type="text"
                        id="table-search-users"
                        className="input w-80 pl-10"
                        placeholder="ស្វែងរក"/>
                </div>
            </div>
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-3/6 px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="w-1/6 px-6 py-3">
                            តម្លៃ
                        </th>
                        <th scope="col" className="w-1/6 px-6 py-3 rounded-r-lg">
                            សកម្មភាព
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading
                        ? null
                        : isEmpty
                            ? <tr className="dark:bg-gray-800 dark:border-gray-700 ">
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="w-10 h-10"></div>
                                    <div className="pl-3" role="status">
                                        <span className="">មិនមានទំនិញ</span>
                                    </div>
                                </th>
                            </tr>
                            : items.map(item => (
                                <tr className="border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="w-10 h-10"
                                             src={item.img_url} alt={item.name_kh}/>
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">{item.name_kh}</div>
                                            <div className="text-xs font-normal text-gray-500">{item.barcode}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="pl-3">
                                            <div className="text-base font-semibold text-main">${item.price}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="pl-1 font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            កែ
                                        </button>
                                        <button
                                            className="pl-3 font-medium text-red-600 dark:text-red-500 hover:underline"

                                            onClick={() => {
                                                setDeleteId(item.id);
                                                setOpenModalDelete(true);
                                            }}
                                        >
                                            លុប
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {isLoading && (
                <Loading/>
            )}
            <Pagination
                content={content}
                meta={meta}
                setMeta={setMeta}
                setItems={setItems}
                setLoader={setIsLoading}
                url={url}/>

            <BaseDialog
                openModal={openModalDelete}
                setOpenModal={setOpenModalDelete}
                cancelModalDeleteRef={cancelModalDeleteRef}
                icon={
                    <div
                        className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-200">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600"
                                                 aria-hidden="true"/>
                    </div>
                }
                title="លុបទំនិញ"
                button={
                    <button
                        type="button"
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                        onClick={() => handleDelete(deleteId)}
                    >
                        លុប
                    </button>
                }>
                <p className="text-center text-sm text-gray-500">
                    តើអ្នកពិតជាចង់លុបទំនិញនេះ?
                </p>
                <p className="text-center text-sm text-gray-500">
                    ទំនិញនឹងលុបចេញ និងមិនអាចត្រឡប់វិញបានទេ!
                </p>
            </BaseDialog>

            <BaseDialog
                openModal={openModalAddItem}
                setOpenModal={setOpenModalAddItem}
                cancelModalDeleteRef={cancelModalAddItemRef}
                icon={
                    <div
                        className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <PlusCircleIcon className="h-6 w-6 text-green-600"
                                        aria-hidden="true"/>
                    </div>
                }
                title="បន្ថែមទំនិញ"
                button={isLoadingAdd
                    ? <button disabled type="button"
                              className="disabled rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
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
                        type="button"
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                        onClick={handleSubmit}
                    >
                        បន្ថែម
                    </button>
                }>
                <form className="space-y-6">
                    <div>
                        <label
                            className="font-medium leading-6 text-gray-900 dark:text-white">
                            រូបភាព
                        </label>
                        <div className="mt-2 flex items-center justify-center w-full">
                            <div className="w-full h-64">
                                <label htmlFor="image"
                                       className="flex items-center justify-center w-full h-full">
                                    {isImage ? (
                                        <img src={imageURL} alt="image"
                                             className="h-full rounded-lg"/>
                                    ) : (
                                        <div

                                            className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <svg aria-hidden="true"
                                                 className="w-10 h-10 mb-3 text-gray-400"
                                                 fill="none"
                                                 stroke="currentColor"
                                                 viewBox="0 0 24 24"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or
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
                                        onChange={handleChangeAdd}
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name"
                               className="font-medium leading-6 text-gray-900 dark:text-white">
                            ឈ្មោះទំនិញ
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                autoComplete="false"
                                value={data.name}
                                onChange={handleChangeAdd}

                                className="input w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="price"
                               className="font-medium leading-6 text-gray-900 dark:text-white">
                            តម្លៃ
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="price"
                                name="price"
                                autoComplete="false"
                                value={data.price}
                                onChange={handleChangeAdd}

                                className="input w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="barcode"
                               className="font-medium leading-6 text-gray-900 dark:text-white">
                            បារកូដ
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="barcode"
                                name="barcode"
                                autoComplete="false"
                                value={data.barcode}
                                onChange={handleChangeAdd}

                                className="input w-full"
                            />
                        </div>
                    </div>
                </form>
            </BaseDialog>
            <Toaster/>
        </>
    )
}