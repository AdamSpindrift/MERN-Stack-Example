import React, { useState, Fragment, useEffect } from "react";
import {navigate} from "hookrouter";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, VerticalBarSeries} from "react-vis";
import RVStyles from "react-vis-styles";
import {startOfWeek, endOfWeek, subDays, startOfToday, getDayOfYear} from "date-fns";
// State
import {useSelector, useDispatch} from "react-redux";
import {login} from "../actions/login";
import {setUserName} from "../actions/setusername";
import {setCompany} from "../actions/setcompany";
import {setEmployees} from "../actions/setemployees";
import {logout} from "../actions/logout";
import store from "../store";
// Custom Modules
import WelcomeMessage from "./Generic/WelcomeMessage";


function CompanyHome() {
  
  const userName = useSelector(state => state.userName);
  const company = useSelector(state => state.company);
  let employees = useSelector(state => state.employees);
  let isLoggedIn = useSelector(state => state.loggedIn);
  const dispatch = useDispatch();

  // Web Socket Connection
  // const ws = new WebSocket("ws://localhost:9000");
  
  // ws.onopen = function () {
  //   ws.send("Ping");
  // };

  // ws.onmessage = function (e) {
  //   console.log("Recieved Message - " + e.data);
  // };

  const navAddEmployee = () => {
    store.dispatch (setUserName(userName));
    store.dispatch (setCompany(company));
    store.dispatch(login());
    navigate("/addemployee")
  };

  const navWeeklyTargets = () => {
    store.dispatch (setUserName(userName));
    store.dispatch (setCompany(company));
    store.dispatch (setEmployees(employees));
    store.dispatch(login());
    navigate("/weeklytargets")
  };

  const navYearlyProgress = () => {
    store.dispatch (setUserName(userName));
    store.dispatch (setCompany(company));
    store.dispatch (setEmployees(employees));
    store.dispatch(login());
    navigate("/yearlyprogress")
  };

  const navQuarterlyChart = () => {
    store.dispatch (setUserName(userName));
    store.dispatch (setCompany(company));
    store.dispatch (setEmployees(employees));
    store.dispatch(login());
    navigate("/quarterlychart")
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  const tableData = () => {
    return employees.map((employee, index) => {
      const {fName, lName,
        VATReturn,
        PAYE,
        Bookkeeping,
        PersonalTaxReturn,
        AccountsProduction,
        WTargetVATReturn,
        WTargetPAYE,
        WTargetBookkeeping,
        WTargetPersonalTaxReturn,
        WTargetAccountsProduction,
      } = employee;

      // Logic for filtering jobs in the current week
      const date = startOfToday();
      const sunday = startOfWeek(date);
      const saturday = endOfWeek(date);

      // subDays(saturday, 1);

      const end = saturday;
      const start = sunday;
      const startDay = getDayOfYear(start);
      const endDay = getDayOfYear(end);

      const dayOfYear = (e) => {
        const reFormat = new Date(e);
        const d = reFormat.getDate();
        const m = reFormat.getMonth();
        const y = reFormat.getFullYear();

        const format = getDayOfYear(new Date(y, m, d));
        return(format);
      };

      const VATDays = VATReturn.map(a => dayOfYear(a));
      const thisWeeksVAT = VATDays.filter(a => a >= startDay && a <= endDay);

      const PAYEDays = PAYE.map(a => dayOfYear(a));
      const thisWeeksPAYE = PAYEDays.filter(a => a >= startDay && a <= endDay);

      const BookkeepingDays = Bookkeeping.map(a => dayOfYear(a));
      const thisWeeksBookkeeping = BookkeepingDays.filter(a => a >= startDay && a <= endDay);

      const PersonalTaxReturnDays = PersonalTaxReturn.map(a => dayOfYear(a));
      const thisWeeksPersonalTaxReturn = PersonalTaxReturnDays.filter(a => a >= startDay && a <= endDay);

      const AccountsProductionDays = AccountsProduction.map(a => dayOfYear(a));
      const thisWeeksAccountsProduction = AccountsProductionDays.filter(a => a >= startDay && a <= endDay);

      let weeklyVAT = thisWeeksVAT.length;
      let weeklyPAYE = thisWeeksPAYE.length;
      let weeklyBookkeeping = thisWeeksBookkeeping.length;
      let weeklyPersonalTaxReturn = thisWeeksPersonalTaxReturn.length;
      let weeklyAccountsProduction = thisWeeksAccountsProduction.length;
      
      // css classes for rows
      let rowClass = "";
      if (index % 2 === 0){
        rowClass= "evenRow";
      } else {
        rowClass= "oddRow";
      };

      let VatDifference = (weeklyVAT - WTargetVATReturn);
      let payeDifference = (weeklyPAYE - WTargetPAYE);
      let bookDifference = (weeklyBookkeeping - WTargetBookkeeping);
      let ptrDifference = (weeklyPersonalTaxReturn - WTargetPersonalTaxReturn);
      let accProdDifference = (weeklyAccountsProduction - WTargetAccountsProduction);

      let wVat = "";
      let wTVat = "";
      let wVatDif = "";
      let wPAYE = "";
      let wTPAYE = "";
      let wPAYEDif = "";
      let wBook = "";
      let wTBook = "";
      let wBookDif = "";
      let wPTR = "";
      let wTPTR = "";
      let wPTRDif = "";
      let wAccProd = "";
      let wTAccProd = "";
      let wAccProdDif = "";
      
      // Style Numbers
      if (weeklyVAT === 0) {wVat = "table-0-value"};
      if (WTargetVATReturn === 0) {wTVat = "table-0-value"};
      if (VatDifference >= 0) {wVatDif = "table-pos-value"};
      if (VatDifference < 0) {wVatDif = "table-neg-value"};

      if (weeklyPAYE === 0) {wPAYE = "table-0-value"};
      if (WTargetPAYE === 0) {wTPAYE = "table-0-value"}; 
      if (payeDifference >= 0) {wPAYEDif = "table-pos-value"};
      if (payeDifference < 0) {wPAYEDif = "table-neg-value"};

      if (weeklyBookkeeping === 0) {wBook = "table-0-value"};
      if (WTargetBookkeeping === 0) {wTBook = "table-0-value"}; 
      if (bookDifference >= 0) {wBookDif = "table-pos-value"};
      if (bookDifference < 0) {wBookDif = "table-neg-value"};

      if (weeklyBookkeeping === 0) {wBook = "table-0-value"};
      if (WTargetBookkeeping === 0) {wTBook = "table-0-value"}; 
      if (bookDifference >= 0) {wBookDif = "table-pos-value"};
      if (bookDifference < 0) {wBookDif = "table-neg-value"};

      if (weeklyPersonalTaxReturn === 0) {wPTR = "table-0-value"};
      if (WTargetPersonalTaxReturn === 0) {wTPTR = "table-0-value"}; 
      if (ptrDifference >= 0) {wPTRDif = "table-pos-value"};
      if (ptrDifference < 0) {wPTRDif = "table-neg-value"};

      if (weeklyAccountsProduction === 0) {wAccProd = "table-0-value"};
      if (WTargetAccountsProduction === 0) {wTAccProd = "table-0-value"}; 
      if (accProdDifference >= 0) {wAccProdDif = "table-pos-value"};
      if (accProdDifference < 0) {wAccProdDif = "table-neg-value"};

      return (
        <tr key={index} className={rowClass}>
          <td>{fName}</td>
          <td>{lName}</td>
          <td className={wVat}>{weeklyVAT}</td>
          <td className={wTVat}>{WTargetVATReturn}</td>
          <td className={wVatDif}>{VatDifference}</td>
          <td className={wPAYE}>{weeklyPAYE}</td>
          <td className={wTPAYE}>{WTargetPAYE}</td>
          <td className={wPAYEDif}>{payeDifference}</td>
          <td className={wBook}>{weeklyBookkeeping}</td>
          <td className={wTBook}>{WTargetBookkeeping}</td>
          <td className={wBookDif}>{bookDifference}</td>
          <td className={wPTR}>{weeklyPersonalTaxReturn}</td>
          <td className={wTPTR}>{WTargetPersonalTaxReturn}</td>
          <td className={wPTRDif}>{ptrDifference}</td>
          <td className={wAccProd}>{weeklyAccountsProduction}</td>
          <td className={wTAccProd}>{WTargetAccountsProduction}</td>
          <td className={wAccProdDif}>{accProdDifference}</td>
        </tr>
      )
    })
  }

   // 5 Minute Loop
   setTimeout(() => {
    navQuarterlyChart();
  }, 300000)

   

  if( isLoggedIn === true) {
  
    return (
      <div className="container-2">

        
          <img className="company-logo" src="../images/DJCA_Logo_Alpha_1280x720.png" alt="djca Logo"></img>
          <WelcomeMessage />
          <h2>This Weeks Metrics</h2>


        <div className="container-2">
          <table id="employeetable" className="employeeTable">
            <tbody>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>VAT</th>
                <th>VAT Target</th>
                <th>VAT +/-</th>
                <th>PAYE</th>
                <th>PAYE Target</th>
                <th>PAYE +/-</th>
                <th>Bookkeeping</th>
                <th>Bookeeping Target</th>
                <th>Book +/-</th>
                <th>PTR</th>
                <th>PTR Target</th>
                <th>PTR +/-</th>
                <th>Acc Prod</th>
                <th>Acc Prod Target</th>
                <th>Acc Prod +/-</th>
              </tr>
              {tableData()}
            </tbody>
                    
          </table>
        </div>


        <div className="metricsNav">

            <form onSubmit={navWeeklyTargets}>
              <button className="home-button" type ="submit">Targets</button>
            </form>

            <form onSubmit={navAddEmployee}>
              <button className="home-button" type ="submit">Employees</button>
            </form>

            <form onSubmit={navQuarterlyChart}>
              <button className="home-button" type ="submit">Quarterly Progress</button>
            </form>

            <form onSubmit={handleLogout}>
            <button className="home-button" type="submit" name="submit">Logout</button>
            </form>
          </div>

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

export default CompanyHome;
