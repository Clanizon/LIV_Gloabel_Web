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
import SignIn from "./pages/SignIn";

function Main() {
    const isAuthenticated = useStoreState((actions) => actions.tabModel.isAuthenticated);

    const PrivateRoute = ({ component: Component, ...rest }) => {
        
        return (
          <Route
            {...rest}
            render={props =>
              isAuthenticated ? (
                <Component {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        );
      };

    return (
        <HashRouter>
            <Switch>
                <ScrollToTop>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/sign-up" component={SignIn} />
                    {/* <PrivateRoute path="/app" component={App} /> */}
                    <Route path="/app" component={App} />
                </ScrollToTop>
            </Switch>
        </HashRouter>
    );
}

export default Main;
