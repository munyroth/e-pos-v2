import React, {useEffect, useRef, useState} from "react";
import Pagination from "components/pagination";
import Loading from "components/loading";
import handleChange from "features/handleChange";
import handleValidation from "features/validation/validation";
import postData from "requestApi/postData";
import deleteData from "requestApi/deleteData";
import FormDialog from "components/dialog/FormDialog";
import Input from "components/form/Input";
import DeleteDialog from "components/dialog/DeleteDialog";
import {Toaster} from "react-hot-toast";
import InputImage from "components/form/InputImage";
import Select from "components/form/Select";
import useGetDataList from "hooks/useGetDataList";
import Search from "components/form/Search";
import Empty from "components/empty";
import {useNavigate} from "react-router-dom";

export default function Members() {
    const navigate = useNavigate();

    let shopId = localStorage.getItem('shopId');
    let url = '/employee';
    const [roles] = useState([
        "sale",
    ]);

    const [params] = useState({
        business_id: shopId
    });
    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [isShowPassword, setsShowPassword] = useState(false);

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

    const [members, meta, isLoading, setMembers, setMeta, setIsLoading] = useGetDataList(url, openModalAddItem, openModalDelete, params, content);

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
        formData.append('business_id', shopId);
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
        const member = await postData(url, formData, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, null, null, true);
        navigate(`/admin/members/${member.id}`);
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
        await deleteData(`${url}/${id}?business_id=${shopId}`, setIsLoadingDelete, setOpenModalDelete, 'បានលុបសមាជិកដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលលុបទំនិញ')
    }

    useEffect(() => {
        meta?.total === 0 ? setIsEmpty(true) : setIsEmpty(false);
    }, [meta]);

    useEffect(() => {
        // let isMounted = true;
        // const controller = new AbortController();

        // Get roles
        // if (openModalAddItem) {
        //     getData(
        //         controller,
        //         isMounted,
        //         '/role',
        //         0,
        //         setRoles,
        //         null,
        //         null
        //     ).then(r => r).catch(e => e)
        // }

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

        // return () => {
        //     isMounted = false;
        //     controller.abort();
        // }
    }, [openModalAddItem, openModalDelete, url]);

    return (
        <div className="h-full flex flex-col">
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="me-8">សមាជិក</h1>
                    <button
                        onClick={() => {
                            setOpenModalAddItem(true);
                        }}
                        type="button"
                        className="button me-8">
                        បន្ថែមសមាជិក
                    </button>
                </div>

                <Search
                    id="search-member"
                    placeholder="ស្វែងរកឈ្មោះ ឬលេខទូរស័ព្ទសមាជិក"
                    url={url}
                    setContent={setContent}
                    setIsLoading={setIsLoading}
                    setData={setMembers}
                    setMeta={setMeta}
                    params={params}
                />
            </div>
            <div className="dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-4/12 px-6 py-3 rounded-l-lg">
                            ឈ្មោះ
                        </th>
                        <th scope="col" className="w-4/12 px-6 py-3">
                            លេខទូរស័ព្ទ
                        </th>
                        <th scope="col" className="w-2/12 px-6 py-3">
                            តួនាទី
                        </th>
                        <th scope="col" className="text-center w-2/12 px-6 py-3 rounded-r-lg">
                            សកម្មភាព
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading
                        ? null
                        : members.map(member => (
                            <tr className="h-14 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <img className="w-10 h-10 rounded-md"
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
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => {
                                                navigate(`/admin/members/${member.id}`);
                                            }}
                                            className="font-medium text-green-600 dark:text-green-600 hover:underline">
                                            សាខា
                                        </button>
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
                                            className="pl-3 font-medium text-blue-600 dark:text-blue-500 hover:underline">
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
                    ? <Empty title="សមាជិក"/>
                    : <div className="flex-1"></div>
            }
            <Pagination
                content={content}
                meta={meta}
                setMeta={setMeta}
                setItems={setMembers}
                setLoader={setIsLoading}
                params={params}
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
                    isFocus={true}
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
                    isShowPassword={isShowPassword}
                    setShowPassword={setsShowPassword}
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
        </div>
    )
}