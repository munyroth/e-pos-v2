import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/20/solid";
import {axiosPrivate} from "../../api/axios";

export default function Pagination(
    {content, meta, setMeta, setItems, setLoader, url}
) {
    let totalPages = Math.ceil(meta.total / meta.size) || 0;

    const searchProduct = async (content, page) => {
        setLoader(true)
        try {
            const res = await axiosPrivate.get("/admin"+url, {
                params: {
                    content,
                    page
                }
            });
            setItems(res.data.data);
            setMeta(res.data.meta);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoader(false);
        }
    }

    const handlePreviousPage = async () => {
        if (meta.page > 1) {
            await searchProduct(content, meta.page - 1);
        }
    };

    const handleNextPage = async () => {
        if (meta.page < totalPages) {
            await searchProduct(content, meta.page + 1);
        }
    };

    const handlePageChange = async (page) => {
        await searchProduct(content, page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = totalPages < 9 ? totalPages : 9;
        const sidePagesToShow = totalPages <= 1 ? 1 : 2;

        let startPage = Math.max(1, meta.page - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = 1; i <= sidePagesToShow; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={i === meta.page
                        ? "relative z-10 inline-flex items-center bg-main px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:hover:bg-gray-600"
                    }
                >
                    {i}
                </button>
            );
        }

        if (startPage > 1) {
            pages.push(
                <span
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              ...
            </span>
            );
        }

        for (let i = startPage + sidePagesToShow; i <= endPage - sidePagesToShow; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={i === meta.page
                        ? "relative z-10 inline-flex items-center bg-main px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:hover:bg-gray-600"
                    }
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages - sidePagesToShow + 1) {
            pages.push(
                <span
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              ...
            </span>
            );
        }

        if (totalPages + sidePagesToShow >= maxPagesToShow && totalPages > 2) {
            for (let i = totalPages - sidePagesToShow + 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={i === meta.page
                            ? "relative z-10 inline-flex items-center bg-main px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:hover:bg-gray-600"
                        }
                    >
                        {i}
                    </button>
                );
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-1 sm:hidden">
                {meta.page === 1
                    ? <></>
                    : <button
                        onClick={handlePreviousPage}
                        className="button"
                    >
                        ថយក្រោយ
                    </button>
                }
                <div className="flex-grow"></div>
                {meta.page === totalPages
                    ? <></>
                    : <button
                        onClick={handleNextPage}
                        className="button"
                    >
                        បន្ទាប់
                    </button>
                }
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-white">
                        ទំព័រទី
                        <span className="font-medium"> {meta.page} </span>
                        នៃទំព័រសរុប
                        <span className="font-medium"> {totalPages} </span>
                        | លទ្ធផលសរុប
                        <span className="font-medium"> {meta.total}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={handlePreviousPage}
                            disabled={meta.page === 1}
                            className={
                                meta.page === 1
                                    ? "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                                    : "relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:hover:bg-gray-600"
                            }
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                        </button>
                        {totalPages > 0 && renderPageNumbers()}
                        <button
                            onClick={handleNextPage}
                            disabled={meta.page === totalPages || totalPages === 0}
                            className={
                                (meta.page === totalPages || totalPages === 0)
                                    ? "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
                                    : "relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:hover:bg-gray-600"
                            }
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )

}