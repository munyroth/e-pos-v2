import {Fragment, useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {Dialog, Transition} from "@headlessui/react";
import {PlusCircleIcon} from "@heroicons/react/24/outline";
import toast, {Toaster} from 'react-hot-toast';

export default function StockIn() {

    // hooks
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    // date
    const date = new Date();
    const weekday = ["អាទិត្យ","ចន្ទ","អង្គារ","ពុធ","ព្រហស្បតិ៍","សុក្រ","សៅរ៍"];
    const month = ["មករា","កុម្ភៈ","មីនា","មេសា","ឧសភា","មិថុនា","កក្កដា","សីហា","កញ្ញា","តុលា","វិច្ឆិកា","ធ្នូ"];

    // items
    const [items, setItems] = useState([]);
    const [itemsProcessing, setItemsProcessing] = useState([]);

    // status
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOnPay, setIsLoadingOnPay] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const cancelModalAddItemRef = useRef(null);

    const handleAddItem = item => {
        const itemExist = itemsProcessing.find(i => i.id === item.id);

        if (itemExist) {
            setItemsProcessing(
                itemsProcessing.map(i =>
                    i.id === item.id
                        ? {...itemExist, quantity: itemExist.quantity + 1}
                        : i
                )
            );
        } else {
            setItemsProcessing([...itemsProcessing, {...item, quantity: 1}]);
        }
    }

    const handleChange = (e, item) => {
        const {name, value} = e.target;
        const itemExist = itemsProcessing.find(i => i.id === item.id);
        setItemsProcessing(
            itemsProcessing.map(i =>
                i.id === item.id
                    ? {...itemExist, [name]: parseInt(value)}
                    : i
            )
        );
    }

    const handleSubtractOne = item => {
        const itemExist = itemsProcessing.find(i => i.id === item.id);
        setItemsProcessing(
            itemsProcessing.map(i =>
                i.id === item.id
                    ? {...itemExist, quantity: itemExist.quantity - 1}
                    : i
            )
        );
    }
    const handleAddOne = item => {
        const itemExist = itemsProcessing.find(i => i.id === item.id);
        setItemsProcessing(
            itemsProcessing.map(i =>
                i.id === item.id
                    ? {...itemExist, quantity: itemExist.quantity + 1}
                    : i
            )
        );
    }

    const handlePayNow = async e => {
        e.preventDefault();
        setIsLoadingOnPay(true);

        let isMounted = true;
        const controller = new AbortController();

        try {
            const res = await axiosPrivate.post('/stock_in',
                {
                    store_id: Cookies.get('storeId'),
                    branch_index: Cookies.get('branchIndex'),
                    items: itemsProcessing
                },
                {
                    signal: controller.signal
                });
            isMounted && navigate(location.state?.path || "/admin/items", { replace: true });
        } catch (err) {
            setIsLoadingOnPay(false);
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getItems = async  () => {
            try {
                const res = await axiosPrivate.get('/items/store/'+Cookies.get('storeId'), {
                    signal: controller.signal
                });
                isMounted && setItems(res.data.data);
                res.data.data.length === 0 && setIsEmpty(true);
                setIsLoading(false);
            } catch (err) {

            }
        }

        getItems();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');

    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [data, setData] = useState({
        store_id: Cookies.get('storeId'),
        image: null,
        UPC: "",
        name: ""
    });

    const handleChangeAdd = e => {
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

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoadingAdd(true);

        const formData = new FormData();
        formData.append("store_id", Cookies.get('storeId'));
        formData.append("image", data.image);
        formData.append("UPC", data.UPC);
        formData.append("name", data.name);

        let isMounted = true;
        const controller = new AbortController();

        const post = async  () => {
            const res = await axiosPrivate.post('/items', formData , {
                signal: controller.signal
            });
            if (isMounted) {
                setOpenModalAddItem(false);
                setData({
                    store_id: Cookies.get('storeId'),
                    image: null,
                    UPC: "",
                    name: ""
                });
                setImageURL("");
                setIsImage(false);

                setItems([...items, res.data.data]);
                isEmpty && setIsEmpty(false);
            }
            return res;
        }

        toast.promise(post(), {
            loading: 'កំពុងផ្ទុក...',
            success: 'បានបញ្ចូលទំនិញជោគជ័យ',
            error: 'មានបញ្ហាក្នុងការបញ្ចូល'
        })
            .then(() => {})
            .catch(() => {})
            .finally(() => {
                setIsLoadingAdd(false);
            });
    }

    return (
        <>
            <div className="relative h-full">
                <div className="absolute top-0 pt-14 h-full w-full flex space-x-4">
                    <div className="w-4/6 overflow-y-scroll no-scrollbar">
                        <div className="w-full grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
                            {isLoading
                                ? <>កំពុងផ្ទុក...</>
                                : isEmpty
                                    ? <>មិនមានទំនិញ</>
                                    : items.map(item => (
                                            <div
                                                className="w-48 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                                <div className="p-5 flex justify-center">
                                                    <div className="flex items-center h-40 w-40 overflow-hidden">
                                                        <img className="rounded-md"
                                                             src={item.image_url}
                                                             alt={item.name}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-3 pb-3">
                                                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </h5>
                                                    <p className="text-xs font-semibold tracking-tight text-gray-600 dark:text-white">
                                                        {item.UPC}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xl font-bold text-gray-900 dark:text-white">{item.price}៛</span>
                                                        <button
                                                            onClick={() => handleAddItem(item)}
                                                            className="text-white bg-blue-700 hover:bg-blue-800 active:ring-4 active:outline-none active:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                                                        >
                                                            បន្ថែម
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                        </div>
                    </div>
                    <div className="relative w-2/6 border rounded-lg flow-root">
                        <div className="h-20">
                            <div className="p-4 flex flex-col">
                                <p className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                                    លេខវិក្កយប័ត្រ: 1
                                </p>
                                <p className="mt-2 text-lg font-bold leading-none text-gray-900 dark:text-white">
                                    កាលបរិច្ឆេទ: ថ្ងៃ{weekday[date.getDay()]} ទី{date.getDay()} ខែ{month[date.getMonth()]} ឆ្នាំ{date.getFullYear()}
                                </p>
                            </div>
                        </div>
                        <div className="h-full w-full top-0 pt-20 pb-20 px-4 absolute">
                            <ul role="list" className="h-full flex flex-col space-y-4 overflow-y-scroll no-scrollbar">
                                {itemsProcessing.map(item => (
                                        <li className="p-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="w-16 h-16"
                                                        src={item.image_url}
                                                        alt={item.name} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate dark:text-white">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        {item.UPC}
                                                    </p>
                                                    <div className="flex justify-between items-end">
                                                        <div className="flex">
                                                            <div className="relative rounded-md mr-2 text-red-500">
                                                                ទិញ
                                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <span className="text-gray-500 text-sm">៛</span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name="cost"
                                                                    id="cost"
                                                                    className="w-20 h-7 text-right rounded-md border-0 ml-1 pl-2 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    placeholder={item.cost}

                                                                    onChange={e => handleChange(e, item)}
                                                                />
                                                            </div>
                                                            <div className="relative rounded-md text-main">
                                                                លក់
                                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <span className="text-gray-500 text-sm">៛</span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name="price"
                                                                    id="price"
                                                                    className="w-20 h-7 text-right rounded-md border-0 ml-1 pl-2 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    placeholder={item.price}

                                                                    onChange={e => handleChange(e, item)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 flex items-center">
                                                                    <button type="button"
                                                                            className="w-7 h-7 text-xs font-medium text-center text-gray-900 bg-white rounded-full border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"

                                                                            onClick={() => {
                                                                                if (item.quantity > 1) handleSubtractOne(item)
                                                                            }}>
                                                                        -
                                                                    </button>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name="quantity"
                                                                    id="quantity"
                                                                    value={item.quantity}
                                                                    className="text-center w-20 h-7 px-8 text-xs bg-gray-100 rounded-full border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-blue-300"

                                                                    onChange={e => handleChange(e, item)}
                                                                />
                                                                <div className="absolute inset-y-0 right-0 flex items-center">
                                                                    <button type="button"
                                                                            className="w-7 h-7 text-xs font-medium text-center text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"

                                                                            onClick={() => handleAddOne(item)}>
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className="w-full h-20 p-4 absolute bottom-0">
                            {isLoadingOnPay
                                ? <button disabled type="button"
                                          className="w-full h-full inline-flex items-center justify-center rounded-md bg-main px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm dark:bg-main"
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
                                    className="flex w-full h-full justify-center items-center rounded-md bg-main px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 active:ring-4 active:outline-none active:ring-green-300"

                                    onClick={handlePayNow}
                                >
                                    បង់ឥឡូវ
                                </button>
                            }
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 w-full flex items-center justify-between dark:bg-gray-900">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1">
                            <li className="inline-flex items-center">
                                <Link
                                    to='/admin/items'
                                    className="text-xl font-bold text-gray-900 dark:text-white"
                                >
                                    ទំនិញ
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">បន្ថែមទំនិញចូលស្តុក</h2>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <button
                        type="button"
                        className="rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-50 shadow-sm hover:bg-blue-600 active:ring-4 active:outline-none active:ring-blue-300"

                        onClick={() => {
                            setOpenModalAddItem(true);
                        }}
                    >
                        បន្ថែមទំនិញថ្មី
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
                        <input type="text" id="table-search-users"
                               className="input w-80 pl-10"
                               placeholder="ស្វែងរកទំនិញដោយបារកូដ"/>
                    </div>
                </div>
            </div>

            <Transition.Root show={openModalAddItem} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelModalAddItemRef} onClose={setOpenModalAddItem}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="mt-3 text-center sm:mx-4 sm:mt-0 sm:text-left">
                                            <div className="flex items-center">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <PlusCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                </div>
                                                <Dialog.Title as="h3" className="ml-3 text-base font-semibold leading-6 text-gray-900">
                                                    បន្ថែមទំនិញថ្មី
                                                </Dialog.Title>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                                                <form className="space-y-6">
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
                                                                        onChange={handleChangeAdd}
                                                                        required
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                                            ឈ្មោះទំនិញ
                                                        </label>
                                                        <div className="">
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                autoComplete="false"
                                                                value={data.name}
                                                                onChange={handleChangeAdd}

                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <label htmlFor="password"
                                                                   className="block text-sm font-medium leading-6 text-gray-900">
                                                                UPC
                                                            </label>
                                                        </div>
                                                        <div className="">
                                                            <input
                                                                type="text"
                                                                id="UPC"
                                                                name="UPC"
                                                                autoComplete="false"
                                                                value={data.UPC}
                                                                onChange={handleChangeAdd}

                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        {isLoadingAdd
                                            ? <button disabled type="button"
                                                      className="disabled inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
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
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                                onClick={handleSubmit}
                                            >
                                                បន្ថែម
                                            </button>
                                        }
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                setOpenModalAddItem(false)
                                                setIsLoadingAdd(false)
                                            }}
                                            ref={cancelModalAddItemRef}
                                        >
                                            បោះបង់
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <Toaster />
        </>
    )
}