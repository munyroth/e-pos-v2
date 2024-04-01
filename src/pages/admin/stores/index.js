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
    const [meta, setMeta] = useState({});
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getShop = async () => {
            try {
                const res = await axiosPrivate.get('/business', {
                    signal: controller.signal
                });
                isMounted && setShop(res.data.data);
                setMeta(res.data.meta);
                setIsLoading(false);
            } catch (err) {

            }
        }

        getShop();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    return (
        <BaseForm>
            <ul className="h-96 space-y-2 font-medium p-6 md:space-y-6 sm:p-8">
                {isLoading
                    ? null
                    : shop.map(item => (
                            <li
                                onClick={
                                    () => {
                                        Cookies.set('shopId', item.id);
                                        navigate('/admin/dashboard')
                                    }
                                }
                                className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center w-full p-2 transition duration-75 rounded-lg group dark:text-whites">
                                {item.name}
                            </li>
                        )
                    )
                }
            </ul>
            {isLoading && (
                <Loading/>
            )}
        </BaseForm>
    )
}