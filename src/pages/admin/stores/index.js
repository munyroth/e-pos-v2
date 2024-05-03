import BaseForm from "../../../components/form";
import {useEffect, useState} from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Loading from "../../../components/loading";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function Stores() {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [shop, setShop] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getShop = async () => {
            try {
                const res = await axiosPrivate.get('/admin/business', {
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

        getShop();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate]);

    return (
        <BaseForm>
            <ul className="space-y-2 font-medium p-6 md:space-y-6 sm:p-8">
                {isLoading
                    ? null
                    : shop.map(item => (
                        <li
                            key={item.id}
                            onClick={() => {
                                Cookies.set('shopId', item.id);
                                navigate('/admin/dashboard');
                            }}
                            className="cursor-pointer text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full p-2 rounded-lg dark:text-white">
                            {item.name}
                        </li>
                    ))
                }
            </ul>
            {isLoading && <Loading/>}
        </BaseForm>
    );
}
