import { action, persist } from "easy-peasy";


const loginModel = persist({
  user: null,

  setUser: action((state, payload) => {
    localStorage.setItem("e-portal-access-token", payload?.access_token);
    state.user = payload;
  }),

})

export default loginModel;
