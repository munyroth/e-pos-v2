import React, {useEffect, useRef} from "react";

export default function Input(props) {
    const {
        title,
        type,
        id,
        onChange,
        value,
        placeholder,
        autoComplete,
        selectId,
        selectOptions,
        leading,
        isFocus,
        isRequire,
        isValidate
    } = props

    const ref = useRef(null)

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    useEffect(() => {
        isFocus && ref.current.focus();
    }, []);

    return (
        (!isValidate)
            ? <div>
                <label htmlFor={id}
                       className="font-medium leading-6 text-gray-900 dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>
                <div className="relative mt-2">
                    {leading && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm dark:text-gray-200">{leading}</span>
                    </div>}

                    <input
                        type={type || "text"}
                        id={id}
                        name={id}
                        autoComplete={autoComplete}
                        value={value}
                        onChange={onChange}
                        ref={ref}

                        className={classNames(
                            'input w-full',
                            leading ? 'pl-7' : '',
                            selectId ? 'pr-20' : ''
                        )}
                        placeholder={placeholder}
                    />

                    {selectId && <div className="absolute inset-y-0 right-0 flex items-center">
                        <label htmlFor={selectId} className="sr-only">
                            {selectId}
                        </label>
                        <select
                            id={selectId}
                            name={selectId}
                            className="h-full select-input"
                        >
                            {selectOptions.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>}
                </div>
            </div>
            : <div>
                <label htmlFor={id}
                       className="font-medium leading-6 text-gray-900 dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>
                <div className="relative mt-2">
                    {leading && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm dark:text-gray-200">{leading}</span>
                    </div>}

                    <input
                        type={type || "text"}
                        id={id}
                        name={id}
                        autoComplete={autoComplete}
                        onChange={onChange}
                        ref={ref}

                        className={classNames(
                            'input-error w-full',
                            leading ? 'pl-7' : '',
                            selectId ? 'pr-20' : ''
                        )}
                    />

                    {selectId && <div className="absolute inset-y-0 right-0 flex items-center">
                        <label htmlFor={selectId} className="sr-only">
                            {selectId}
                        </label>
                        <select
                            id={selectId}
                            name={selectId}
                            className="h-full select-input"
                        >
                            {selectOptions.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </div>}
                </div>
                <div className="mt-2 text-sm text-red-600">សូមបញ្ចូល{title}</div>
            </div>
    )
}