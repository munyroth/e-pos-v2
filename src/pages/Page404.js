import {Link} from "react-router-dom";

export default function Page404() {
    return (
        <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-indigo-600">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-50">ទំព័រ​មិន​អាច​រក​ឃើញ​បាន</h1>
                <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">សូមទោស,
                    យើង​មិន​អាច​រក​ឃើញ​ទំព័រ​ដែល​អ្នក​កំពុង​ស្វែង​រក។</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="button"
                    >
                        ត្រឡប់​ទៅ​ទំព័រ​ដើម
                    </Link>
                </div>
            </div>
        </main>
    )
}
