import React from "react";
import { Route, useHistory } from "react-router-dom";

const CustomRoute = ({ component: Component, allowedRoles, currentToken, ...rest }) => {
    let history = useHistory();
    const isAuthorized = (currentToken == allowedRoles);
    console.log("isAuthorized", isAuthorized)
    return (
        <Route {...rest} render={(props) => (
            isAuthorized
                ? <Component {...props} />
                : history.replace("/")
        )} />
    );
};

export default CustomRoute;
