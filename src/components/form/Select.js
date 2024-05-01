import React from "react";

export default function Select(props) {
    const {
        title,
        id,
        onChange,
        value,
        selectOptions,
        // isFocus,
        isRequire,
        isValidate
    } = props

    return (
        (!isValidate)
            ? <div>
                {title && <label htmlFor={id}
                                 className="mb-2 font-medium leading-6 text-gray-900 dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>}
                <div>
                    <select
                        onChange={onChange}
                        id={id}
                        name={id}
                        className="select w-full"
                    >
                        <option value="" selected={true} disabled={true}>ជ្រើសរើស{title}</option>
                        {selectOptions.map(item => (
                            <option key={item.id} value={item.id} selected={
                                value === item.id ? 'selected' : null
                            }>{item.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            : <div>
                {title && <label htmlFor={id}
                                 className="mb-2 font-medium leading-6 text-gray-900 dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>}
                <div>
                    <select
                        onChange={onChange}
                        id={id}
                        name={id}
                        className="select-error w-full"
                    >
                        <option value="" selected={true} disabled={true}>ជ្រើសរើស{title}</option>
                        {selectOptions.map(item => (
                            <option key={item.id} value={item.id} selected={
                                value === item.id ? 'selected' : null
                            }>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-2 text-sm text-red-600">សូមជ្រើសរើស{title}</div>
            </div>
    )
}