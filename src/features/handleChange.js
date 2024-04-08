const handleChange = (
    e,
    setData,
    setIsValidate,
    setIsImage,
    setImageURL,
) => {
    const {name, value, type, files} = e.target;
    setIsValidate(prevData => {
        return {
            ...prevData,
            [name]: false
        }
    });
    setData(prevFormData => {
        return {
            ...prevFormData,
            [name]: type === "file" ? files[0] : value
        }
    });

    if (files && files[0]) {
        setImageURL(URL.createObjectURL(e.target.files[0]));
        setIsImage(true);
    }
}

export default handleChange;