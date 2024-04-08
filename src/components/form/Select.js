import React from "react";

export default function Select(props) {
    const {
        title,
        id,
        onChange,
        value,
        selectOptions,
        isFocus,
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
                <div className="mt-2">
                    <select
                        onChange={onChange}
                        id={id}
                        name={id}
                        className="select w-full"
                    >
                        {selectOptions.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            : <div>
                <label htmlFor={id}
                       className="font-medium leading-6 text-gray-900 dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>
                <div className="mt-2">
                    <select
                        onChange={onChange}
                        id={id}
                        name={id}
                        className="select w-full"
                    >
                        {selectOptions.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-2 text-sm text-red-600">សូមជ្រើសរើស{title}</div>
            </div>
    )
}