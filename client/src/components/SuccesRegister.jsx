import React, { useState } from "react";
import axios from "axios";
import {navigate, useRoutes} from "hookrouter";
import Routes from "./Router";
import {useSelector, useDispatch} from "react-redux";
import {login} from "../actions/login";
import {setUserName} from "../actions/setusername";
import {setCompany} from "../actions/setcompany";
import {setEmployees} from "../actions/setemployees";
import {logout} from "../actions/logout";
import store from "../store";

require("dotenv").config()

function Login() {
  var isLoggedIn = useSelector(state => state.loggedIn);
  const dispatch = useDispatch();

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
            navigate("/");
          }
        });
      };
  
  return (
    <div className="container">
      <img className="login-logo" src="../images/Metrics_Logo.png" alt="Metrics Logo"></img>
      <h1>Metrics</h1>
      <h1>Registration Successful Please Login</h1>
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} type="text" value={user.email} name="email" placeholder="Email" required/>
        <input onChange={handleChange} type="password" value={user.password} name="password" placeholder="Password" required/>
        <button className="main-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;