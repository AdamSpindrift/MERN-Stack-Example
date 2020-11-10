import React, {useState} from "react";
import axios from "axios";
import {navigate} from "hookrouter";
import {useSelector, useDispatch} from "react-redux";
import {login} from "../actions/login";
import {setUserName} from "../actions/setusername";
import {setCompany} from "../actions/setcompany";
import {setEmployees} from "../actions/setemployees";
import {setFName} from "../actions/setemployeefname";
import {setLName} from "../actions/setemployeelname";
import store from "../store";


function EditQuarterlyTarget() {
  
  const userName = useSelector(state => state.userName);
  const company = useSelector(state => state.company);
  let employees = useSelector(state => state.employees);
  let isLoggedIn = useSelector(state => state.loggedIn);
  const fName = useSelector(state => state.fName);
  const dispatch = useDispatch();

  const navDashboard = () => {
    store.dispatch (setUserName(userName));
    store.dispatch (setCompany(company));
    store.dispatch (setEmployees(employees));
    store.dispatch(login());
    navigate("/dashboard")
  };

  
  const filterEmployee = employees.filter(employee => employee.fName === fName);
  const currentEmployee = filterEmployee[0];


  const [target, setTarget] = useState({
    employeefName: currentEmployee.fName,
    employeelName: currentEmployee.lName,
    company: company,
    quarterlyVATTarget: 0,
    quarterlyPAYETarget: 0,
    quarterlyBookkeepingTarget: 0,
    quarterlyPersonalTaxTarget: 0,
    quarterlyAccountsProductionTarget: 0,
  });



  function handleChange(event) {
    const{name, value} = event.target;

    setTarget((prevValue) => {

      return {
        ...prevValue,
        [name]:parseInt(value)
      };
    })
  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post(process.env.REACT_APP_SERVER_ROUTE + "api/editquarterlytarget", {target})
      .then(res => {
        console.log(res);
        console.log(res.data);
        const newEmployees = res.data.employees;

        store.dispatch (setUserName(userName));
        store.dispatch (setCompany(company));
        store.dispatch (setEmployees(newEmployees));
        store.dispatch (login());
        navigate('/quarterlytargets');

      });
  };

  

  if( isLoggedIn === true) {
  
    return (
      <div className="container-2">

        
          <img className="company-logo" src="../images/DJCA_Logo_Alpha_1280x720.png" alt="djca Logo"></img>
          <h1>{fName} Quarterly Targets</h1>
          

          <div className="metricsNav">

            <form onSubmit={navDashboard}>
            <button className="home-button" type="submit" name="submit">Dashboard</button>
            </form>

          </div>

          <form onSubmit={handleSubmit}>
            <label for="VATTarget">Quarterly VAT Target</label>
            <input onChange={handleChange} type="number" value={target.quarterlyVATTarget} name="quarterlyVATTarget" placeholder="quarterly VAT Target" required/>

            <label for="PAYETarget">Quarterly PAYE Target</label>
            <input onChange={handleChange} type="number" value={target.quarterlyPAYETarget} name="quarterlyPAYETarget" placeholder="quarterly PAYE Target" required/>

            <label for="BookeepingTarget">Quarterly Bookkeeping Target</label>
            <input onChange={handleChange} type="number" value={target.quarterlyBookkeepingTarget} name="quarterlyBookkeepingTarget" placeholder="quarterly Bookkeeping Target" required/>

            <label for="PersonalTaxTarget">Quarterly Personal Tax Target</label>
            <input onChange={handleChange} type="number" value={target.quarterlyPersonalTaxTarget} name="quarterlyPersonalTaxTarget" placeholder="quarterly Personal Tax Target" required/>

            <label for="AccountsProductionTarget">Quarterly Accounts Production Target</label>
            <input onChange={handleChange} type="number" value={target.quarterlyAccountsProductionTarget} name="quarterlyAccountsProductionTarget" placeholder="quarterly Accounts Production Target" required/>

            <button className="home-button" type="submit" name="submit">Submit</button>
          </form>
      
      </div>
    )
    } else {
      return (
        <div className="container">
          <img className="login-logo" src="../images/Metrics_Logo.png" alt="Metrics Logo"></img>
          <h1>Metrics</h1>
          <h2>Please Login</h2>

          <a href="/">
            <button className="home-button" type ="submit">Login</button>
          </a>
        </div>
      )
    };

  };

export default EditQuarterlyTarget;
