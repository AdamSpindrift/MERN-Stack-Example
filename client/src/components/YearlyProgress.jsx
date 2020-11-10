
import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import {navigate} from "hookrouter";
import {XYPlot, XAxis, YAxis, VerticalBarSeriesCanvas, VerticalBarSeries} from "react-vis";
import RVStyles from "react-vis-styles";
// State
import {useSelector, useDispatch} from "react-redux";
import {login} from "../actions/login";
import {setUserName} from "../actions/setusername";
import {setCompany} from "../actions/setcompany";
import {setEmployees} from "../actions/setemployees";
import {logout} from "../actions/logout";
import store from "../store";
require("dotenv").config()


function YearlyProgress() {

  const userName = useSelector(state => state.userName);
  const company = useSelector(state => state.company);
  let employees = useSelector(state => state.employees);
  let isLoggedIn = useSelector(state => state.loggedIn);
  const dispatch = useDispatch();

  const navDashboard = () => {
    store.dispatch (setUserName(userName));
    store.dispatch (setCompany(company));
    store.dispatch (setEmployees(employees));
    store.dispatch(login());
    navigate("/dashboard")
  };

  

  const [data1, setGraph1] = useState([
    {x: "VAT", y:0},
    {x: "PAYE", y:0},
    {x: "Bookeeping", y:0},
    {x: "PTR", y:0},
    {x: "Acc Prod", y:0}, 
  ]);

  const [data2, setGraph2] = useState([
    {x: "VAT", y:0},
    {x: "PAYE", y:0},
    {x: "Book", y:0},
    {x: "PTR", y:0},
    {x: "Acc Prod", y:0},
    
  ]);

  const getEmployees = (async() => {

    axios.post(process.env.REACT_APP_SERVER_ROUTE + "api/allmetrics", {company})
      .then(res => {
        console.log(res.data.message);
        const employees1 = res.data.employees

        employees = employees1

      return (
      store.dispatch (setEmployees(employees1))
      );
    });
  });

  setTimeout(() => {

    getEmployees();

  }, 250000);

  const buildGraph = (emp) => {

    const employees = emp;

    // Calculate VAT Actual
    const vatActual = (employees) => {

      let yearlyVatArray = employees.map((employee, index) => {
        const {
          VATReturn,
          AddVATReturn
        } = employee;

        let yearlyVAT = VATReturn.length + AddVATReturn;
        return (
          yearlyVAT
        )
      });

      let TotalVAT = yearlyVatArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        TotalVAT
      )
    }

    // Calculate VAT Target
    const vatTarget = (employees) => {

      const yearlyVatTArray = employees.map((employee, index) => {
        const {YTargetVATReturn} = employee;

        return (
          YTargetVATReturn
        )
      });

      const totalVatTarget = yearlyVatTArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        totalVatTarget
      )
    };





    // Calculate PAYE Actual
    const payeActual = (employees) => {

      let yearlyPayeArray = employees.map((employee, index) => {
        const {
          PAYE,
          AddPAYE,
        } = employee;
  
        let yearlyPAYE = (PAYE.length + AddPAYE);
        return (
          yearlyPAYE
        )
      });

      const totalPAYE = yearlyPayeArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        totalPAYE
      )
    }

    // Calculate PAYE Target
    const payeTarget = (employees) => {

      let yearlyPayeTArray = employees.map((employee, index) => {
        const {YTargetPAYE} = employee;
  
        return (
          YTargetPAYE
        )
      });

      const totalPayeTarget = yearlyPayeTArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        totalPayeTarget
      )
    };





    // Calculate Bookkeeping Actual
    const bookkeepingActual = (employees) => {

      let yearlyBookkeepingArray = employees.map((employee, index) => {
        const {
          Bookkeeping,
          AddBookkeeping,
        } = employee;
  
        let yearlyBook = (Bookkeeping.length + AddBookkeeping);
        return (
          yearlyBook
        )
      });

      const totalBookkeeping = yearlyBookkeepingArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        totalBookkeeping
      )
    }

    // Calculate Bookkeeping Target
    const bookkeepingTarget = (employees) => {

      let yearlyBookkeepingTArray = employees.map((employee, index) => {
        const {YTargetBookkeeping} = employee;
  
        return (
          YTargetBookkeeping
        )
      });

      const totalBookeepingTarget = yearlyBookkeepingTArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        totalBookeepingTarget
      )
    };




    // Calculate Personal Tax Actual
    const personalTaxActual = (employees) => {

      let yearlyPersonalTaxArray = employees.map((employee, index) => {
        const {
          PersonalTaxReturn,
          AddPersonalTaxReturn,
        } = employee;
  
        let yearlyPersonalTax = (PersonalTaxReturn.length + AddPersonalTaxReturn);
        return (
          yearlyPersonalTax
        )
      });

      const totalPersonalTax = yearlyPersonalTaxArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        totalPersonalTax
      )
    }

    // Calculate Personal Tax Target
    const personalTaxTarget = (employees) => {

      let yearlyPersonalTArray = employees.map((employee, index) => {
        const {YTargetPersonalTaxReturn} = employee;
  
        return (
          YTargetPersonalTaxReturn
        )
      });

      const totalPersonalTaxTarget = yearlyPersonalTArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        totalPersonalTaxTarget
      )
    };


    


    // Calculate Accounts Production Actual
    const accountsProductionActual = (employees) => {
    
      let yearlyAccProdArray = employees.map((employee, index) => {
        const {
          AccountsProduction,
          AddAccountsProduction,
        } = employee;

        let yearlyAccProd = (AccountsProduction.length + AddAccountsProduction);
        return (
          yearlyAccProd
        )
      });
    
      const totalAccountsProduction = yearlyAccProdArray.reduce((accumulator, currentValue) => accumulator + currentValue);
   
      return (
        totalAccountsProduction
      )
    }

    // Calculate Accounts Production Target
    const accountsProductionTarget = (employees) => {

      let yearlyAccProdTArray = employees.map((employee, index) => {
        const {YTargetAccountsProduction} = employee;

        return (
          YTargetAccountsProduction
        )
      });

      const totalAccProdTarget = yearlyAccProdTArray.reduce((accumulator, currentValue) => accumulator + currentValue);

      return (
        totalAccProdTarget
      )
    };


    const vatA = vatActual(employees);

    const vatT = vatTarget(employees);

    const payeA = payeActual(employees);

    const payeT = payeTarget(employees);

    const bookA = bookkeepingActual(employees);

    const bookT = bookkeepingTarget(employees);

    const personalA = personalTaxActual(employees);

    const personalT = personalTaxTarget(employees);

    const accA = accountsProductionActual(employees);

    const accT = accountsProductionTarget(employees);

    

    setTimeout(() => {

        setGraph1(() => {
          return([
          {x: "VAT", y:vatA},
          {x: "PAYE", y:payeA},
          {x: "Bookeeping", y:bookA},
          {x: "PTR", y:personalA},
          {x: "Acc Prod", y:accA},
          ])
        });
      }, 100);

      setTimeout(() => {
  
          setGraph2(() => {
            return([
            {x: "VAT", y:vatT},
            {x: "PAYE", y:payeT},
            {x: "Bookeeping", y:bookT},
            {x: "PTR", y:personalT},
            {x: "Acc Prod", y:accT},
            ])
          });
        }, 100);
  };
    



  useEffect(() => {
        
      buildGraph(employees);    
        
  }, []);



  // 5 Minute Loop
  setTimeout(() => {
    navDashboard();
  }, 300000);
  
  

    
  if( isLoggedIn === true) {
  
    return (
      <div className="container-2">
        <img className="company-logo" src="../images/DJCA_Logo_Alpha_1280x720.png" alt="djca Logo"></img>
        <h1>Yearly Metrics</h1>
  
        <div id="vat-chart" className="large-chart">
          <Fragment>
            <RVStyles />
              <XYPlot height={700} width={1500} stackBy="y" xType="ordinal" className="rv-xy-plot__axis__title" >
              <XAxis style={{text: {stroke: "none", fill:"#ffffff", fontWeight: 400, fontSize: 20}}}/>
              <YAxis title="Jobs Completed" style={{text: {stroke: "none", fill:"#ffffff", fontWeight: 400, fontSize: 20}}}/>
              <VerticalBarSeries data={data1} cluster="2" animation color={"#FA7D09"}/>
              <VerticalBarSeries data={data2} cluster="1" animation color={"#035AA6"}/>
              </XYPlot>
          </Fragment>
        </div>
        <br></br>
        <form onSubmit={navDashboard}>
        <button className="home-button" type ="submit">Dashboard</button>
        </form>
        
      </div>);
    
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
    );
    };

  
};


export default YearlyProgress;
