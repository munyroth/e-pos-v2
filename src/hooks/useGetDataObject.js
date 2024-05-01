import {useEffect, useState} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useGetDataObject = (url) => {
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const fetchData = async () => {
            try {
                const res = await axiosPrivate.get(url, {
                    signal: controller.signal
                });
                if (isMounted) {
                    setData(res.data.data);
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
    }, [url, axiosPrivate]);

    return [data, isLoading, setData, setIsLoading];
};

export default useGetDataObject;
