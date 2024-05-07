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
import {useLocation, useNavigate} from "react-router-dom";
import Search from "../../../components/form/Search";

export default function Branches() {
    let shopId = localStorage.getItem('shopId');
    const navigate = useNavigate();
    const location = useLocation();

    let url = '/shop';
    const [content, setContent] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);

    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const cancelModalAddItemRef = useRef(null);
    const [updateId, setUpdateId] = useState(0);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [data, setData] = useState({
        name: "",
        employee_ids: []
    });

    const [isValidate, setIsValidate] = useState({
        name: false,
    });

    // eslint-disable-next-line
    const [contentSearchMember, setContentSearchMember] = useState('');
    const [members, metaMembers, isLoadMembers, setMembers, setMetaMembers, setIsLoadMembers] = useGetDataList('/employee');

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const [shops, meta, isLoading, setShops, setMeta, setIsLoading] = useGetDataList(url, openModalAddItem, openModalDelete);

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
        let d = {
            business_id: shopId,
            name: data.name,
            employee_ids: data.employee_ids
        }
        await postData(url, d, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានបញ្ចូលសាខាដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលបញ្ចូលសាខា');
    }

    const handleUpdate = async id => {
        if (!handleValidation(
            ['name'],
            data,
            setIsValidate
        )) return;
        let d = {
            business_id: shopId,
            name: data.name,
            employee_ids: data.employee_ids
        }
        await postData(`${url}/${id}?_method=PUT`, d, setIsLoadingAdd, setOpenModalAddItem, isEmpty, setIsEmpty, 'បានកែប្រែសាខាដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលកែប្រែសាខា');
    }

    const handleDelete = async id => {
        await deleteData(`${url}/${id}`, setIsLoadingDelete, setOpenModalDelete, 'បានលុបសាខាដោយជោគជ័យ', 'មានបញ្ហាកើតឡើងនៅពេលលុបសាខា')
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
                    employee_ids: []
                });
                setIsValidate({
                    name: false,
                });
                setUpdateId(0);
                setContentSearchMember('');
            }, 200);
        }
    }, [openModalAddItem]);

    return (
        <>
            <div className="h-10 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="me-8">សាខា</h1>
                    <button
                        onClick={() => {
                            setOpenModalAddItem(true);
                        }}
                        type="button"
                        className="button">
                        បន្ថែមសាខា
                    </button>
                </div>

                <Search
                    id="search-branch"
                    placeholder="ស្វែងរកឈ្មោះសាខា"
                    url={url}
                    setContent={setContent}
                    setIsLoading={setIsLoading}
                    setData={setShops}
                    setMeta={setMeta}
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
                            ចំណូលសរុប
                        </th>
                        <th scope="col" className="w-2/12 px-6 py-3">
                            ចំនួនលក់សរុប
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
                                        <span className="">មិនមានសាខា</span>
                                    </div>
                                </th>
                            </tr>
                            : shops.map(shop => (
                                <tr className="h-14 border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
                                >
                                    <th scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        {shop.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        ${parseFloat(shop?.orders_sum_total ?? 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {shop.orders_count}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => {
                                                    navigate(location.state?.path || "" + shop.id);
                                                }}
                                                className="font-medium text-green-600 dark:text-green-500 hover:underline">
                                                មើល
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setUpdateId(shop.id);
                                                    setOpenModalAddItem(true);
                                                    setData({
                                                        name: shop.name,
                                                        employee_ids: shop.employees.map(employee => employee.id)
                                                    });
                                                }}
                                                className="pl-3 font-medium text-blue-600 dark:text-blue-500 hover:underline">
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
                setItems={setShops}
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
                    title="ឈ្មោះសាខា"
                    type="text"
                    id="name"
                    onChange={handleChangeAdd}
                    value={data.name}
                    isValidate={isValidate.name}
                    isRequire={true}
                />

                <div>
                    <div className="mb-2 font-medium leading-6 text-gray-900 dark:text-white">
                        សមាជិក
                    </div>
                    <div className="bg-white rounded-lg shadow w-full dark:bg-gray-700">
                        <Search
                            id="search-member"
                            placeholder="ស្វែងរកឈ្មោះ"
                            url="/employee"
                            setContent={setContentSearchMember}
                            setIsLoading={setIsLoadMembers}
                            setData={setMembers}
                            setMeta={setMetaMembers}
                            className="w-full p-3"
                        />
                        <ul className=" px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownSearchButton">
                            {isLoadMembers
                                ? <Loading/>
                                : metaMembers?.total === 0
                                    ? <li className="p-2">មិនមានសមាជិក</li>
                                    : members.map(member => (
                                        <li key={member.id}>
                                            <label htmlFor={`checkbox-item-${member.id}`}
                                                   className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                                <input
                                                    id={`checkbox-item-${member.id}`}
                                                    type="checkbox"
                                                    value={member.id}
                                                    checked={data.employee_ids.includes(member.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setData({
                                                                ...data,
                                                                employee_ids: [...data.employee_ids, member.id]
                                                            });
                                                        } else {
                                                            setData({
                                                                ...data,
                                                                employee_ids: data.employee_ids.filter(id => id !== member.id)
                                                            });
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                />
                                                <div
                                                    className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                                                    {member.name}
                                                </div>
                                            </label>
                                        </li>
                                    ))
                            }
                        </ul>
                    </div>
                </div>
            </FormDialog>
            <DeleteDialog
                title="សាខា"
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