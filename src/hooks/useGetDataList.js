import {useEffect, useState} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "./useAuth";

const useGetDataList = (url, openModalAdd, openModalDelete) => {
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({
        'page': 1,
        'size': 10,
        'total': 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const fetchData = async () => {
            let u = auth.role === 'admin' ? '/admin' + url : url;
            try {
                const res = await axiosPrivate.get(u, {
                    signal: controller.signal,
                    params: {
                        page: meta.page,
                    }
                });
                if (isMounted) {
                    setData(res.data.data);
                    setMeta(res.data.meta);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error
            }
        };

        if (!openModalAdd && !openModalDelete) {
            fetchData().then(r => r);
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [url, meta.page, axiosPrivate, openModalAdd, openModalDelete]);

    return [data, meta, isLoading, setData, setMeta, setIsLoading];
};

export default useGetDataList;
