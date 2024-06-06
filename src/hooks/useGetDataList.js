import {useEffect, useState} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "./useAuth";

const useGetDataList = (
    url,
    openModalAdd,
    openModalDelete,
    p
) => {
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({
        'page': 1,
        'size': 10,
        'total': 0
    });
    const [params] = useState(p);
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
                        ...params
                    }
                });
                if (isMounted && res.data.status === 200) {
                    if (res.data.data.length === 0 && meta.page > 1) {
                        setMeta(prevMeta => ({
                            ...res.data.meta,
                            page: prevMeta.page - 1
                        }));
                        return;
                    }
                    setData(res.data.data);
                    setMeta(res.data.meta);
                    setIsLoading(false);
                } else {
                    // Handle error
                    console.error('Error fetching data on :', url + res.data.message);
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
    }, [url, auth.role, axiosPrivate, openModalAdd, openModalDelete, params, meta.page]);

    return [data, meta, isLoading, setData, setMeta, setIsLoading];
};

export default useGetDataList;
