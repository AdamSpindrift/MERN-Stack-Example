import React from "react";
import Login from './Login';
import Register from './Register';
import SuccessRegister from './SuccesRegister';
import Dashboard from './Dashboard';
import AddEmployee from './AddEmployee';
import AddCompany from './AddCompany';
import WeeklyTargets from './WeeklyTargets';
import EditWeeklyTarget from './EditWeeklyTarget';
import QuarterlyTargets from './QuarterlyTargets';
import EditQuarterlyTarget from './EditQuarterlyTarget';
import EditEmployeeMetrics from './EditEmployeeMetrics';
import AdjustEmployeeMetrics from './AdjustEmployeeMetrics';
import QuarterlyChart from "./QuarterlyChart";



const routes = {
    "/": () => <Login/>,
    "/register": () => <Register />,
    "/successregister": () => <SuccessRegister />,
    "/dashboard": () =><Dashboard />,
    "/addemployee": () =><AddEmployee />,
    "/addcompany": () =><AddCompany />,
    "/weeklytargets": () =><WeeklyTargets />,
    "/editweeklytarget": () =><EditWeeklyTarget />,
    "/quarterlytargets": () =><QuarterlyTargets />,
    "/editquarterlytarget": () =><EditQuarterlyTarget />,
    "/editemployeemetrics": () =><EditEmployeeMetrics />,
    "/adjustmetric": () =><AdjustEmployeeMetrics />,
    "/quarterlychart": () =><QuarterlyChart />
};


export default routes;