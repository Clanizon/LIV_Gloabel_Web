const API_URL = "https://api.razolve.com/"

const BASE_URL = API_URL + "api/";

const constants = {
    URL: {
        SIGNIN: BASE_URL + "auth/admin/login",
        ADDUNIT: BASE_URL + "unit",
        // ALL_TICKET_LIST: BASE_URL + "ticketsV2_admin",
        ADD_USER: BASE_URL + "user",
        ALL_Depart_USER: BASE_URL + "user/unit/",
        SIGNUP: BASE_URL + "auth/register",
        ALL_PLANT: BASE_URL + "unit?sort_by=name&",
        ADD_DEPARTMENT: BASE_URL + "department/",
        ALL_DEPARTMENT: BASE_URL + "department/unit/",

        ATTACH_DEPARTMENT: BASE_URL + "department/",
        ATTACH_ESCLATION: BASE_URL + "department/"
    }
}
export default constants