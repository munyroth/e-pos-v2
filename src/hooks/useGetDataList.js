import {useEffect, useState} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useGetDataList = (url, page) => {
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
            try {
                const res = await axiosPrivate.get(url, {
                    signal: controller.signal,
                    params: {
                        page: page || 1
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

        fetchData().then(r => r);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [url, page, axiosPrivate]);

    return [data, meta, isLoading, setData, setMeta, setIsLoading];
};

export default useGetDataList;
