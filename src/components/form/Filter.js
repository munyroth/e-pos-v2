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
            <div>
                <select
                    onChange={onChange}
                    id={id}
                    name={id}
                    className="select-filter w-52"
                >
                    <option value="all" selected={true}>{title}៖ ទាំងអស់</option>
                    {isHasNon && <option value="0">{title}៖ មិនមាន</option>}
                    {selectOptions.map(item => (
                        <option key={item.id} value={item.id} selected={
                            value === item.id ? 'selected' : null
                        }>{title}៖ {item.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}