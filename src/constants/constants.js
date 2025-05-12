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
        META: BASE_URL + 'meta',
        ATTACH_DEPARTMENT: BASE_URL + "department/",
        ATTACH_ESCLATION: BASE_URL + "department/",
        GET_DEPARTMENT: BASE_URL + "department/",
        DASH_COUNT: BASE_URL + "dashboard/ticket/metric?status=",
        DASH_TABLE: BASE_URL + "dashboard/ticket-filter?status=",
        CHANGE_PWD: BASE_URL + 'auth/admin/password',
        DELETE_USER: BASE_URL + 'user',
        EDIT_USER: BASE_URL + 'user/',
        EXCEL_DOWNLOAD: BASE_URL + 'dashboard/ticket-export?date_from=',
        GET_TIKET_DETAIL: BASE_URL + 'ticket/',
        ADD_TOOLS: BASE_URL + 'meta/tools/attach',
        GET_TOOLS: BASE_URL + 'meta/tools',
        DELETE_TOOLS: BASE_URL + 'meta/tools/detach'
    }
}
export default constants