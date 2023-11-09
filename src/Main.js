import "react-app-polyfill/ie11";
import React from "react";
import App from "./App";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { useStoreState, useStoreActions } from "easy-peasy";
import Login from "./pages/Login";
import "./assets/css/dashboard.css"
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import SignUp from "./pages/SignUp";
import CustomRoute from "./CustomRoute";

function Main() {
  const user = useStoreState((state) => state.loginModel.user);
  const userRole = useStoreState((state) => state.loginModel.userRole);
  console.log("userRole", userRole)
  return (
    <HashRouter>
      <Switch>
        <ScrollToTop>
          {/* <Route exact path="/" component={Login} /> */}


          {/* <Route path="/app" component={App} /> */}
          <Route exact path="/" component={Login} />
          <Route exact path="/sign-up" component={SignUp} />
          <CustomRoute
            path="/app" component={App}
            allowedRoles="Admin"
            currentToken={userRole}
          />


        </ScrollToTop>
      </Switch>
    </HashRouter>
  );
}

export default Main;
