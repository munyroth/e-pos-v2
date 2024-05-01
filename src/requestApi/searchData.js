import {axiosPrivate} from "../api/axios";

const searchData = async (
    content,
    url,
    setContent,
    setIsLoading,
    setData,
    setMeta,
    params
) => {
    console.log(params);
    setContent(content);
    setIsLoading(true);
    const controller = new AbortController();
    const res = await axiosPrivate.get(url, {
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