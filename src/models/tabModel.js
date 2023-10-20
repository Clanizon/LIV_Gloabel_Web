import { action, persist } from "easy-peasy";


const tabModel = persist({
  activeIndex: 0,
  traineesList: null,
  gameScoreStatus: null,
  detailedGameScoreStatus: null,
  isAuthenticated: false,
  selectedData: null,

  setActiveIndex: action((state, payload) => {
    state.activeIndex = payload;
  }),

  setTraineesList: action((state, payload) => {
    state.traineesList = payload;
  }),

  setGameScoreStatus: action((state, payload) => {
    state.gameScoreStatus = payload;
  }),

  setDetailedGameScoreStatus: action((state, payload) => {
    state.detailedGameScoreStatus = payload;
  }),

  setIsAuthenticated: action((state, payload) => {
    state.isAuthenticated = payload;
  }),

  setSelectedData: action((state, payload) => {
    state.selectedData = payload;
  }),


  ticketdata: null,
  data: null,
  barData: null,
  planStoreData: [],
  selectedUnitId: null,
  termStatus: false,
  departmentLength: null,
  setTicketdata: action((state, payload) => {
    state.ticketdata = payload;
  }),

  setData: action((state, payload) => {
    state.data = payload;
  }),
  setPlanStoreData: action((state, payload) => {
    state.planStoreData = payload;
  }),
  setBarData: action((state, payload) => {
    state.barData = payload;
  }),
  setSelectedUnitId: action((state, payload) => {
    state.selectedUnitId = payload;
  }),
  setTermsStatus: action((state, payload) => {
    state.termStatus = payload;
  }),
  setDepartmentLength: action((state, payload) => {
    state.departmentLength = payload;
  }),
});

export default tabModel;