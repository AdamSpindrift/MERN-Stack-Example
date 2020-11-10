import React, { useState, useEffect } from "react";
import axios from "axios";
import LineChart from "./Generic/LineChart";
import {navigate} from "hookrouter";
import {getDayOfYear, endOfQuarter, eachQuarterOfInterval, startOfYear, endOfYear, getWeek} from "date-fns";
import {useSelector, useDispatch} from "react-redux";
import {login} from "../actions/login";
import {setUserName} from "../actions/setusername";
import {setCompany} from "../actions/setcompany";
import {setEmployees} from "../actions/setemployees";
import store from "../store";
require("dotenv").config()

function QaurterlyChart () {

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


    const [data, setData] = useState([
        {series: "", values: [{week: 0, jobs: 0},]},
    ]);

    useEffect(() => {
        regenerateData();
    }, []);

    function regenerateData() {
        let chartData = [];

        const today = new Date();
        const thisWeek = getWeek(new Date());

        const startQuarters = eachQuarterOfInterval({
            start: startOfYear(today),
            end: endOfYear(today)
        });

        const endQuarters = startQuarters.map(q => endOfQuarter(q));

        const startQuarterDays = startQuarters.map(s => getDayOfYear(s));

        const endQuarterDays = endQuarters.map(e => getDayOfYear(e));

        const todayValue = getDayOfYear(today);

        

        // Initialize Variables

        let vatDates = [];
        let payeDates = [];
        let bookkeepingDates = [];
        let ptrDates = [];
        let accProdDates = [];

        let vatSeriesArray = [];
        let payeSeriesArray = [];
        let bookkeepingSeriesArray = [];
        let ptrSeriesArray = [];
        let accProdSeriesArray = [];

        let vatSeries = {};
        let payeSeries = {};
        let bookkeepingSeries = {};
        let ptrSeries = {};
        let accProdSeries = {};

        let qFirstWeek = 1;
        let qLastWeek = 1;


        // Function for getting data
        const getSeriesData = (employees, qFirstWeek, qLastWeek) => {
            employees.forEach((employee) => {
                const { VATReturn, PAYE, Bookkeeping, PersonalTaxReturn, AccountsProduction } = employee;
                vatDates.push(...VATReturn);
                payeDates.push(...PAYE);
                bookkeepingDates.push(...Bookkeeping);
                ptrDates.push(...PersonalTaxReturn);
                accProdDates.push(...AccountsProduction);
            });

            // Numeric Value of Weeks
            const vatWeeks = vatDates.map(date => getWeek(new Date(date)));
            const vatWeeksRemoveNaN = vatWeeks.filter(item => !Number.isNaN(item));
            const filteredVatWeeks = vatWeeksRemoveNaN.filter(item => item >= qFirstWeek && item <= qLastWeek);

            const payeWeeks = payeDates.map(date => getWeek(new Date(date)));
            const payeWeeksRemoveNaN = payeWeeks.filter(item => !Number.isNaN(item));
            const filteredPayeWeeks = payeWeeksRemoveNaN.filter(item => item >= qFirstWeek && item <= qLastWeek);

            const bookkeepingWeeks = bookkeepingDates.map(date => getWeek(new Date(date)));
            const bookkeepingWeeksRemoveNaN = bookkeepingWeeks.filter(item => !Number.isNaN(item));
            const filteredBookkeepingWeeks = bookkeepingWeeksRemoveNaN.filter(item => item >= qFirstWeek && item <= qLastWeek);

            const ptrWeeks = ptrDates.map(date => getWeek(new Date(date)));
            const ptrWeeksRemoveNaN = ptrWeeks.filter(item => !Number.isNaN(item));
            const filteredPtrWeeks = ptrWeeksRemoveNaN.filter(item => item >= qFirstWeek && item <= qLastWeek);

            const accProdWeeks = accProdDates.map(date => getWeek(new Date(date)));
            const accProdWeeksRemoveNaN = accProdWeeks.filter(item => !Number.isNaN(item));
            const filteredAccProdWeeks = accProdWeeksRemoveNaN.filter(item => item >= qFirstWeek && item <= qLastWeek);

            // Define x axis
            const xAxis = [];

            for (let i = qFirstWeek; i <= qLastWeek; i++) {
                xAxis.push([i]);
            };

            let accumulatedTotalVAT = 0;
            let axisAccumulatorVat = 0;

            for (let i = qFirstWeek; i <= qLastWeek; i++) {

                const weekArrayVat = filteredVatWeeks.filter(week => week == xAxis[axisAccumulatorVat] );

                const vatValue = accumulatedTotalVAT + weekArrayVat.length;

                vatSeriesArray.push({week: xAxis[axisAccumulatorVat], jobs: vatValue});

                accumulatedTotalVAT = vatValue;
                axisAccumulatorVat = (axisAccumulatorVat + 1);
            };

            // Accumulate PAYE Values

            let accumulatedTotalPAYE = 0;
            let axisAccumulatorPAYE = 0

            for (let i = qFirstWeek; i <= qLastWeek; i++) {

                const weekArrayPAYE = filteredPayeWeeks.filter(week => week == xAxis[axisAccumulatorPAYE] );

                const PAYEValue = accumulatedTotalPAYE + weekArrayPAYE.length;

                payeSeriesArray.push({week: xAxis[axisAccumulatorPAYE], jobs: PAYEValue});

                accumulatedTotalPAYE = PAYEValue;
                axisAccumulatorPAYE = (axisAccumulatorPAYE + 1);
            };

            // Accumulate Bookkeeping Values

            let accumulatedTotalBookkeeping = 0;
            let axisAccumulatorBookkeeping = 0;

            for (let i = qFirstWeek; i <= qLastWeek; i++) {

                const weekArrayBookkeeping = filteredBookkeepingWeeks.filter(week => week == xAxis[axisAccumulatorBookkeeping] );

                const bookkeepingValue = accumulatedTotalBookkeeping + weekArrayBookkeeping.length;

                bookkeepingSeriesArray.push({week: xAxis[axisAccumulatorBookkeeping], jobs: bookkeepingValue});

                accumulatedTotalBookkeeping = bookkeepingValue;
                axisAccumulatorBookkeeping = (axisAccumulatorBookkeeping + 1);
            };

            // Accumulate PTR Values

            let accumulatedTotalPtr = 0;
            let axisAccumulatorPtr = 0;

            for (let i = qFirstWeek; i <= qLastWeek; i++) {

                const weekArrayPtr = filteredPtrWeeks.filter(week => week == xAxis[axisAccumulatorPtr] );

                const ptrValue = accumulatedTotalPtr + weekArrayPtr.length;

                ptrSeriesArray.push({week: xAxis[axisAccumulatorPtr], jobs: ptrValue});

                accumulatedTotalPtr = ptrValue;
                axisAccumulatorPtr = (axisAccumulatorPtr + 1);
            };

            // Accumulate Accounts Production Values

            let accumulatedTotalAccProd = 0;
            let axisAccumulatorAccProd = 0;

            for (let i = qFirstWeek; i <= qLastWeek; i++) {

                const weekArrayAccProd = filteredAccProdWeeks.filter(week => week == xAxis[axisAccumulatorAccProd] );

                const accProdValue = accumulatedTotalAccProd + weekArrayAccProd.length;

                accProdSeriesArray.push({week: xAxis[axisAccumulatorAccProd], jobs: accProdValue});

                accumulatedTotalAccProd = accProdValue;
                axisAccumulatorAccProd = (axisAccumulatorAccProd + 1);
            };

            return (
                xAxis
            )
        };




        // Q1 Logic
        if (todayValue >= startQuarterDays[0] && todayValue <= endQuarterDays[0]) {

            qFirstWeek = getWeek(new Date(startQuarters[0]));
            qLastWeek = getWeek(new Date(endQuarters[0]));

            // Get Data
            const xAxis = getSeriesData(employees, qFirstWeek, qLastWeek);

            // Setup Series Objects
            setTimeout(() => {
                vatSeries = {
                    series: "VAT Returns",
                    values: vatSeriesArray
                };

                console.log("Vat series array is - " + vatSeriesArray);

                payeSeries = {
                    series: "PAYE",
                    values: payeSeriesArray
                };

                bookkeepingSeries = {
                    series: "Bookkeeping",
                    values: bookkeepingSeriesArray
                };

                ptrSeries = {
                    series: "PTR",
                    values: ptrSeriesArray
                };

                accProdSeries = {
                    series: "YE",
                    values: accProdSeriesArray
                };
            }, 25);
            

            // Push Series
            setTimeout(() => {
                chartData.push(vatSeries);
                chartData.push(payeSeries);
                chartData.push(bookkeepingSeries);
                chartData.push(ptrSeries);
                chartData.push(accProdSeries);
            }, 50);


            // Set Chart
            setTimeout(() => {
                
                setData(chartData);
                
            }, 52);
        };

        // Q2 Logic
        if (todayValue >= startQuarterDays[1] && todayValue <= endQuarterDays[1]) {

            qFirstWeek = getWeek(new Date(startQuarters[1]));
            qLastWeek = getWeek(new Date(endQuarters[1]));

            // Get Data
            const xAxis = getSeriesData(employees, qFirstWeek, qLastWeek);

            // Setup Series Objects
            setTimeout(() => {
                vatSeries = {
                    series: "VAT Returns",
                    values: vatSeriesArray
                };

                console.log("Vat series array is - " + vatSeriesArray);

                payeSeries = {
                    series: "PAYE",
                    values: payeSeriesArray
                };

                bookkeepingSeries = {
                    series: "Bookkeeping",
                    values: bookkeepingSeriesArray
                };

                ptrSeries = {
                    series: "PTR",
                    values: ptrSeriesArray
                };

                accProdSeries = {
                    series: "YE",
                    values: accProdSeriesArray
                };
            }, 25);
            

            // Push Series
            setTimeout(() => {
                chartData.push(vatSeries);
                chartData.push(payeSeries);
                chartData.push(bookkeepingSeries);
                chartData.push(ptrSeries);
                chartData.push(accProdSeries);
            }, 50);


            // Set Chart
            setTimeout(() => {
                
                setData(chartData);
                
            }, 52);

        };

        // Q3 Logic
        if (todayValue >= startQuarterDays[2] && todayValue <= endQuarterDays[2]) {

            qFirstWeek = getWeek(new Date(startQuarters[2]));
            qLastWeek = getWeek(new Date(endQuarters[2]));

            // Get Data
            const xAxis = getSeriesData(employees, qFirstWeek, qLastWeek);

            // Setup Series Objects
            setTimeout(() => {
                vatSeries = {
                    series: "VAT Returns",
                    values: vatSeriesArray
                };

                console.log("Vat series array is - " + vatSeriesArray);

                payeSeries = {
                    series: "PAYE",
                    values: payeSeriesArray
                };

                bookkeepingSeries = {
                    series: "Bookkeeping",
                    values: bookkeepingSeriesArray
                };

                ptrSeries = {
                    series: "PTR",
                    values: ptrSeriesArray
                };

                accProdSeries = {
                    series: "YE",
                    values: accProdSeriesArray
                };
            }, 25);
            

            // Push Series
            setTimeout(() => {
                chartData.push(vatSeries);
                chartData.push(payeSeries);
                chartData.push(bookkeepingSeries);
                chartData.push(ptrSeries);
                chartData.push(accProdSeries);
            }, 50);


            // Set Chart
            setTimeout(() => {
                
                setData(chartData);
                
            }, 52);

        };

        // Q4 Logic
        if (todayValue >= startQuarterDays[3] && todayValue <= endQuarterDays[3]) {

            qFirstWeek = getWeek(new Date(startQuarters[3]));
            qLastWeek = 52;

            // Get Data
            const xAxis = getSeriesData(employees, qFirstWeek, qLastWeek);

            // Setup Series Objects
            setTimeout(() => {
                vatSeries = {
                    series: "VAT Returns",
                    values: vatSeriesArray
                };

                console.log("Vat series array is - " + vatSeriesArray);

                payeSeries = {
                    series: "PAYE",
                    values: payeSeriesArray
                };

                bookkeepingSeries = {
                    series: "Bookkeeping",
                    values: bookkeepingSeriesArray
                };

                ptrSeries = {
                    series: "PTR",
                    values: ptrSeriesArray
                };

                accProdSeries = {
                    series: "YE",
                    values: accProdSeriesArray
                };
            }, 25);
            

            // Push Series
            setTimeout(() => {
                chartData.push(vatSeries);
                chartData.push(payeSeries);
                chartData.push(bookkeepingSeries);
                chartData.push(ptrSeries);
                chartData.push(accProdSeries);
            }, 50);


            // Set Chart
            setTimeout(() => {

                setData(chartData);
                
            }, 52);
        };

        
        // Get Employee Data

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



        // 5 Minute Loop
        setTimeout(() => {
            navDashboard();
        }, 300000);


    };


    

    if( isLoggedIn === true) {
        return (
            <div className="container-3">
                <h1>Quarterly Metrics</h1>   
                <LineChart data={data} width={1280} height={720} />
                <br></br>
                <form onSubmit={navDashboard}>
                <button className="home-button" type ="submit">Dashboard</button>
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

export default QaurterlyChart;

