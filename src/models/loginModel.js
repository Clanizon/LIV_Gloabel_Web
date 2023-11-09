import { action, persist } from "easy-peasy";
import { UserService } from "../service/UserService ";

let userService = new UserService()
const loginModel = persist({

  user: null,
  userRole: userService.getUser() || 'user',
  setUser: action((state, payload) => {
    localStorage.setItem("e-portal-access-token", payload);
    state.user = payload;
  }),

  setUserRole: action((state, payload) => {
    userService.setUser(payload);
    state.userRole = payload;
  }),
})

export default loginModel;
