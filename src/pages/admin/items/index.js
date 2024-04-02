import {Fragment, useEffect, useRef, useState} from 'react';
import {Toaster} from "react-hot-toast";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";
import searchData from "../../../requestApi/searchData";
import postData from "../../../requestApi/postData";
import deleteData from "../../../requestApi/deleteData";
import DeleteDialog from "../../../components/dialog/DeleteDialog";
import FormDialog from "../../../components/dialog/FormDialog";

export default function Items() {
    let url = '/product';
    const axiosPrivate = useAxiosPrivate();

    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const cancelModalAddItemRef = useRef(null);

    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [data, setData] = useState({
        category: null,
        barcode: "",
        name: "",
        price: "",
        image: null
    });

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);
    const [updateId, setUpdateId] = useState(0);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState({});
    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

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

    const constructFormData = (data, categories) => {
        const formData = new FormData();
        formData.append('category_id', data.category ? data.category : categories[0].id);
        formData.append('barcode', data.barcode);
        formData.append('name_en', data.name);
        formData.append('name_kh', data.name);
        formData.append('price', data.price);
        data.image && formData.append('file', data.image);
        return formData;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = constructFormData(data, categories);
        await postData(url, formData, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានបញ្ចូលទំនិញដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលបញ្ចូលទំនិញ');
    }

    const handleUpdate = async id => {
        const formData = constructFormData(data, categories);
        await postData(`${url}/${id}?_method=PUT`, formData, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានកែប្រែទំនិញដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលកែប្រែទំនិញ');
    }

    const handleDelete = async id => {
        await deleteData(`${url}/${id}`, setIsLoadingDelete, setOpenModalDelete, 'បានលុបទំនិញដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលលុបទំនិញ')
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
            isMounted && setProducts(res.data.data);
            setMeta(res.data.meta);
            setIsLoading(false);
        }

        const getCategories = async () => {
            const res = await axiosPrivate.get('/category?is_all=true', {
                signal: controller.signal
            });
            setCategories(res.data.data);
        }

        if (!openModalAddItem && !openModalDelete) {
            getItems().catch(() => console.log("can't get items"));
        }

        if (openModalAddItem) {
            getCategories().catch(() => console.log("can't get categories"));
        }

        // Reset form data when modal is closed
        if (!openModalAddItem) {
            // wait for the modal to close
            setTimeout(() => {
                setData({
                    category: null,
                    barcode: "",
                    name: "",
                    price: "",
                    image: null
                });
                setImageURL("");
                setIsImage(false);
                setUpdateId(0);
            }, 200);
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
                    className="button">
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
                        onChange={(e) => searchData(e, setContent, setIsLoading, setProducts, setMeta, url)}
                        type="text"
                        id="table-search-users"
                        className="input w-80 pl-10"
                        placeholder="ស្វែងរក"/>
                </div>
            </div>
            <div className="relative overflow-x-auto rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-3/6 px-6 py-3">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="w-1/6 px-6 py-3">
                            តម្លៃ
                        </th>
                        <th scope="col" className="w-1/6 px-6 py-3">
                            សកម្មភាព
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
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
                            : products.map(item => (
                                <tr className="hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600">
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="w-10 h-10"
                                             src={item.img_url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                                             alt={item.name_kh}/>
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
                                            onClick={() => {
                                                setData({
                                                    category: item.category_id,
                                                    barcode: item.barcode,
                                                    name: item.name_kh,
                                                    price: item.price,
                                                    image: null
                                                });
                                                if (item.img_url) {
                                                    setImageURL(item.img_url);
                                                    setIsImage(true);
                                                }
                                                setUpdateId(item.id);
                                                setOpenModalAddItem(true);
                                            }}
                                            className="pl-1 font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            កែប្រែ
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
                setItems={setProducts}
                setLoader={setIsLoading}
                url={url}/>

            <DeleteDialog
                title="ទំនិញ"
                openModalDelete={openModalDelete}
                setOpenModalDelete={setOpenModalDelete}
                cancelModalDeleteRef={cancelModalDeleteRef}
                isLoadingDelete={isLoadingDelete}
                handleDelete={handleDelete}
                deleteId={deleteId}
            />

            <FormDialog
                title="ទំនិញ"
                openModal={openModalAddItem}
                setOpenModal={setOpenModalAddItem}
                cancelModalRef={cancelModalAddItemRef}
                isLoading={isLoadingAdd}
                updateId={updateId}
                handleUpdate={handleUpdate}
                handleAdd={handleSubmit}
            >
                <form className="space-y-6">
                    <div>
                        <label
                            className="font-medium leading-6 text-gray-900 dark:text-white">
                            រូបភាព
                        </label>
                        <div className="mt-2 flex items-center justify-center w-full">
                            <div className="w-full h-32">
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
                                autoComplete="name"
                                value={data.name}
                                onChange={handleChangeAdd}

                                className="input w-full"
                            />
                        </div>
                    </div>
                    <div className="">
                        <label htmlFor="category"
                               className="font-medium leading-6 text-gray-900 dark:text-white">
                            ប្រភេទ
                        </label>
                        <div className="mt-2">
                            <select
                                onChange={handleChangeAdd}
                                id="category"
                                name="category"
                                autoComplete="category"
                                className="select w-full"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="price"
                               className="font-medium leading-6 text-gray-900 dark:text-white">
                            តម្លៃ
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm dark:text-gray-200">$</span>
                            </div>

                            <input
                                type="text"
                                id="price"
                                name="price"
                                autoComplete="false"
                                value={data.price}
                                onChange={handleChangeAdd}

                                // className="input w-full"
                                className="input w-full py-1.5 pl-7 pr-20"
                                placeholder="0.00"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <label htmlFor="currency" className="sr-only">
                                    Currency
                                </label>
                                <select
                                    id="currency"
                                    name="currency"
                                    className="h-full select-input"
                                >
                                    <option>USD</option>
                                </select>
                            </div>
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
            </FormDialog>
            <Toaster/>
        </>
    )
}