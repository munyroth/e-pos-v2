import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CreditCardIcon} from "@heroicons/react/24/outline";
import useGetData from "../../hooks/useGetData";

export default function Cashier() {
    let url = '/product';
    const [page] = useState(1);
    const [products, meta, isLoading] = useGetData(url, page);

    const [isModalPayment, setIsModalPayment] = useState(false);
    const cancelButtonRef = useRef(null);

    const [itemsProcessing, setItemsProcessing] = useState([]);

    const clearSearchRef = useRef(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [totalPriceTax, setTotalPriceTax] = useState(0);

    const handleSearchItem = e => {
        if (e.key === 'Enter') {
            const value = e.target.value;
            addToCard(value)
            clearSearchRef.current.value = '';
        }
    }

    const sumPrice = useCallback((data) => {
        return (data.length === 0 ? 0 : data[0].totalPrice + sumPrice(data.slice(1)));
    }, []);

    const sumTax = useCallback((data, n) => {
        if (n === 0) return 0;
        else if (n === 1) return data[n - 1].tax;
        else return ((sumTax(data, n - 1) * (n - 1) + data[n - 1].tax) / n);
    }, []);

    const sumTotalPriceTax = useCallback(() => {
        return totalPrice + (totalPrice * (totalTax / 100));
    }, [totalPrice, totalTax]);

    // const date = new Date();
    // const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

    console.log(meta);
    console.log(totalPriceTax);

    useEffect(() => {
        setTotalPrice(sumPrice(itemsProcessing));
        setTotalTax(sumTax(itemsProcessing, itemsProcessing.length));
        setTotalPriceTax(sumTotalPriceTax());
    }, [itemsProcessing, sumPrice, sumTax, sumTotalPriceTax]);

    const addToCard = (productId) => {
        const product = products.find(items => {
            return items.id === parseInt(productId);
        });
        if (product) {
            let isExist = false;
            setItemsProcessing(itemsProcessing.map(item => {
                if (item.id === product.id) {
                    isExist = true;
                    return {...item, quantity: ++item.quantity, totalPrice: item.price * item.quantity};
                } else {
                    return item;
                }
            }));

            if (!isExist) setItemsProcessing([...itemsProcessing, {
                barcode: product.barcode,
                name_kh: product.name_kh,
                price: product.price,
                discount: product.discount,
                tax: product.tax,
                quantity: 1,
                totalPrice: product.price
            }]);
        }
    }

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
                               placeholder="ស្វែងរក"/>
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

                                            onClick={() => addToCard(product.id)}
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
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                                កន្ត្រក
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
                                    : itemsProcessing.map(product => (
                                        <li
                                            className="p-3 border border-gray-200 rounded-lg flow-root hover:bg-gray-700"
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
                </div>
            </div>
            <Transition.Root show={isModalPayment} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsModalPayment}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div
                                                className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <CreditCardIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3"
                                                              className="text-base font-semibold leading-6 text-gray-900">
                                                    ការបង់ប្រាក់
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        ទឹកប្រាក់ត្រូវបង់គឺ ១០០០០៛
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setIsModalPayment(false)}
                                        >
                                            យល់ព្រម
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setIsModalPayment(false)}
                                            ref={cancelButtonRef}
                                        >
                                            បដិសេដ
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}