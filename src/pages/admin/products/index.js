import React, {useEffect, useRef, useState} from 'react';
import {Toaster} from "react-hot-toast";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";
import searchData from "../../../requestApi/searchData";
import postData from "../../../requestApi/postData";
import deleteData from "../../../requestApi/deleteData";
import DeleteDialog from "../../../components/dialog/DeleteDialog";
import FormDialog from "../../../components/dialog/FormDialog";
import Input from "../../../components/form/Input";
import handleValidation from "../../../features/validation/validation";
import getData from "../../../requestApi/getData";
import handleChange from "../../../features/handleChange";
import InputImage from "../../../components/form/InputImage";
import Select from "../../../components/form/Select";
import useGetDataList from "../../../hooks/useGetDataList";
import Filter from "../../../components/form/Filter";
import Search from "../../../components/form/Search";
import Empty from "../../../components/empty";

export default function Products() {
    let url = '/product';
    const [categories, setCategories] = useState([]);
    const [content, setContent] = useState('');
    const [params, setParams] = useState({});
    const [isEmpty, setIsEmpty] = useState(false);

    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const cancelModalAddItemRef = useRef(null);
    const [updateId, setUpdateId] = useState(0);
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

    const [isValidate, setIsValidate] = useState({
        image: false,
        name: false,
        category: false,
        price: false,
        barcode: false
    });

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const [products, meta, isLoading, setProducts, setMeta, setIsLoading] = useGetDataList(url, openModalAddItem, openModalDelete);

    const handleChangeAdd = e => {
        handleChange(
            e,
            setData,
            setIsValidate,
            setIsImage,
            setImageURL,
        )
    }

    const constructFormData = (data, categories, isUpdate) => {
        const formData = new FormData();
        formData.append('category_id', data.category || categories[0].id);
        formData.append('barcode', data.barcode);
        formData.append('name_en', data.name);
        formData.append('name_kh', data.name);
        formData.append('price', data.price);
        data.image && formData.append('file', data.image);
        isUpdate && formData.append('file', 'keep');
        return formData;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (!handleValidation(
            ['image', 'name', 'category', 'price', 'barcode'],
            data,
            setIsValidate
        )) return;
        const formData = constructFormData(data, categories);
        await postData(url, formData, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានបញ្ចូលទំនិញដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលបញ្ចូលទំនិញ');
    }

    const handleUpdate = async id => {
        if (!handleValidation(
            ['name', 'category', 'price', 'barcode'],
            data,
            setIsValidate
        )) return;
        const formData = constructFormData(data, categories, true);
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

        getData(
            controller,
            isMounted,
            '/category?is_all=true',
            0,
            setCategories
        ).then(r => r).catch(e => e);

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
                setIsValidate({
                    image: false,
                    name: false,
                    category: false,
                    price: false,
                    barcode: false
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
    }, [openModalAddItem, openModalDelete]);

    return (
        <div className="h-full flex flex-col">
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="me-8">ទំនិញ</h1>
                    <button
                        onClick={() => {
                            setOpenModalAddItem(true);
                        }}
                        type="button"
                        className="button me-8">
                        បន្ថែមទំនិញ
                    </button>
                    <Filter
                        title="ប្រភេទ"
                        id="filter-category"
                        onChange={(e) => {
                            const {value} = e.target;
                            const p = value !== "all" ? {category_id: parseInt(value)} : {}
                            setParams(p)
                            searchData(content, url, setContent, setIsLoading, setProducts, setMeta, p).then(r => r).catch(e => e);
                        }}
                        selectOptions={categories}
                        isHasNon={true}
                        className="w-52 me-8"
                    />
                </div>

                <Search
                    id="search-product"
                    placeholder="ស្វែងរកឈ្មោះ ឬបាកូដទំនិញ"
                    url={url}
                    setContent={setContent}
                    setIsLoading={setIsLoading}
                    setData={setProducts}
                    setMeta={setMeta}
                    params={params}
                />
            </div>
            {/*<div className="relative overflow-x-auto rounded-t-lg dark:bg-gray-800 dark:border-gray-700">*/}
            {/*    <table className="w-full text-left text-gray-500 dark:text-gray-400">*/}
            {/*        <thead className="text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">*/}
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-6/12 px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="w-2/12 px-6 py-3">
                            តម្លៃ
                        </th>
                        <th scope="col" className="w-2/12 px-6 py-3">
                            ប្រភេទ
                        </th>
                        <th scope="col" className="text-center w-2/12 px-6 py-3 rounded-r-lg">
                            សកម្មភាព
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading
                        ? null
                        : products.map(item => (
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-600">
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
                                <td className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="pl-3">
                                        <div
                                            className="font-semibold">{item.category ? item.category.name : "មិនមាន"}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => {
                                                setUpdateId(item.id);
                                                setOpenModalAddItem(true);
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
                    ? <Empty title="ទំនិញ"/>
                    : <div className="flex-1"></div>
            }
            <Pagination
                content={content}
                meta={meta}
                setMeta={setMeta}
                setItems={setProducts}
                setLoader={setIsLoading}
                url={url}/>

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
                <InputImage
                    title="រូបភាព"
                    id="image"
                    onChange={handleChangeAdd}
                    image={imageURL}
                    isImage={isImage}
                    isRequire={true}
                    isValidate={isValidate.image}
                />
                <Input
                    title="ឈ្មោះទំនិញ"
                    type="text"
                    id="name"
                    onChange={handleChangeAdd}
                    value={data.name}
                    autoComplete="name"
                    isRequire={true}
                    isValidate={isValidate.name}
                />
                <Select
                    title="ប្រភេទ"
                    id="category"
                    onChange={handleChangeAdd}
                    value={data.category}
                    selectOptions={categories}
                    isRequire={true}
                    isValidate={isValidate.category}
                />
                <Input
                    title="តម្លៃ"
                    id="price"
                    onChange={handleChangeAdd}
                    value={data.price}
                    placeholder="0.00"
                    leading="$"
                    selectId="currency"
                    selectOptions={[
                        {value: "USD", label: "USD"}
                    ]}
                    isRequire={true}
                    isValidate={isValidate.price}
                />
                <Input
                    title="បារកូដ"
                    type="text"
                    id="barcode"
                    onChange={handleChangeAdd}
                    value={data.barcode}
                    autoComplete="barcode"
                    isRequire={true}
                    isValidate={isValidate.barcode}
                />
            </FormDialog>
            <DeleteDialog
                title="ទំនិញ"
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