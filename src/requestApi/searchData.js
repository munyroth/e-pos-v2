import {axiosPrivate} from "../api/axios";

const searchData = async (
    content,
    url,
    setContent,
    setIsLoading,
    setData,
    setMeta,
    params,
    role
) => {
    setContent(content);
    setIsLoading(true);
    const controller = new AbortController();
    const u = role === 'sale' ? url : "/admin" + url;
    const res = await axiosPrivate.get(u, {
        signal: controller.signal,
        params: {
            content: content,
            page: 1,
            ...params
        }
    });
    setData(res.data.data);
    setMeta(res.data.meta);
    setIsLoading(false);
}

export default searchData;