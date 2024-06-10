import {useEffect, useState} from 'react';
import useAxiosPrivate from 'hooks/useAxiosPrivate';
import useAuth from "./useAuth";

const useGetDataObject = (url) => {
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const fetchData = async () => {
            try {
                let u = auth.role === 'admin' ? '/admin' + url : url;
                const res = await axiosPrivate.get(u, {
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
    }, [url, axiosPrivate, auth.role]);

    return [data, isLoading, setData, setIsLoading];
};

export default useGetDataObject;
