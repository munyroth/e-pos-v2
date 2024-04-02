import {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";

export default function BaseDialog(props) {
    const {openModal, setOpenModal, cancelModalDeleteRef, icon, title, button} = props;

    return (
        <Transition.Root show={openModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelModalDeleteRef}
                    onClose={setOpenModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-800 dark:bg-opacity-75"/>
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
                                className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-gray-50 px-6 pt-6 sm:px-8 sm:pt-8 dark:bg-gray-900">
                                    <div className="pb-6 sm:pb-8 flex items-center justify-center">
                                        {icon}
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3"
                                                          className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                                {title}
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                    {props.children}
                                </div>
                                <div
                                    className="flex items-center justify-center bg-gray-50 p-6 sm:flex sm:flex-row-reverse sm:p-8 dark:bg-gray-900">
                                    {button}
                                    <button
                                        type="button"
                                        className="rounded-md bg-white px-4 py-2 mr-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300 dark:ring-gray-700"
                                        onClick={() => setOpenModal(false)}
                                        ref={cancelModalDeleteRef}
                                    >
                                        បោះបង់
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}