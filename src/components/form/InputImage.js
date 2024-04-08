import React from "react";

export default function InputImage(props) {
    const {
        title,
        id,
        onChange,
        image,
        isImage,
        isRequire,
        isValidate
    } = props
    return (
        (!isValidate)
            ? <div>
                <label htmlFor={id}
                       className="font-medium leading-6 text-gray-900 dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>
                <div className="mt-2 flex items-center justify-center w-full">
                    <div className="w-full h-32">
                        <label htmlFor="image"
                               className="flex items-center justify-center w-full h-full">
                            {isImage ? (
                                <img src={image} alt="image"
                                     className="h-full rounded-lg"/>
                            ) : (
                                <div

                                    className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <svg aria-hidden="true"
                                         className="w-10 h-10 mb-3 text-gray-400"
                                         fill="none"
                                         stroke="currentColor"
                                         viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">ចុចដើម្បីបញ្ចូលរូបភាព</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        JPG or PNG (MAX. 800x400px)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                id={id}
                                name={id}
                                className="hidden" accept=".png, .jpg, .jpeg"
                                onChange={onChange}
                                required
                            />
                        </label>
                    </div>
                </div>
            </div>
            : <div>
                <label htmlFor={id}
                       className="font-medium leading-6 text-gray-900 dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>
                <div className="mt-2 flex items-center justify-center w-full">
                    <div className="w-full h-32">
                        <label htmlFor="image"
                               className="flex items-center justify-center w-full h-full">
                            {isImage ? (
                                <img src={image} alt="image"
                                     className="h-full rounded-lg"/>
                            ) : (
                                <div

                                    className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <svg aria-hidden="true"
                                         className="w-10 h-10 mb-3 text-gray-400"
                                         fill="none"
                                         stroke="currentColor"
                                         viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">ចុចដើម្បីបញ្ចូលរូបភាព</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        JPG or PNG (MAX. 800x400px)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                id={id}
                                name={id}
                                className="hidden" accept=".png, .jpg, .jpeg"
                                onChange={onChange}
                                required
                            />
                        </label>
                    </div>
                </div>
                <div className="mt-2 text-sm text-red-600">សូមបញ្ចូល{title}</div>
            </div>
    )
}