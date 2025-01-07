import BaseForm from "../../../components/form";
import {useEffect, useState} from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Loading from "../../../components/loading";
import {useNavigate} from "react-router";
import useAuth from "../../../hooks/useAuth";

export default function Stores() {
    const {auth} = useAuth();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [shop, setShop] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getShop = async () => {
            let url = auth.role === 'admin' ? '/admin/business?is_all=true' : '/shop?is_all=true';
            try {
                const res = await axiosPrivate.get(url, {
                    signal: controller.signal
                });
                if (isMounted) {
                    setShop(res.data.data);
                    setIsLoading(false);
                }
            } catch (err) {
                // Handle error
            }
        }

        getShop().then();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, auth.role]);

    return (
        <BaseForm>
            <ul className="space-y-2 font-medium p-6 md:space-y-6 sm:p-8">
                <div className="text-2xl font-bold text-center dark:text-white">
                    {auth.role === 'admin'
                        ? 'សូមជ្រើសរើសហាងរបស់អ្នក'
                        : 'សូមជ្រើសរើសសាខា'
                    }
                </div>
                <div className="flex items-center justify-center w-full">
                    <div className="h-0.5 w-3/4 bg-gray-300 dark:bg-gray-700"/>
                </div>
                {isLoading
                    ? <Loading/>
                    : shop.map(item => (
                        <li
                            key={item.id}
                            onClick={() => {
                                localStorage.setItem('shopId', item.id);
                                auth.role === 'admin'
                                    ? navigate('/admin/dashboard')
                                    : navigate('/cashier');
                            }}
                            className="cursor-pointer text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full p-2 rounded-lg dark:text-white">
                            {item.name}
                        </li>
                    ))
                }
            </ul>
        </BaseForm>
    );
}
