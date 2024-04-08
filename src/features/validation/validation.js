const handleValidation = (
    fields,
    data,
    setIsValidate
) => {
    let isValid = true;

    fields.forEach(field => {
        if (!data[field]) {
            setIsValidate(prevData => ({
                ...prevData,
                [field]: true
            }));
            isValid = false;
        }
    });

    return isValid;
}

export default handleValidation;