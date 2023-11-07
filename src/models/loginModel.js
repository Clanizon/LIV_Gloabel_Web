import { action, persist } from "easy-peasy";
import { UserService } from "../service/UserService ";

let userService = new UserService()
const loginModel = persist({

  user: userService.getUser() || null,
  setUser: action((state, payload) => {
    localStorage.setItem("e-portal-access-token", payload);
    state.user = payload;
  }),

})

export default loginModel;
