import React, { useState } from "react";
import axios from "axios";
import {navigate} from "hookrouter";
require("dotenv").config()


function Register() {
  const [contact, setContact] = useState({
    fName: "",
    lName: "",
    company: "",
    applicationSelection: "",
    email: "",
    password: "",
    cpassword: "",
  });

  function handleChange(event) {
    const{name, value} = event.target;

    setContact((prevValue) => {

      return {
        ...prevValue,
        [name]:value
      };
    })
  };


  function handleSubmit (event) {
    event.preventDefault();

    axios.post(process.env.REACT_APP_SERVER_ROUTE + "api/newuser", {contact})
      .then(res => {
        console.log(res);
        console.log(res.data);
      });

      axios.post(process.env.REACT_APP_SERVER_ROUTE + "api/newcompany", {contact})
      .then(res => {
        console.log(res);
      });

    navigate('/successregister');
      
    };
  
    

  return (
    <div className="container">
      <img className="login-logo" src="../images/Metrics_Logo.png" alt="Metrics Logo"></img>
      <h1>Metrics</h1>
      <h1>
        Hello {contact.fName} {contact.lName}
      </h1>
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} type="text" value={contact.fName} name="fName" placeholder="First Name" required/>
        <input onChange={handleChange} type="text" value={contact.lName} name="lName" placeholder="Last Name" required/>
        <input onChange={handleChange} type="text" value={contact.company} name="company" placeholder="Company" required/>
        <select onChange={handleChange} type="text" value={contact.application} className="selector" id="applicationSelection" name="applicationSelection" required>
          <label for="applicationSelection">Software Selection</label>
            <option>Default</option>
            <option>Senta</option>
        </select>
        <input onChange={handleChange} type="text" value={contact.email} name="email" placeholder="Email" required/>
        <input onChange={handleChange} type="password" value={contact.password} name="password" placeholder="Password" required/>
        <input onChange={handleChange} type="password" value={contact.cpassword} name="cpassword" placeholder="Confirm Password" required/>
        <button className="main-button" type="submit">Submit</button>
      </form>
    </div>
  );
  };

export default Register;
