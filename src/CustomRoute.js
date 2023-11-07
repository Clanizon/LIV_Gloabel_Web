import React from "react";
import { Route, useHistory } from "react-router-dom";

const CustomRoute = ({ component: Component, currentToken, ...rest }) => {
    let history = useHistory();
    console.log("Current Token:", currentToken);

    const isAuthorized = currentToken ? true : false;
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
