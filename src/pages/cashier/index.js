import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {CreditCardIcon} from "@heroicons/react/24/outline";
import useGetDataList from "../../hooks/useGetDataList";
import BaseDialog from "../../components/dialog";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Input from "../../components/form/Input";
import handleChange from "../../features/handleChange";
import handleValidation from "../../features/validation/validation";

export default function Cashier() {
    const axiosPrivate = useAxiosPrivate();

    let url = '/product';
    // eslint-disable-next-line
    const [products, meta, isLoading] = useGetDataList(url);

    const [isModalPayment, setIsModalPayment] = useState(false);
    const cancelButtonRef = useRef(null);

    const [itemsProcessing, setItemsProcessing] = useState([]);

    const clearSearchRef = useRef(null);

    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [returnUsd, setReturnUsd] = useState(0);
    const [payment, setPayment] = useState({
        receive: '',
    });

    const [isValidate, setIsValidate] = useState({
        receive: false,
        return: false
    });

    const addToCart = (productId, isBarcode) => {
        const product = products.find(items => {
            if (isBarcode) return items.barcode === productId;
            else return items.id === productId;
        });
        if (product) {
            let isExist = false;
            setItemsProcessing(itemsProcessing.map(item => {
                if (item.product_id === product.id) {
                    isExist = true;
                    return {...item, qty: ++item.qty, totalPrice: item.price * item.qty};
                } else {
                    return item;
                }
            }));

            if (!isExist) setItemsProcessing([...itemsProcessing, {
                product_id: product.id,
                barcode: product.barcode,
                name_kh: product.name_kh,
                img_url: product.img_url,
                price: product.price,
                discount: 0,
                discount_type: 'value',
                qty: 1,
                totalPrice: product.price
            }]);
        }
    }

    const removeFromCart = (id) => {
        setItemsProcessing(itemsProcessing.filter(item => item.id !== id));
    }

    const handleSearchItem = e => {
        if (e.key === 'Enter') {
            const value = e.target.value;
            addToCart(value, true);
            clearSearchRef.current.value = '';
        }
    }

    const handleCheckout = async () => {
        if (!handleValidation(
            ['receive'],
            payment,
            setIsValidate
        )) return;
        if (returnUsd < 0) {
            setIsValidate(prevState => ({
                ...prevState,
                return: true
            }));
        } else {
            setIsValidate(prevState => ({
                ...prevState,
                return: false
            }));
            try {
                setIsLoadingCheckout(true);
                const data = {
                    carts: itemsProcessing,
                    received_usd: payment.receive,
                    received_khr: 0
                }
                const res = await axiosPrivate.post('order/pre-checkout', data);

                console.log(res.data)
                if (res.data.data.return_usd === returnUsd) {
                    await handleOrder()
                } else console.log('fail')
            } catch (error) {
                console.error("Failed to checkout:", error);
            }
        }
    }

    const handleOrder = async () => {
        let shopId = localStorage.getItem('shopId');

        try {
            const data = {
                shop_id: shopId,
                received_usd: payment.receive,
                received_khr: 0,
                payment_type: 'cash',
                order_details: itemsProcessing
            }
            const res = await axiosPrivate.post('order', data);

            console.log(res.data)
            setIsModalPayment(false);
        } catch (error) {
            console.error("Failed to order:", error);
        }

        setIsLoadingCheckout(false);
    }

    const sumPrice = useCallback((data) => {
        return (data.length === 0 ? 0 : data[0].totalPrice + sumPrice(data.slice(1)));
    }, []);

    const sumDiscount = useCallback((data) => {
        return (data.length === 0 ? 0 : data[0].discount + sumDiscount(data.slice(1)));
        // if (n === 0) return 0;
        // else if (n === 1) return data[n - 1].discount;
        // else return ((sumDiscount(data, n - 1) * (n - 1) + data[n - 1].discount) / n);
    }, []);

    const sumTotalPrice = useCallback(() => {
        return subtotal - discount;
    }, [subtotal, discount]);

    // const date = new Date();
    // const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

    useEffect(() => {
        // Reset form data when modal is closed
        if (!isModalPayment) {
            // wait for the modal to close
            setTimeout(() => {
                setPayment({
                    receive: '',
                });
                setIsValidate({
                    receive: false,
                    return: false
                });
                setReturnUsd(0);
            }, 200);
        }
    }, [isModalPayment]);

    useEffect(() => {
        setSubtotal(sumPrice(itemsProcessing));
        setDiscount(sumDiscount(itemsProcessing));
        setTotal(sumTotalPrice());
    }, [itemsProcessing, sumPrice, sumDiscount, sumTotalPrice]);

    return (
        <>
            <div className="relative flex flex-col h-full">
                <div className="h-10 mb-4 flex items-center justify-between">
                    <h1 className="">គិតលុយ</h1>
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
                        <input onKeyDown={handleSearchItem}
                               ref={clearSearchRef}
                               type="text"
                               name="scan"
                               id="scan"
                               className="input w-80 pl-10"
                               placeholder="ស្វែងរកបារកូដ"/>
                    </div>
                </div>
                <div className="flex-1 flex space-x-4">
                    <div
                        className="w-3/6 flex flex-col border border-gray-200 rounded-lg shadow sm:p-4 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                                ទំនិញ
                            </h5>
                        </div>
                        <div className="flex-1">
                            <ul role="listitem"
                                className="h-full flex flex-col space-y-4 overflow-y-scroll no-scrollbar">
                                {isLoading
                                    ? <li className="p-3 border border-gray-200 rounded-lg flow-root hover:bg-gray-100">
                                        <div className="pl-3" role="status">
                                            <svg aria-hidden="true"
                                                 className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-main"
                                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"/>
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"/>
                                            </svg>
                                            <span className="">កំពុងផ្ទុក...</span>
                                        </div>
                                    </li>
                                    : products.map(product => (
                                        <li
                                            className="p-3 border border-gray-200 rounded-lg flow-root hover:bg-gray-700"

                                            onClick={() => addToCart(product.id)}
                                        >
                                            <div className="w-full flex items-center">
                                                <div className="text-base flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate dark:text-white">
                                                        ឈ្មោះ: {product.name_kh}
                                                    </p>
                                                    <p className="text-gray-500 truncate dark:text-gray-400">
                                                        បារកូដ: {product.barcode}
                                                    </p>
                                                </div>
                                                <div
                                                    className="text-end text-base font-semibold text-gray-900 truncate dark:text-white">
                                                    <p className="text-2xl">
                                                        ${product.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                    <div
                        className="w-3/6 border border-gray-200 rounded-lg shadow sm:p-4 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                                    កន្ត្រក
                                </h5>
                            </div>

                            <div className="p-4">
                                <div className="flow-root">
                                    <ul className="-my-6 divide-y divide-gray-200">
                                        {itemsProcessing.map((product) => (
                                            <li key={product.id} className="flex py-6">
                                                <div
                                                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                                    <img
                                                        src={product.img_url}
                                                        alt={product.name_kh}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>

                                                <div className="ml-4 flex flex-1 flex-col">
                                                    <div>
                                                        <div
                                                            className="flex justify-between text-base font-medium text-gray-900">
                                                            <h3>
                                                                <a href={product.href}>{product.name_kh}</a>
                                                            </h3>
                                                            <p className="ml-4 text-main">${product.price}</p>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500">{product.barcode}</p>
                                                    </div>
                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                        <p className="text-gray-500">Qty {product.qty}</p>

                                                        <div className="flex">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFromCart(product.id)}
                                                                className="font-medium text-red-500 hover:text-red-600"
                                                            >
                                                                ដកចេញ
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow"></div>
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <p>សរុប</p>
                                <p>${subtotal}</p>
                            </div>
                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <p>បញ្ចុះតម្លៃ</p>
                                <p>${discount}</p>
                            </div>
                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <p>សរុបចុងក្រោយ</p>
                                <p>${total}</p>
                            </div>
                            <div className="mt-6">
                                <button
                                    disabled={itemsProcessing.length === 0}
                                    className={itemsProcessing.length === 0 ? "button-disabled w-full" : "button w-full"}
                                    onClick={() => setIsModalPayment(true)}
                                >
                                    ទូទាត់
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BaseDialog
                icon={<CreditCardIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>}
                title="ការបង់ប្រាក់"
                openModal={isModalPayment}
                setOpenModal={setIsModalPayment}
                cancelModalRef={cancelButtonRef}
                button={<button
                    disabled={isLoadingCheckout ? true : ""}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={() => handleCheckout()}
                >
                    {isLoadingCheckout ? (
                        <>
                            <svg aria-hidden="true" role="status"
                                 className="inline w-4 h-4 mr-1 text-white animate-spin"
                                 viewBox="0 0 100 101"
                                 fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"/>
                            </svg>
                            កំពុងទូទាត់...
                        </>
                    ) : ("យល់ព្រម")}
                </button>}>
                <p className="text-center text-lg text-gray-500 dark:text-gray-200">
                    ទឹកប្រាក់ត្រូវបង់គឺ <span className="text-main font-bold">${total}</span>
                </p>
                <Input
                    title="ទឹកប្រាក់ទទួល"
                    id="receive"
                    onChange={e => {
                        handleChange(
                            e,
                            setPayment,
                            setIsValidate
                        )
                        setReturnUsd(e.target.value - total);
                    }}
                    value={payment.receive}
                    isValidate={isValidate.receive}
                    isRequire={true}
                />
                {isValidate.return && <div className="mt-2 text-sm text-red-600">ទឹកប្រាក់ទទួលមិនគ្រប់គ្រាន់</div>}
                <p className="mt-6 text-center text-lg text-gray-500 dark:text-gray-200">
                    ប្រាក់អាប់ <span className="text-main font-bold">${returnUsd}</span>
                </p>
            </BaseDialog>
        </>
    )
}