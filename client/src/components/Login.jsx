import React, { useState } from "react";
import axios from "axios";
import {navigate} from "hookrouter";
import {useSelector, useDispatch} from "react-redux";
import {login} from "../actions/login";
import {invalidPassword} from "../actions/invalidPassword";
import {setUserName} from "../actions/setusername";
import {setCompany} from "../actions/setcompany";
import {setEmployees} from "../actions/setemployees";
import store from "../store";
// Custom Modules
import WelcomeMessage from "./Generic/WelcomeMessage";
require("dotenv").config()

const mapStateToProps = (state) => {
  return {
    number: state.number
  };
}

function Login() {
  var isLoggedIn = useSelector(state => state.loggedIn);
  const dispatch = useDispatch();

  const invalidPassword1 = useSelector(state => state.invalidPassword);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const{name, value} = event.target;

    setUser((prevValue) => {

      return {
        ...prevValue,
        [name]:value
      };
    })
  };

  function handleSubmit (event) {
    event.preventDefault();

    axios.post(process.env.REACT_APP_SERVER_ROUTE + "api/login", {user})
      .then(res => {
        console.log(res.data.message);
        const userData = res.data.user;
        const employees = res.data.employees

        if(userData.auth === true){
          store.dispatch (setUserName(userData.fName));
          store.dispatch (setCompany(userData.company));
          store.dispatch (setEmployees(employees));
          store.dispatch(login());
          navigate("/dashboard");
        } else {
          store.dispatch (invalidPassword());
          navigate("/");
        }
      });
    };

  return (
    <div className="container">
      <img className="login-logo" src="../images/Metrics_Logo.png" alt="Metrics Logo"></img>
      <h1>Metrics</h1>
      <WelcomeMessage />

      {invalidPassword1 === true ? <h3 className="error-text">Invalid Credentials</h3> : <h3></h3>}

      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} type="text" value={user.email} name="email" placeholder="Email" required/>
        <input onChange={handleChange} type="password" value={user.password} name="password" placeholder="Password" required/>
        <button className="main-button" type="submit" name="submit">Login</button>
      </form>

      <a href="/register">
      <button className="main-button" type ="submit">Register</button>
      </a>
    </div>
  );
};

export default Login;
