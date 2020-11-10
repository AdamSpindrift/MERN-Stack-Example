import invalidPassword from "./invalidPassword"
import userName from "./userName";
import loggedIn from "./isLogged";
import company from "./company";
import employees from "./employees";
import fName from "./fName";
import lName from "./lName";
import {combineReducers} from "redux";

const rootReducers = combineReducers({
    invalidPassword,
    userName,
    loggedIn,
    company,
    employees,
    fName,
    lName
});

export default rootReducers;