import React, {useEffect, useRef, useState} from "react";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";
import handleChange from "../../../features/handleChange";
import handleValidation from "../../../features/validation/validation";
import postData from "../../../requestApi/postData";
import deleteData from "../../../requestApi/deleteData";
import Input from "../../../components/form/Input";
import DeleteDialog from "../../../components/dialog/DeleteDialog";
import {Toaster} from "react-hot-toast";
import FormDialog from "../../../components/dialog/FormDialog";
import useGetDataList from "../../../hooks/useGetDataList";
import Search from "../../../components/form/Search";
import Empty from "../../../components/empty";

export default function Categories() {
    let shopId = localStorage.getItem('shopId');
    let url = '/category';

    const [params] = useState({
        business_id: shopId
    });
    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const cancelModalAddItemRef = useRef(null);
    const [updateId, setUpdateId] = useState(0);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [data, setData] = useState({
        business_id: shopId,
        name: "",
    });

    const [isValidate, setIsValidate] = useState({
        name: false,
    });

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const [categories, meta, isLoading, setCategories, setMeta, setIsLoading] = useGetDataList(url, openModalAddItem, openModalDelete, params);

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
                    business_id: shopId,
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
        <div className="h-full flex flex-col">
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="me-8">ប្រភេទទំនិញ</h1>
                    <button
                        onClick={() => {
                            setOpenModalAddItem(true);
                        }}
                        type="button"
                        className="button me-8">
                        បន្ថែមប្រភេទទំនិញ
                    </button>
                </div>

                <Search
                    id="search-category"
                    placeholder="ស្វែងរកប្រភេទទំនិញ"
                    url={url}
                    setContent={setContent}
                    setIsLoading={setIsLoading}
                    setData={setCategories}
                    setMeta={setMeta}
                    params={params}
                />
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
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading
                        ? null
                        : categories.map(shop => (
                            <tr className="h-14 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                                                    business_id: shopId,
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
            {isLoading
                ? <Loading/>
                : isEmpty
                    ? <Empty title="ប្រភេទទំនិញ"/>
                    : <div className="flex-1"></div>
            }
            <Pagination
                content={content}
                meta={meta}
                setMeta={setMeta}
                setItems={setCategories}
                setLoader={setIsLoading}
                url={url}/>

            <FormDialog
                title="ប្រភេទទំនិញ"
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
                title="ប្រភេទទំនិញ"
                openModalDelete={openModalDelete}
                setOpenModalDelete={setOpenModalDelete}
                cancelModalDeleteRef={cancelModalDeleteRef}
                isLoadingDelete={isLoadingDelete}
                handleDelete={handleDelete}
                deleteId={deleteId}
            />
            <Toaster/>
        </div>
    )
}