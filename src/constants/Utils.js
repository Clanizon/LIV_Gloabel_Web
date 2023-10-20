const getHeaders = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
        "x-access-token": localStorage.getItem("e-portal-access-token"),
        "x-access-timezone": userTimeZone,
    }
};

export default getHeaders;