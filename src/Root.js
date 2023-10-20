import 'react-app-polyfill/ie11';
import React from 'react';
import Main from './Main';
import models from "./models/Models";
import { StoreProvider, createStore, } from "easy-peasy";

const storeModel = createStore(models);

function Root() {
    return (
            <StoreProvider store={storeModel}>
                <Main />
            </StoreProvider>
            )
        }

export default Root;