import React, {useEffect, useRef} from "react";
import classnames from "classnames";

const InputQty = (
    {
        title,
        type = "text",
        id,
        onChange,
        value,
        placeholder,
        autoComplete,
        isFocus,
        isRequire,
        isValidate,
        className,
        disabled
    }
) => {
    const ref = useRef(null);

    useEffect(() => {
        if (isFocus) {
            ref.current.focus();
        }
    }, [isFocus]);

    const inputClassNames = classnames(
        "w-full pl-24 pr-10 text-end",
        {
            "input": !isValidate,
            "input-error": isValidate,
            "h-full": className,
        },
        className
    );

    return !isValidate ? (
        <div className={className}>
            {title && (
                <label htmlFor={id} className="mb-2 font-medium leading-6 text-gray-900 dark:text-gray-300">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>
            )}
            <div className="relative h-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm dark:text-gray-200">បរិមាណ:</span>
                </div>
                <div className="absolute inset-y-0 left-16 flex items-center">
                    <button
                        onClick={() => {
                            if (value > 0) {
                                onChange({target: {value: value - 1}});
                            }
                        }}
                        className="button h-1 w-1 p-3">
                        -
                    </button>
                </div>
                <input
                    type={type}
                    id={id}
                    name={id}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    className={inputClassNames}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <button
                        onClick={() => {
                            onChange({target: {value: value + 1}});
                        }}
                        className="button h-1 w-1 p-3">
                        +
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <div>
            <label htmlFor={id} className="font-medium leading-6 text-gray-900 dark:text-gray-300">
                {title} {isRequire && <span className="text-red-600">*</span>}
            </label>
            <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm dark:text-gray-200">បរិមាណ:</span>
                </div>
                <div className="absolute inset-y-0 left-16 flex items-center">
                    <button className="button h-1 w-1 p-3">
                        -
                    </button>
                </div>
                <input
                    type={type}
                    id={id}
                    name={id}
                    autoComplete={autoComplete}
                    onChange={onChange}
                    ref={ref}
                    className={inputClassNames}
                    disabled={disabled}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <button className="button h-1 w-1 p-3">
                        +
                    </button>
                </div>
            </div>
            <div className="mt-2 text-sm text-red-600">សូមបញ្ចូល{title}</div>
        </div>
    );
};

export default InputQty;