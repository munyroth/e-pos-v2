export default function BaseForm(
    {children}
) {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-16 w-auto"
                    src="https://res.cloudinary.com/dlb5onqd6/image/upload/v1673491430/data/logo_ioru7h.png"
                    alt="ePOS"
                />
            </div>
            <div
                className="mt-10 w-full bg-white rounded-lg shadow dark:border sm:mx-auto sm:w-full sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                {children}
            </div>
        </div>
    )
}