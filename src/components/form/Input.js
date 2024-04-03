import React, {useEffect, useRef} from "react";

export default function Input(props) {
    const {
        title,
        type,
        id,
        onChange,
        value,
        autoComplete,
        isFocus,
        isRequire,
        isValidate
    } = props

    const ref = useRef(null)

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
                <div className="mt-2">
                    <input
                        type={type || "text"}
                        id={id}
                        name={id}
                        onChange={onChange}
                        value={value}
                        autoComplete={autoComplete}
                        ref={ref}

                        className="input w-full"
                    />
                </div>
            </div>
            : <div>
                <label htmlFor={id} className="dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>
                <div className="mt-2">
                    <input
                        type={type || "text"}
                        id={id}
                        name={id}
                        onChange={onChange}
                        ref={ref}

                        className="input-error w-full"
                    />
                </div>
                <div className="mt-2 text-sm text-red-600">សូមបញ្ចូល{title}</div>
            </div>
    )
}