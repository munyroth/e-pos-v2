import React from "react";

export default function Filter(props) {
    const {
        title,
        id,
        onChange,
        value,
        selectOptions,
        isHasNon
    } = props

    return (
        <div>
            {title && <label htmlFor={id}
                             className="mb-2 font-medium leading-6 text-gray-900 dark:text-white">
                {title}
            </label>}
            <div>
                <select
                    onChange={onChange}
                    id={id}
                    name={id}
                    className="select-filter w-32"
                >
                    <option value="all" selected={true}>ទាំងអស់</option>
                    {isHasNon && <option value="0">មិនមាន</option>}
                    {selectOptions.map(item => (
                        <option key={item.id} value={item.id} selected={
                            value === item.id ? 'selected' : null
                        }>{item.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}