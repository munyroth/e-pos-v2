import Loading from "components/loading";
import React, {useEffect, useRef, useState} from "react";
import useGetDataList from "hooks/useGetDataList";
import InputImage from "components/form/InputImage";
import FormDialog from "components/dialog/FormDialog";
import handleChange from "features/handleChange";
import useAuth from "hooks/useAuth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import handleValidation from "features/validation/validation";
import postData from "requestApi/postData";
import Input from "components/form/Input";
import deleteData from "requestApi/deleteData";
import DeleteDialog from "components/dialog/DeleteDialog";
import {Toaster} from "react-hot-toast";

export default function PaymentMethods(props) {
    const url = '/payment-method';
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const {shopId} = props;

    const PAYMENT_METHODS = {
        'Cash': 'សាច់ប្រាក់',
        'KHQR Photo': 'រូបថតKHQR',
        'Bakong (NBC)': 'ប្រព័ន្ធបាគង',
        'ABA Bank': 'ធនាគារABA',
        'Wing Bank': 'ធនាគារWing',
    }

    const STATUS = {
        'Active': 'សកម្ម',
        'Inactive': 'មិនសកម្ម',
    }

    const CURRENCY_TYPES = {
        'USD': 'usd',
    }

    const [openModalAddItem, setOpenModalAddItem] = useState(false);
    const [openModalAddItemType, setOpenModalAddItemType] = useState(PAYMENT_METHODS.Cash);
    const cancelModalAddItemRef = useRef(null);
    const [updateId, setUpdateId] = useState(0);
    const [bankId, setBankId] = useState(0);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const cancelModalDeleteRef = useRef(null);
    const [deleteId, setDeleteId] = useState(0);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const urlPayments = '/payment-method';
    // eslint-disable-next-line
    const [payments, metaPayments, isLoadingPayments] = useGetDataList(
        urlPayments, openModalAddItem, openModalDelete, {
            shop_id: shopId
        }, ''
    );

    const [isImage, setIsImage] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [data, setData] = useState({
        account_name: "",
        account_number: "",
        image: null
    });

    const [isValidate, setIsValidate] = useState({
        account_name: false,
        account_number: false,
        image: false
    });

    const handleChangeAdd = e => {
        handleChange(
            e,
            setData,
            setIsValidate,
            setIsImage,
            setImageURL,
        )
    }

    const constructFormDataKhqrPhoto = (data, isUpdate) => {
        let formData = new FormData();
        formData.append('shop_id', shopId);
        formData.append('currency_type', CURRENCY_TYPES.USD);
        data.image && formData.append('qr_code_img', data.image);
        isUpdate && formData.append('qr_code_img', 'keep');
        return formData;
    }

    const constructFormDataBank = (data, bankId) => {
        let formData = new FormData();
        formData.append('shop_id', shopId);
        formData.append('currency_type', CURRENCY_TYPES.USD);
        formData.append('bank_id', bankId);
        formData.append('account_name', data.account_name);
        formData.append('account_number', data.account_number);
        return formData;
    }

    const handleSubmit = async () => {
        let formData;
        if (openModalAddItemType === PAYMENT_METHODS["KHQR Photo"]) {
            if (!handleValidation(['image'], data, setIsValidate)) return;
            formData = constructFormDataKhqrPhoto(data);
        } else {
            if (!handleValidation(['account_name', 'account_number'], data, setIsValidate)) return;
            formData = constructFormDataBank(data, bankId);
        }
        await postData(url, formData, setIsLoadingAdd, setOpenModalAddItem);
    }

    const handleUpdate = async id => {
        console.log('update');
    }

    const handleDelete = async id => {
        await deleteData(`${url}/${id}`, setIsLoadingDelete, setOpenModalDelete, 'បានលុបវិធីសាស្រ្តទូទាត់ជោគជ័យ', 'មានបញ្ហាក្នុងការលុបវិធីសាស្រ្តទូទាត់');
    }

    useEffect(() => {
        // Reset form data when modal is closed
        if (!openModalAddItem) {
            // wait for the modal to close
            setTimeout(() => {
                setData({
                    account_name: "",
                    account_number: "",
                    image: null
                });
                setIsValidate({
                    account_name: false,
                    account_number: false,
                    image: false
                });
                setIsImage(false);
                setImageURL("");
                setUpdateId(0);
            }, 200);
        }
    }, [openModalAddItem, url]);

    return (
        <>
            <div className="mt-4 dark:bg-gray-800 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-base text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="w-3/12 px-6 py-3 rounded-l-lg">
                            វិធីសាស្រ្តទូទាត់
                        </th>
                        <th scope="col" className="w-3/12 px-6 py-3">
                            ឈ្មោះគណនី
                        </th>
                        <th scope="col" className="w-3/12 px-6 py-3">
                            លេខគណនី
                        </th>
                        <th scope="col" className="w-1/12 px-6 py-3 text-center">
                            ស្ថានភាព
                        </th>
                        <th scope="col" className="text-center w-2/12 px-6 py-3 rounded-r-lg">
                            សកម្មភាព
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoadingPayments
                        ? null
                        : payments.slice(0, 3).map(payment => (
                            <tr className="h-14 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    <img className="w-10 h-10 rounded-md object-cover"
                                         src={
                                             payment.img_url || 'https://ui-avatars.com/api/?name=' + payment.name + '&background=random&color=fff'
                                         } alt={payment.name}/>
                                    <div className="pl-3">
                                        <div
                                            className="text-base font-semibold">{PAYMENT_METHODS[payment.payment_method]}</div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    {payment.account_name}
                                </td>
                                <td className="px-6 py-4">
                                    {payment.account_number}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {STATUS[payment.status]}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        {payment.payment_method !== 'Cash' ? (
                                            <div className="flex justify-center">
                                                {payment.id === null
                                                    ? <button
                                                        type="button"
                                                        className="button"
                                                        onClick={async () => {
                                                            setOpenModalAddItem(true);
                                                            setOpenModalAddItemType(PAYMENT_METHODS[payment.payment_method]);
                                                            setBankId(payment.bank_id || 0);

                                                            const id = payment.id;
                                                            if (id) {
                                                                setUpdateId(id);

                                                                const controller = new AbortController();
                                                                let isMounted = true;

                                                                try {
                                                                    const url = '/payment-method/' + id;
                                                                    const u = auth.role === 'admin' ? '/admin' + url : url;
                                                                    const res = await axiosPrivate.get(u, {
                                                                        signal: controller.signal
                                                                    });
                                                                    if (isMounted && res.data.status === 200) {
                                                                        if (payment.payment_method === "KHQR Photo") {
                                                                            setImageURL(res.data.data.qr_code_img_url);
                                                                            setIsImage(true);
                                                                        } else {
                                                                            setData({
                                                                                account_name: res.data.data.account_name,
                                                                                account_number: res.data.data.account_number,
                                                                                image: null
                                                                            });
                                                                        }
                                                                    }
                                                                } catch (error) {
                                                                    console.error('Error fetching data:', error);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {payment.payment_method === 'KHQR Photo' ? 'បន្ថែម' : 'ភ្ជាប់គណនី'}
                                                    </button>
                                                    : <button
                                                        type="button"
                                                        className="rounded-md bg-red-600 flex items-center px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                                                        onClick={() => {
                                                            setOpenModalDelete(true)
                                                            setDeleteId(payment.id)
                                                        }}
                                                    >លុប</button>
                                                }
                                            </div>) : null
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isLoadingPayments
                ? <Loading/>
                : null
            }
            <FormDialog
                title="បន្ថែមវិធីសាស្រ្តទូទាត់"
                openModal={openModalAddItem}
                setOpenModal={setOpenModalAddItem}
                cancelModalRef={cancelModalAddItemRef}
                isLoading={isLoadingAdd}
                updateId={updateId}
                handleUpdate={handleUpdate}
                handleAdd={handleSubmit}
            >
                {openModalAddItemType === PAYMENT_METHODS["KHQR Photo"] ? (
                    <InputImage
                        title="រូបភាព"
                        id="image"
                        onChange={handleChangeAdd}
                        image={imageURL}
                        isImage={isImage}
                        isRequire={true}
                        isValidate={isValidate.image}
                    />) : (
                    <>
                        <Input
                            title="ឈ្មោះគណនី"
                            type="text"
                            id="account_name"
                            onChange={handleChangeAdd}
                            value={data.account_name}
                            isFocus={true}
                            isRequire={true}
                            isValidate={isValidate.account_name}
                        />
                        <Input
                            title="លេខគណនី"
                            type="text"
                            id="account_number"
                            onChange={handleChangeAdd}
                            value={data.account_number}
                            isFocus={true}
                            isRequire={true}
                            isValidate={isValidate.account_number}
                        />
                    </>
                )}
            </FormDialog>
            <DeleteDialog
                title="វិធីសាស្រ្តទូទាត់"
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