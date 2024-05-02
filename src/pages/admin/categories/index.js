import React, {useEffect, useRef, useState} from "react";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";
import searchData from "../../../requestApi/searchData";
import handleChange from "../../../features/handleChange";
import handleValidation from "../../../features/validation/validation";
import postData from "../../../requestApi/postData";
import deleteData from "../../../requestApi/deleteData";
import Input from "../../../components/form/Input";
import DeleteDialog from "../../../components/dialog/DeleteDialog";
import {Toaster} from "react-hot-toast";
import FormDialog from "../../../components/dialog/FormDialog";
import useGetDataList from "../../../hooks/useGetDataList";

export default function Categories() {
    let url = '/category';

    const [content, setContent] = useState('');
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

    const [categories, meta, isLoading, setCategories, setMeta, setIsLoading] = useGetDataList(url, openModalAddItem, openModalDelete);

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
        await postData(url, data, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានបញ្ចូលប្រភេទដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលបញ្ចូលប្រភេទ');
    }

    const handleUpdate = async id => {
        if (!handleValidation(
            ['name'],
            data,
            setIsValidate
        )) return;
        await postData(`${url}/${id}?_method=PUT`, data, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានកែប្រែប្រភេទដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលកែប្រែប្រភេទ');
    }

    const handleDelete = async id => {
        await deleteData(`${url}/${id}`, setIsLoadingDelete, setOpenModalDelete, 'បានលុបប្រភេទដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលលុបប្រភេទ')
    }

    useEffect(() => {
        meta?.total === 0 ? setIsEmpty(true) : setIsEmpty(false);
    }, [meta]);

    useEffect(() => {
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
    }, [openModalAddItem]);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="me-8">ប្រភេទ</h1>
                    <button
                        onClick={() => {
                            setOpenModalAddItem(true);
                        }}
                        type="button"
                        className="button">
                        បន្ថែមប្រភេទ
                    </button>
                </div>

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
                        onChange={(e) => searchData(e.target.value, url, setContent, setIsLoading, setCategories, setMeta)}
                        type="text"
                        id="table-search"
                        className="input w-80 pl-10"
                        placeholder="ស្វែងរកឈ្មោះ"/>
                </div>
            </div>
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-10/12 px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="text-center w-2/12 px-6 py-3 rounded-r-lg">
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
                                        <span className="">មិនមានប្រភេទ</span>
                                    </div>
                                </th>
                            </tr>
                            : categories.map(shop => (
                                <tr className="h-14 border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
                                >
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        {shop.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => {
                                                    setUpdateId(shop.id);
                                                    setOpenModalAddItem(true);
                                                    setData({
                                                        name: shop.name
                                                    });
                                                }}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                កែប្រែ
                                            </button>
                                            <button
                                                className="pl-3 font-medium text-red-600 dark:text-red-500 hover:underline"
                                                onClick={() => {
                                                    setDeleteId(shop.id);
                                                    setOpenModalDelete(true);
                                                }}
                                            >
                                                លុប
                                            </button>
                                        </div>
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
                setItems={setCategories}
                setLoader={setIsLoading}
                url={url}/>

            <FormDialog
                title="ប្រភេទ"
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
                    onChange={handleChangeAdd}
                    value={data.name}
                    isValidate={isValidate.name}
                    isRequire={true}
                />
            </FormDialog>
            <DeleteDialog
                title="ប្រភេទ"
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