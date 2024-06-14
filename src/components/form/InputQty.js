import React, {useEffect, useRef} from "react";
import classnames from "classnames";

const InputQty = (
    {
        type = "text",
        id,
        onChange,
        value,
        placeholder,
        autoComplete,
        isFocus,
        className = "w-28",
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
        "w-full pl-9 pr-9 text-center focus:ring-0 input",
        {
            "h-full": className,
        },
        className
    );

    return (
        <div className={className}>
            <div className="relative h-full">
                <div className="absolute inset-y-0.5 left-0.5 flex items-center">
                    <button
                        onClick={() => {
                            if (value > 1) {
                                onChange({target: {value: value - 1}});
                            }
                        }}
                        className="button h-full w-6 rounded-md">
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
                <div className="absolute inset-y-0.5 right-0.5 flex items-center">
                    <button
                        onClick={() => {
                            onChange({target: {value: value + 1}});
                        }}
                        className="button h-full w-6 rounded-md">
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputQty;