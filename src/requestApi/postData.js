import {axiosPrivate} from "../api/axios";
import toast from "react-hot-toast";

const postData = async (
    url,
    data,
    setIsLoading,
    setOpenModal,
    isEmpty,
    setIsEmpty,
    successMessage,
    errorMessage
) => {
    setIsLoading(true);
    const controller = new AbortController();
    try {
        const response = await axiosPrivate.post("/admin"+url, data, {
            signal: controller.signal
        });

        if (response.data.status === 201 || response.data.status === 200) {
            setOpenModal(false);
            isEmpty && setIsEmpty(false);
            toast.success(successMessage || 'បានបញ្ចូលទិន្នន័យដោយជោគជ័យ');
        } else toast.error(response.data.message);
    } catch (error) {
        toast.error(errorMessage || 'មានបញ្ហាកើតឡើងនៅពេលបញ្ចូលទិន្នន័យ');
    } finally {
        setIsLoading(false);
    }
}

export default postData;