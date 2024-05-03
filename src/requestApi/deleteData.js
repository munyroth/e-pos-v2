import {axiosPrivate} from "../api/axios";
import toast from "react-hot-toast";

const deleteData = async (
    url,
    setIsLoading,
    setOpenModal,
    successMessage,
    errorMessage
    ) => {
    setIsLoading(true)
    const controller = new AbortController();

    try {
        const res = await axiosPrivate.delete("/admin"+url, {
            signal: controller.signal
        });
        if (res.data.status === 200) {
            setOpenModal(false);
            toast.success(successMessage || 'បានលុបទិន្នន័យដោយជោគជ័យ');
        } else toast.error(res.data.message);
    } catch (err) {
        toast.error(errorMessage || 'មានបញ្ហាកើតឡើងនៅពេលលុបទិន្នន័យ');
    } finally {
        setIsLoading(false);
    }
}

export default deleteData;