import React, {useEffect, useRef, useState} from "react";
import Pagination from "../../../components/pagination";
import Loading from "../../../components/loading";
import searchData from "../../../requestApi/searchData";
import handleChange from "../../../features/handleChange";
import handleValidation from "../../../features/validation/validation";
import postData from "../../../requestApi/postData";
import deleteData from "../../../requestApi/deleteData";
import getData from "../../../requestApi/getData";
import FormDialog from "../../../components/dialog/FormDialog";
import Input from "../../../components/form/Input";
import DeleteDialog from "../../../components/dialog/DeleteDialog";
import {Toaster} from "react-hot-toast";
import InputImage from "../../../components/form/InputImage";
import Select from "../../../components/form/Select";
import useGetData from "../../../hooks/useGetData";

export default function Products() {
    let url = '/employee';
    const [page, setPage] = useState(1);
    const [members, meta, isLoading, setMembers, setMeta, setIsLoading] = useGetData(url, page);

    const [roles, setRoles] = useState([]);

    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const cancelModalAddItemRef = useRef(null);
    const [updateId, setUpdateId] = useState(0);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [data, setData] = useState({
        name: "",
        role: "",
        phone: "",
        password: "",
        image: null
    });

    const [isValidate, setIsValidate] = useState({
        name: false,
        role: false,
        phone: false,
        password: false,
        image: false
    });

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const handleChangeAdd = e => {
        handleChange(
            e,
            setData,
            setIsValidate,
            setIsImage,
            setImageURL,
        )
    }

    const constructFormData = (data, isUpdate) => {
        let formData = new FormData();
        formData.append('name', data.name);
        formData.append('role', data.role);
        formData.append('phone', data.phone);
        formData.append('password', data.password);
        data.image && formData.append('file', data.image);
        isUpdate && formData.append('file', 'keep');
        return formData;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (!handleValidation(
            ['image', 'name', 'role', 'phone', 'password'],
            data,
            setIsValidate
        )) return;
        const formData = constructFormData(data);
        await postData(url, formData, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានបញ្ចូលសមាជិកដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលបញ្ចូលសមាជិក');
    }

    const handleUpdate = async id => {
        if (!handleValidation(
            ['name', 'role', 'phone'],
            data,
            setIsValidate
        )) return;
        const formData = constructFormData(data, true);
        await postData(`${url}/${id}?_method=PUT`, formData, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានកែប្រែសមាជិកដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលកែប្រែសមាជិក');
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

        // Get roles
        if (openModalAddItem) {
            getData(
                controller,
                isMounted,
                '/role',
                0,
                setRoles,
                null,
                null
            ).then(r => r).catch(e => e)
        }

        // Reset form data when modal is closed
        if (!openModalAddItem) {
            // wait for the modal to close
            setTimeout(() => {
                setData({
                    name: "",
                    role: "",
                    phone: "",
                    password: "",
                    image: null
                });
                setIsValidate({
                    name: false,
                    role: false,
                    phone: false,
                    password: false,
                    image: false
                });
                setIsImage(false);
                setImageURL("");
                setUpdateId(0);
            }, 200);
        }

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [openModalAddItem, openModalDelete, url]);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <h1 className="">សមាជិក</h1>
                <button
                    onClick={() => {
                        setOpenModalAddItem(true);
                    }}
                    type="button"
                    className="button">
                    បន្ថែមសមាជិក
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
                        onChange={(e) => searchData(e, url, setContent, setIsLoading, setMembers, setMeta)}
                        type="text"
                        id="table-search-users"
                        className="input w-80 pl-10"
                        placeholder="ស្វែងរក"/>
                </div>
            </div>
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {/*<th scope="col" className="p-4 rounded-l-lg">*/}
                        {/*    <div className="flex items-center">*/}
                        {/*        <input id="checkbox-all-search" type="checkbox"*/}
                        {/*               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>*/}
                        {/*        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>*/}
                        {/*    </div>*/}
                        {/*</th>*/}
                        <th scope="col" className="w-1/4 px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="w-1/4 px-6 py-3">
                            លេខទូរស័ព្ទ
                        </th>
                        <th scope="col" className="w-1/4 px-6 py-3">
                            តួនាទី
                        </th>
                        <th scope="col" className="w-1/4 px-6 py-3 rounded-r-lg">
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
                                        <span className="">មិនមានសមាជិក</span>
                                    </div>
                                </th>
                            </tr>
                            : members.map(member => (
                                <tr className="h-14 border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                    {/*<td className="w-4 p-4">*/}
                                    {/*    <div className="flex items-center">*/}
                                    {/*        <input id="checkbox-table-search-1" type="checkbox"*/}
                                    {/*               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>*/}
                                    {/*        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>*/}
                                    {/*    </div>*/}
                                    {/*</td>*/}
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="w-10 h-10"
                                             src={
                                                 member.img_url || 'https://ui-avatars.com/api/?name=' + member.name + '&background=random&color=fff'
                                             } alt={member.name}/>
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">{member.name}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        {member.phone}
                                    </td>
                                    <td className="px-6 py-4">
                                        {member.role === "manager" ? (
                                            "អ្នកគ្រប់គ្រង"
                                        ) : member.role === "sale" ? (
                                            "អ្នកលក់"
                                        ) : (
                                            "សមាជិក"
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setUpdateId(member.id);
                                                setOpenModalAddItem(true);
                                                setData({
                                                    name: member.name,
                                                    role: member.role,
                                                    phone: member.phone,
                                                    password: "",
                                                    image: null
                                                });
                                                if (member.img_url) {
                                                    setImageURL(member.img_url);
                                                    setIsImage(true);
                                                }
                                            }}
                                            className="pl-1 font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            កែប្រែ
                                        </button>
                                        <button
                                            className="pl-3 font-medium text-red-600 dark:text-red-500 hover:underline"
                                            onClick={() => {
                                                setDeleteId(member.id);
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
                setItems={setMembers}
                setLoader={setIsLoading}
                url={url}/>

            <FormDialog
                title="សមាជិក"
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
                    title="ឈ្មោះសមាជិក"
                    type="text"
                    id="name"
                    onChange={handleChangeAdd}
                    value={data.name}
                    autoComplete="name"
                    isRequire={true}
                    isValidate={isValidate.name}
                />
                <Select
                    title="តួនាទី"
                    id="role"
                    onChange={handleChangeAdd}
                    value={data.role}
                    selectOptions={
                        roles.map(role => ({
                            id: role,
                            name: role === "manager" ? "អ្នកគ្រប់គ្រង" : role === "sale" ? "អ្នកលក់" : "សមាជិក"
                        }))
                    }
                    isRequire={true}
                    isValidate={isValidate.role}
                />
                <Input
                    title="លេខទូរស័ព្ទ"
                    type="text"
                    id="phone"
                    onChange={handleChangeAdd}
                    value={data.phone}
                    autoComplete="phone"
                    isRequire={true}
                    isValidate={isValidate.phone}
                />
                <Input
                    title="ពាក្យសម្ងាត់"
                    type="password"
                    id="password"
                    onChange={handleChangeAdd}
                    value={data.password}
                    autoComplete="password"
                    isRequire={true}
                    isValidate={isValidate.password}
                />
            </FormDialog>
            <DeleteDialog
                title="សមាជិក"
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