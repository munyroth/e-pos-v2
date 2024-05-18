import React, {useEffect, useRef} from "react";
import classnames from "classnames";

const Input = (
    {
        title,
        type = "text",
        id,
        onChange,
        value,
        placeholder,
        autoComplete,
        selectId,
        selectOptions = [],
        leading,
        leadingWidth,
        isFocus,
        isRequire,
        isValidate,
        className,
        textEnd,
        isShowPassword,
        setShowPassword
    }
) => {
    const ref = useRef(null);

    useEffect(() => {
        if (isFocus) {
            ref.current.focus();
        }
    }, [isFocus]);

    const inputClassNames = classnames(
        "w-full",
        {
            "input": !isValidate,
            "input-error": isValidate,
            [leadingWidth || "pl-7"]: leading,
            "pr-20": selectId,
            "h-full": className,
            "text-end": textEnd,
            "pr-11": isShowPassword != null,
        },
        className
    );

    const renderSvgIcon = () => {
        const commonProps = {
            xmlns: "http://www.w3.org/2000/svg",
            xmlnsXlink: "http://www.w3.org/1999/xlink",
            version: "1.1",
            viewBox: "0 0 512 512",
            className: "w-5 h-5",
            xmlSpace: "preserve"
        };

        if (isShowPassword) {
            return (
                <svg {...commonProps}>
                    <g>
                        <circle cx="256.095" cy="256.095" r="85.333" fill="currentColor"/>
                        <path
                            d="M496.543,201.034C463.455,147.146,388.191,56.735,256.095,56.735S48.735,147.146,15.647,201.034 c-20.862,33.743-20.862,76.379,0,110.123c33.088,53.888,108.352,144.299,240.448,144.299s207.36-90.411,240.448-144.299 C517.405,277.413,517.405,234.777,496.543,201.034z M256.095,384.095c-70.692,0-128-57.308-128-128s57.308-128,128-128 s128,57.308,128,128C384.024,326.758,326.758,384.024,256.095,384.095z"
                            fill="currentColor"
                        />
                    </g>
                </svg>
            );
        }

        return (
            <svg {...commonProps}>
                <g>
                    <path
                        d="M496.543,200.771c-19.259-31.537-43.552-59.707-71.915-83.392l59.733-59.733c8.185-8.475,7.95-21.98-0.525-30.165 c-8.267-7.985-21.374-7.985-29.641,0l-64.96,65.045c-40.269-23.918-86.306-36.385-133.141-36.053 c-132.075,0-207.339,90.411-240.448,144.299c-20.862,33.743-20.862,76.379,0,110.123c19.259,31.537,43.552,59.707,71.915,83.392 l-59.733,59.733c-8.475,8.185-8.71,21.691-0.525,30.165c8.185,8.475,21.691,8.71,30.165,0.525c0.178-0.172,0.353-0.347,0.525-0.525 l65.109-65.109c40.219,23.915,86.201,36.402,132.992,36.117c132.075,0,207.339-90.411,240.448-144.299 C517.405,277.151,517.405,234.515,496.543,200.771z M128.095,255.833c-0.121-70.575,56.992-127.885,127.567-128.006 c26.703-0.046,52.75,8.275,74.481,23.793l-30.976,30.976c-13.004-7.842-27.887-12.022-43.072-12.096 c-47.128,0-85.333,38.205-85.333,85.333c0.074,15.185,4.254,30.068,12.096,43.072l-30.976,30.976 C136.414,308.288,128.096,282.394,128.095,255.833z M256.095,383.833c-26.561-0.001-52.455-8.319-74.048-23.787l30.976-30.976 c13.004,7.842,27.887,12.022,43.072,12.096c47.128,0,85.333-38.205,85.333-85.333c-0.074-15.185-4.254-30.068-12.096-43.072 l30.976-30.976c41.013,57.434,27.702,137.242-29.732,178.255C308.845,375.558,282.798,383.879,256.095,383.833z"
                        fill="currentColor"
                    />
                </g>
            </svg>
        );
    };

    return !isValidate ? (
        <div className={className}>
            {title && (
                <label htmlFor={id} className="mb-2 font-medium leading-6 text-gray-900 dark:text-white">
                    {title} {isRequire && <span className="text-red-600">*</span>}
                </label>
            )}
            <div className="relative h-full">
                {leading && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm dark:text-gray-200">{leading}</span>
                    </div>
                )}
                <input
                    type={isShowPassword ? "text" : type}
                    id={id}
                    name={id}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    className={inputClassNames}
                    placeholder={placeholder}
                />
                {selectId && (
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <label htmlFor={selectId} className="sr-only">
                            {selectId}
                        </label>
                        <select id={selectId} name={selectId} className="h-full select-input">
                            {selectOptions.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {isShowPassword != null && (
                    <div
                        className="absolute inset-y-0 right-0 px-3 flex items-center leading-5 cursor-pointer text-gray-500 dark:text-gray-200"
                        onClick={() => setShowPassword(!isShowPassword)}
                    >
                        {renderSvgIcon()}
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div>
            <label htmlFor={id} className="font-medium leading-6 text-gray-900 dark:text-white">
                {title} {isRequire && <span className="text-red-600">*</span>}
            </label>
            <div className="relative mt-2">
                {leading && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm dark:text-gray-200">{leading}</span>
                    </div>
                )}
                <input
                    type={isShowPassword ? "text" : type}
                    id={id}
                    name={id}
                    autoComplete={autoComplete}
                    onChange={onChange}
                    ref={ref}
                    className={inputClassNames}
                />
                {selectId && (
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <label htmlFor={selectId} className="sr-only">
                            {selectId}
                        </label>
                        <select id={selectId} name={selectId} className="h-full select-input">
                            {selectOptions.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {isShowPassword != null && (
                    <div
                        className="absolute inset-y-0 right-0 px-3 flex items-center leading-5 cursor-pointer text-gray-500 dark:text-gray-200"
                        onClick={() => setShowPassword(!isShowPassword)}
                    >
                        {renderSvgIcon()}
                    </div>
                )}
            </div>
            {(id === 'password_confirmation')
                ? <div className="mt-2 text-sm text-red-600">ពាក្យសំងាត់មិនដូចគ្នា</div>
                : <div className="mt-2 text-sm text-red-600">សូមបញ្ចូល{title}</div>
            }
        </div>
    );
};

export default Input;