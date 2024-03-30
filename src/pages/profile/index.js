import {useEffect, useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function Profile() {
    const axiosPrivate = useAxiosPrivate();

    const [user, setUser] = useState();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async  () => {
            try {
                const res = await axiosPrivate.get('/user', {
                    signal: controller.signal
                });
                isMounted && setUser(res.data.data)
            } catch (err) {

            }
        }

        getUser();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    return (
        <div className="p-4">
            <div className="p-4">
                <h3 className="text-base font-semibold leading-7 text-gray-900">ព័ត៌មានទូទៅ</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">ព័ត៌មានអ្នកប្រើប្រាស់</p>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">ឈ្មោះ</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user?.name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">តួនាទី</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user?.role}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">អាសយដ្ឋានអ៊ីម៉ែល</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user?.phone}</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}
