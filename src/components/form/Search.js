import searchData from "../../requestApi/searchData";
import React from "react";

export default function Search(props) {
    const {
        id,
        placeholder,
        url,
        setContent,
        setIsLoading,
        setData,
        setMeta,
        params,
        className = "w-80"
    } = props

    return (
        <div className={className}>
            <label htmlFor={id} className="sr-only"></label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true"
                         fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"></path>
                    </svg>
                </div>
                <input
                    onChange={(e) => searchData(e.target.value, url, setContent, setIsLoading, setData, setMeta, params)}
                    type="text"
                    id={id}
                    className="input w-full pl-10"
                    placeholder={placeholder}/>
            </div>
        </div>
    )
}