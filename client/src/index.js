import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import Favicon from "react-favicon";
import App from "./components/App";
import { Provider } from "react-redux";
import store from "./store";
// Environment Variables
require('dotenv').config();




ReactDOM.render(
    <Provider store = {store}>
        <Favicon url = "https://spindriftuploads.s3.eu-west-2.amazonaws.com/favicon.ico" />
        <App />
    </Provider>
    , document.getElementById("root"));
