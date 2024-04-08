import {axiosPrivate} from "../api/axios";

const searchData = async (
    e,
    url,
    setContent,
    setIsLoading,
    setData,
    setMeta,
) => {
    setContent(e.target.value);
    setIsLoading(true);
    const controller = new AbortController();
    const res = await axiosPrivate.get(url, {
        signal: controller.signal,
        params: {
            content: e.target.value,
            page: 1
        }
    });
    setData(res.data.data);
    setMeta(res.data.meta);
    setIsLoading(false);
}

export default searchData;