import React, {useEffect, useRef, useState} from "react";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";
import searchData from "../../../requestApi/searchData";
import handleChange from "../../../features/handleChange";
import handleValidation from "../../../features/validation/validation";
import postData from "../../../requestApi/postData";
import deleteData from "../../../requestApi/deleteData";
import getData from "../../../requestApi/getData";
import Input from "../../../components/form/Input";
import DeleteDialog from "../../../components/dialog/DeleteDialog";
import {Toaster} from "react-hot-toast";
import FormDialog from "../../../components/dialog/FormDialog";

export default function Products() {
    let url = '/shop';

    const [shop, setShop] = useState([]);
    const [meta, setMeta] = useState({});
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const cancelModalAddItemRef = useRef(null);
    const [updateId, setUpdateId] = useState(0);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [data, setData] = useState({
        name: "",
    });

    const [isValidate, setIsValidate] = useState({
        name: false,
    });

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const handleChangeAdd = e => {
        handleChange(
            e,
            setData,
            setIsValidate
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleValidation(
            ['name'],
            data,
            setIsValidate
        )) return;
        await postData(url, data, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានបញ្ចូលសាខាដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលបញ្ចូលសាខា');
    }

    const handleUpdate = async id => {
        if (!handleValidation(
            ['name'],
            data,
            setIsValidate
        )) return;
        await postData(`${url}/${id}?_method=PUT`, data, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានកែប្រែសាខាដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលកែប្រែសាខា');
    }

    const handleDelete = async id => {
        await deleteData(`${url}/${id}`, setIsLoadingDelete, setOpenModalDelete, 'បានលុបសាខាដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលលុបសាខា')
    }

    useEffect(() => {
        meta?.total === 0 ? setIsEmpty(true) : setIsEmpty(false);
    }, [meta]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        // Fetch data
        if (!openModalAddItem && !openModalDelete) {
            getData(
                controller,
                isMounted,
                url,
                meta.page,
                setShop,
                setMeta,
                setIsLoading
            ).then(r => r).catch(e => e);
        }

        // Reset form data when modal is closed
        if (!openModalAddItem) {
            // wait for the modal to close
            setTimeout(() => {
                setData({
                    name: "",
                });
                setIsValidate({
                    name: false,
                });
                setUpdateId(0);
            }, 200);
        }

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [openModalAddItem, openModalDelete]);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <h1 className="">សាខា</h1>
                <button
                    onClick={() => {
                        setOpenModalAddItem(true);
                    }}
                    type="button"
                    className="button">
                    បន្ថែមសាខា
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
                        onChange={(e) => searchData(e, url, setContent, setIsLoading, setShop, setMeta)}
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
                        <th scope="col" className="px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            ចំនួនលក់សរុប
                        </th>
                        <th scope="col" className="px-6 py-3">
                            ចំណូលសរុប
                        </th>
                        <th scope="col" className="px-6 py-3 rounded-r-lg">
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
                                        <span className="">មិនមានសាខា</span>
                                    </div>
                                </th>
                            </tr>
                            : shop.map(item => (
                                <tr className="h-14 border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.orders_count}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${parseFloat(item?.orders_sum_total ?? 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setUpdateId(item.id);
                                                setOpenModalAddItem(true);
                                                setData({
                                                    name: item.name
                                                });
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
                setItems={setShop}
                setLoader={setIsLoading}
                url={url}/>

            <FormDialog
                title="សាខា"
                openModal={openModalAddItem}
                setOpenModal={setOpenModalAddItem}
                cancelModalRef={cancelModalAddItemRef}
                isLoading={isLoadingAdd}
                updateId={updateId}
                handleUpdate={handleUpdate}
                handleAdd={handleSubmit}
            >
                <Input
                    title="ឈ្មោះ"
                    type="text"
                    id="name"
                    handleChange={handleChangeAdd}
                    value={data.name}
                    isValidate={isValidate.name}
                    isRequire={true}
                />
            </FormDialog>
            <DeleteDialog
                title="លុបសាខា"
                openModalDelete={openModalDelete}
                setOpenModalDelete={setOpenModalDelete}
                cancelModalDeleteRef={cancelModalDeleteRef}
                isLoadingDelete={isLoadingDelete}
                handleDelete={handleDelete}
                deleteId={deleteId}
            />
            <Toaster/>
        </>
    )
}