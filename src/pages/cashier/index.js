import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CreditCardIcon} from "@heroicons/react/24/outline";

export default function Cashier() {

    const [isModalDelete, setIsModalDelete] = useState(false);
    const cancelButtonRef = useRef(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const data = [
        {
            barcode: 1,
            name: 'a',
            price: 100,
            cost: 100,
            discount: 10,
            tax: 10,
            quantity: 2,
            addedBy: 'roth'
        }, {
            barcode: 2,
            name: 'a',
            price: 100,
            cost: 100,
            discount: 10,
            tax: 10,
            quantity: 2,
            addedBy: 'roth'
        }, {
            barcode: 3,
            name: 'a',
            price: 100,
            cost: 100,
            discount: 10,
            tax: 10,
            quantity: 2,
            addedBy: 'roth'
        }, {
            barcode: 4,
            name: 'a',
            price: 100,
            cost: 100,
            discount: 10,
            tax: 10,
            quantity: 2,
            addedBy: 'roth'
        }, {
            barcode: 5,
            name: 'a',
            price: 100,
            cost: 100,
            discount: 10,
            tax: 10,
            quantity: 2,
            addedBy: 'roth'
        }, {
            barcode: 6,
            name: 'a',
            price: 100,
            cost: 100,
            discount: 10,
            tax: 10,
            quantity: 2,
            addedBy: 'roth'
        }, {
            barcode: 7,
            name: 'a',
            price: 100,
            cost: 100,
            discount: 10,
            tax: 10,
            quantity: 2,
            addedBy: 'roth'
        }, {
            barcode: 8,
            name: 'a',
            price: 100,
            cost: 100,
            discount: 10,
            tax: 10,
            quantity: 2,
            addedBy: 'roth'
        }
    ];

    const [items, setItems] = useState([]);

    const [itemsProcessing, setItemsProcessing] = useState([]);

    const clearSearchRef = useRef(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [totalPriceTax, setTotalPriceTax] = useState(0);

    const handleSearchItem = e => {
        if (e.key === 'Enter') {
            const value = e.target.value;
            const found = items.find(items => {
                return items.barcode === parseInt(value);
            });
            if (found) {
                // eslint-disable-next-line no-unused-vars
                let isExist = false;
                setItemsProcessing(itemsProcessing.map(item => {
                    if (item.barcode === found.barcode) {
                        isExist = true;
                        return {...item, quantity: ++item.quantity, totalPrice: item.price * item.quantity};
                    } else {
                        return item;
                    }
                }));

                if (!isExist) setItemsProcessing([...itemsProcessing, {
                    barcode: found.barcode,
                    name: found.name,
                    price: found.price,
                    discount: found.discount,
                    tax: found.tax,
                    quantity: 1,
                    totalPrice: found.price
                }]);
                clearSearchRef.current.value = '';
            } else {
                clearSearchRef.current.value = '';
            }
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
        return totalPrice + (totalPrice * (totalTax/100));
    }, [totalPrice, totalTax]);

    const date = new Date();
    const dateString = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

    useEffect(() => {
        setItems(data);
        setTotalPrice(sumPrice(itemsProcessing));
        setTotalTax(sumTax(itemsProcessing, itemsProcessing.length));
        setTotalPriceTax(sumTotalPriceTax());
    }, [data, itemsProcessing, sumPrice, sumTax, sumTotalPriceTax]);

    return (
        <>
            <main className="h-fill flex m-2 space-x-2 dark:text-gray-50">
                <section className="flex flex-col items-center w-3/4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-full mt-2 flex justify-between">
                        <div className="ms-3">
                            <div className="flex items-center h-12">លេខវិក្កយបត្រ: 00</div>
                            <div className="flex items-center h-12">កាលបរិច្ឆេទ: {dateString}</div>
                        </div>
                        <div className="me-3">
                            <div className="flex items-center h-12">
                                <label
                                    htmlFor="customer-name-input"
                                    className="w-24">
                                    អតិថិជន:
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="customer-name-input"
                                        id="customer-name-input"
                                        className="block w-64 rounded-md border-0 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder=""
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <label htmlFor="customer-name-select" className="sr-only">
                                            Currency
                                        </label>
                                        <select
                                            id="customer-name-select"
                                            name="customer-name-select"
                                            className="h-full w-0 rounded-md border-0 bg-transparent pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                        >
                                            <option>A</option>
                                            <option>B</option>
                                            <option>C</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center h-12">
                                <label htmlFor="price"
                                       className="w-24">
                                    លេខទូរស័ព្ទ:
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="price"
                                        id="price"
                                        className="block w-64 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-2">
                        <div className="mx-3 h-96 overflow-auto shadow-md rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="sticky top-0 text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="w-24 text-center py-3">
                                        លេខរៀង
                                    </th>
                                    <th scope="col" className="text-center py-3">
                                        ឈ្មោះ
                                    </th>
                                    <th scope="col" className="w-32 text-center py-3">
                                        តម្លៃ
                                    </th>
                                    <th scope="col" className="w-28 text-center py-3">
                                        បរិមាណ
                                    </th>
                                    <th scope="col" className="w-32 text-center py-3">
                                        សរុប
                                    </th>
                                    <th scope="col" className="w-28 text-center py-3">
                                        សកម្មភាព
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    itemsProcessing.map((item, index) =>
                                        {
                                            return (
                                                <tr className="hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600">
                                                    <th scope="row" className="text-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                        {index + 1}
                                                    </th>
                                                    <td className="text-center px-6 py-4 text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </td>
                                                    <td className="text-center px-6 py-4 text-gray-900 dark:text-white">
                                                        {item.price}
                                                    </td>
                                                    <td className="text-center px-6 py-4 text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="text-center px-6 py-4 text-gray-900 dark:text-white">
                                                        {item.totalPrice}
                                                    </td>
                                                    <td className="text-center py-4 text-gray-900">
                                                        <button className="text-red-500">
                                                            លុប
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-auto my-2">
                        <div className="">
                            សរុប: {totalPrice}៛
                        </div>
                        <div className="my-4">
                            ពន្ធ {totalTax}%
                        </div>
                        <div className="">
                            សរុបចុងក្រោយ {totalPriceTax}៛
                        </div>
                    </div>
                </section>
                <section className="flex flex-col w-1/4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <label htmlFor="scan" className="block text-sm font-medium leading-6 text-gray-900"></label>
                        <div className="relative my-2 mx-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">ពិនិត្យ:</span>
                            </div>
                            <input
                                ref={clearSearchRef}
                                type="text"
                                name="scan"
                                id="scan"
                                className="block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onKeyDown={handleSearchItem}
                            />
                        </div>
                    </div>

                    <div className="h-12 ml-2 dark:text-gray-50">
                        ឈ្មោះ
                    </div>
                    <div className="h-12 ml-2 dark:text-gray-50">
                        តម្លៃ
                    </div>
                    <div className="flex items-center h-12 ml-2 dark:text-gray-50">
                        <label
                            htmlFor="customer-name-input"
                            className="w-24">
                            បញ្ចុះតម្លៃ:
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="customer-name-input"
                                id="customer-name-input"
                                className="block w-64 rounded-md border-0 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="flex items-center h-12 ml-2 dark:text-gray-50">
                        <label
                            htmlFor="customer-name-input"
                            className="w-24">
                            បរិមាណ:
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="customer-name-input"
                                id="customer-name-input"
                                className="block w-64 rounded-md border-0 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder=""
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-auto grid grid-cols-4 gap-2 mx-2 my-2 text-3xl">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            1
                        </button>

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            2
                        </button>

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            3
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            លុប
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            4
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            5
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            6
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            AC
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            7
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            8
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            9
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">

                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            .
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            0
                        </button>
                        <button
                            className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setIsModalDelete(true)}
                        >
                            បង់ប្រាក់
                        </button>
                    </div>
                </section>
            </main>

            <Transition.Root show={isModalDelete} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsModalDelete}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <CreditCardIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
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
                                            onClick={() => setIsModalDelete(false)}
                                        >
                                            យល់ព្រម
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setIsModalDelete(false)}
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