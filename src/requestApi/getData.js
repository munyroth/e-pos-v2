import {axiosPrivate} from "../api/axios";

const getData = async (
    controller,
    isMounted,
    url,
    page,
    setData,
    setMeta,
    setIsLoading,
    role
) => {
    const u = role === 'sale' ? url : "/admin" + url;
    const res = await axiosPrivate.get(u, {
        signal: controller.signal,
        params: {
            page: page || 1
        }
    });

    if (isMounted && res.data.status === 200) {
        setData(res.data.data);
        setMeta(res.data.meta);
        setIsLoading(false);
    } else {
        // Handle error
        console.error('Error fetching data on :', url + res.data.message);
    }
}


export default getData;