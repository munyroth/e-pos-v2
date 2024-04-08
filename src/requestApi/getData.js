import {axiosPrivate} from "../api/axios";

const getData = async (
    controller,
    isMounted,
    url,
    page,
    setData,
    setMeta,
    setIsLoading
) => {
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
}


export default getData;