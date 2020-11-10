const Companies_2020_2021 = require("../models/company");
const SentaEmployee = require("../models/sentaemployee");
const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const request = require("request");
const path = require("path");
const {set} = require("date-fns");
const formatRFC7231 = require("date-fns/formatRFC7231");
const {utcToZonedTime} = require("date-fns-tz");
// Environment Variables
require('dotenv').config();
// For Encryption
const bcrypt = require("bcrypt");
const saltRounds =  parseInt(process.env.SALT);
// Custom modules
const isCompanyNull = require("../custom_modules/companyNull");


// Setup Express
const app = express();

app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(express.static("client/build"));



// Route for adding a new Company
router.post("/newcompany",(req, res) => {

    const contact=req.body.contact;
    
    // loops over properties and logs them
    // for(var property in company){
    //     console.log(property + "=" + item[property]);
    // }
             
    Companies_2020_2021.create({
        Name: contact.company,
        Application: contact.applicationSelection,
        Year: "2020-2021",
        Employees: [],
    }, (err, name) => {
        if(err) {
            console.log("Add Company Error: " + err);
            res.status(500).send("Error");
            return;
        } else {
            res.status(200).json(name);
            console.log("New Company Added");
            return;
        }
    });  
});


// Route for adding a new Employee

router.post("/newemployee",(req, res) => {

    const employee=req.body.employee;
    const company=employee.company;
    
    const newEmployee = new SentaEmployee({
        fName: employee.fName,
        lName: employee.lName,
        Position: employee.position,
        Year: "2020-2021",
        VATReturn: [],
        PAYE: [],
        Bookkeeping: [],
        PersonalTaxReturn: [],
        AccountsProduction: [],
        NewClient: [],
        ClientOnboarding: [],
        WTargetVATReturn: 0,
        WTargetPAYE: 0,
        WTargetBookkeeping: 0,
        WTargetPersonalTaxReturn: 0,
        WTargetAccountsProduction: 0,
        WTargetNewClient: 0,
        WTargetClientOnboarding: 0,
        YTargetVATReturn: 0,
        YTargetPAYE: 0,
        YTargetBookkeeping: 0,
        YTargetPersonalTaxReturn: 0,
        YTargetAccountsProduction: 0,
        YTargetNewClient: 0,
        YTargetClientOnboarding: 0,
        AddVATReturn: 0,
        AddPAYE: 0,
        AddBookkeeping: 0,
        AddPersonalTaxReturn: 0,
        AddAccountsProduction: 0,
        AddNewClient: 0,
        AddClientOnboarding: 0,
    }); 
    
    Companies_2020_2021.findOne({Name : company}, function(err, foundCompany){
        console.log("Found Company is - " + foundCompany.Name);
        if (err) {
          console.log(err);
        } else {
            foundCompany.Employees.push(newEmployee);
            foundCompany.save();
        }
            (err, name) => {
              if(err) {
                  console.log("Add Employee Error: " + err);
                  res.status(500).send("Add Employee Error");
                  return;
              } else {
                  res.status(200).json(name);
                  console.log("New Employee Added");
                  return;
              }
            };
    });
});



// Route for deleting an Senta Employee
router.route("/:id")
    .delete((req, res) => {
        SentaEmployee.findById(req.params.id, (err, employee) => {
            if (err) {
                console.log("Delete Error: " + err);
                res.status(500).send("Error");
            } else if (employee) {
                employee.remove( () => {
                    res.status(200).json(employee);
                });
            } else {
                res.status(404).send("Not Found");
            }
        });
    });

    
        
    

    


    // Route for adding a new User

    router.post("/newuser", (req, res) => {

        const item=req.body.contact;
        
        bcrypt.hash(item.password, saltRounds, function(err, hash){
            console.log("Hashing");

            if(err) {
                console.log("Add User Error: " + err);
                res.status(500).send("Add User Error");
                return;
            };

            const name= item.fName;
            
            User.create({
                FirstName: item.fName,
                LastName: item.lName,
                Company: item.company,
                Email: item.email,
                Password: hash,
            }, (err, ) => {
                if(err) {
                    console.log("Add User Error: " + err);
                    res.status(500).send("Add User Error");
                    return;
                } else {
                    res.status(200).json(name);
                    console.log("New User Added");
                    return;
                }
            });
        });
    });




    // Route for Login

    router.post("/login", async (req, res) => {

        let responseUser = {
            fName: "",
            lName: "",
            company: "",
            email: "",
            auth: false,
        };


        console.log("login post recieved");

        const post=req.body.user;

        let authFail = {
            auth: false,
        };

        if(post.email === null || post.email === "undefined") {
            console.log("Email is Null or Undefined");
            res.json({
                message: "Email is Null or Underfined",
                user: authFail
            });
            return;
        };

        User.findOne({Email : post.email}, function(err, foundUser){

            if(foundUser === null || foundUser === "undefined") {
                console.log("User is Null or Undefined");
                res.json({
                    message: "User is Null or Underfined",
                    user: authFail
                });
                return;
            };

            if (err) {
                console.log("Find User Error" + err);
                res.status(500).send("Find User Error");
                res.json({
                    message: "Error",
                    user: authFail
                });
                throw (err);
            };


            console.log("found user is - " + foundUser.FirstName);

            responseUser = {
                fName: foundUser.FirstName,
                lName: foundUser.LastName,
                company: foundUser.Company,
                email: foundUser.Email,
                auth: true,
            };

            // Find Employees
            Companies_2020_2021.findOne({"Name": foundUser.Company}, function(err, foundCompany){
                if(err) {
                    console.log("Employees not found error: " + err);
                    res.status(404).send("Employees not found")
                    throw (err);
                } else {
                    console.log("Found Employees for - " + foundUser.Company);
                    const {Employees, Name, Application, Year, _id} = foundCompany;

                    
              
                   bcrypt.compare(post.password, foundUser.Password, function(err, result){
                        if (result === true) {
                            console.log("Authorization Success");
                            res.json({
                                message: "Logged In",
                                user: responseUser,
                                employees: Employees
                            });
                            return;
                            
                        } else {
                            console.log("Authorization Fail");
                            console.log("Passwords Don't Match");
                            res.json({
                                message: "Authorisation Failed Passwords Don't Match",
                                user: authFail
                            });
                            return;
                        };
                    });
                }
            });
        });
    });





// Update Weekly Targets
router.post("/editweeklytargets", (req, res) => {

    const data = req.body.target;

    isCompanyNull(data.company);

    Companies_2020_2021.findOneAndUpdate({"Name": data.company, "Employees.fName": data.employeefName}, {
        $set: {"Employees.$.WTargetVATReturn": data.weeklyVATTarget, 
            "Employees.$.WTargetPAYE": data.weeklyPAYETarget,
            "Employees.$.WTargetBookkeeping": data.weeklyBookkeepingTarget,
            "Employees.$.WTargetPersonalTaxReturn": data.weeklyPersonalTaxTarget,
            "Employees.$.WTargetAccountsProduction": data.weeklyAccountsProductionTarget,
            }}, function(err, results){
                    if(err) {
                        
                    console.log("Employee Targets Error: " + err);
                    res.status(500).send("Employee Targets Error");
                     throw (err);
                    } else {
                        Companies_2020_2021.findOne({"Name": data.company}, function(err, foundCompany){
                            if(err) {
                                console.log("Employees not found error: " + err);
                                throw (err);
                            } else {
                                console.log("Found Employees for - " + foundCompany.Name);
                                const {Employees, Name, Application, Year, _id} = foundCompany;

                                res.json({
                                    message: "Employee Updates",
                                    employees: Employees
                                })
                        
                                console.log("Employee Targets Updated");
                                return;
                            }
                        });
                    };
    });
});






// Update Yearly Targets
router.post("/editquarterlytarget", (req, res) => {

    const data = req.body.target;

    isCompanyNull(data.company);

    Companies_2020_2021.findOneAndUpdate({"Name": data.company, "Employees.fName": data.employeefName}, {
        $set: {"Employees.$.YTargetVATReturn": data.quarterlyVATTarget, 
            "Employees.$.YTargetPAYE": data.quarterlyPAYETarget,
            "Employees.$.YTargetBookkeeping": data.quarterlyBookkeepingTarget,
            "Employees.$.YTargetPersonalTaxReturn": data.quarterlyPersonalTaxTarget,
            "Employees.$.YTargetAccountsProduction": data.quarterlyAccountsProductionTarget,
            }}, function(err, results){
                    if(err) {
                        
                    console.log("Employee Targets Error: " + err);
                    res.status(500).send("Employee Targets Error");
                     throw (err);
                    } else {
                        Companies_2020_2021.findOne({"Name": data.company}, function(err, foundCompany){
                            if(err) {
                                console.log("Employees not found error: " + err);
                                throw (err);
                            } else {
                                console.log("Found Employees for - " + foundCompany.Name);
                                const {Employees, Name, Application, Year, _id} = foundCompany;

                                res.json({
                                    message: "Employee Updates",
                                    employees: Employees
                                })
                        
                                console.log("Employee Targets Updated");
                                return;
                            }
                        });
                    };
    });
});





// Adjust Metrics
router.post("/adjustmetrics", (req, res) => {

    const data = req.body.target;

    isCompanyNull(data.company);

    Companies_2020_2021.findOneAndUpdate({"Name": data.company, "Employees.fName": data.employeefName}, {
        $set: {"Employees.$.AddVATReturn": data.addVAT, 
            "Employees.$.AddPAYE": data.addPAYE,
            "Employees.$.AddBookkeeping": data.addBookkeeping,
            "Employees.$.AddPersonalTaxReturn": data.addPersonalTax,
            "Employees.$.AddAccountsProduction": data.addAccountsProduction,
            }}, function(err, results){
                    if(err) {
                        
                    console.log("Adjust Metrics Error: " + err);
                    res.status(500).send("Adjust Metrics Error");
                     throw (err);
                    } else {
                        Companies_2020_2021.findOne({"Name": data.company}, function(err, foundCompany){
                            if(err) {
                                console.log("Employees not found error: " + err);
                                throw (err);
                            } else {
                                console.log("Found Employees for - " + foundCompany.Name);
                                const {Employees, Name, Application, Year, _id} = foundCompany;

                                res.json({
                                    message: "Employee Updates",
                                    employees: Employees
                                })
                        
                                console.log("Employee Metrics Updated");
                                return;
                            }
                        });
                    };
    });
});


    



// Post for adding VAT Return Metric
router.post("/addvat", (req, res) => {

    const foundFName=req.body.user;
    const foundCompany=req.body.company;

    const today = new Date();

        Companies_2020_2021.findOneAndUpdate({"Name": foundCompany, "Employees.fName": foundFName}, {$push: {"Employees.$.VATReturn": today}}, function(err, results){
            if(err) {
                console.log("Update VAT Error: " + err);
                res.status(500).send("Update VAT Error");
                throw (err);
            } else {
                res.sendStatus(200);
                console.log("Employee VAT Updated");
                // console.log("results -" + results);
                return;
            }
        });    
    
});




// Post for adding PAYE Metric
router.post("/addpaye", (req, res) => {

    const foundFName=req.body.user;
    const foundCompany=req.body.company;

    const today = new Date();

        Companies_2020_2021.findOneAndUpdate({"Name": foundCompany, "Employees.fName": foundFName}, {$push: {"Employees.$.PAYE": today}}, function(err, results){
            if(err) {
                console.log("Update PAYE Error: " + err);
                res.sendStatus(500).send("Update PAYE Error");
                throw (err);
            } else {
                res.sendStatus(200);
                console.log("Employee PAYE Updated");
                // console.log("results -" + results);
                return;
            }
        });    
    
});





// Post for adding Bookkeeping Metric
router.post("/addbookkeeping", (req, res) => {

    const foundFName=req.body.user;
    const foundCompany=req.body.company;

    const today = new Date();

        Companies_2020_2021.findOneAndUpdate({"Name": foundCompany, "Employees.fName": foundFName}, {$push: {"Employees.$.Bookkeeping": today}}, function(err, results){
            if(err) {
                console.log("Update Bookkeeping Error: " + err);
                res.sendStatus(500).send("Update Bookkeeping Error");
                throw (err);
            } else {
                res.sendStatus(200);
                console.log("Employee Bookkeeping Updated");
                // console.log("results -" + results);
                return;
            }
        });    
    
});





// Post for adding Personal Tax Return Metric
router.post("/addptr", (req, res) => {

    const foundFName=req.body.user;
    const foundCompany=req.body.company;

    const today = new Date();

        Companies_2020_2021.findOneAndUpdate({"Name": foundCompany, "Employees.fName": foundFName}, {$push: {"Employees.$.PersonalTaxReturn": today}}, function(err, results){
            if(err) {
                console.log("Update Personal Tax Return Error: " + err);
                res.status(500).send("Update Personal Tax Error");
                throw (err);
            } else {
                res.sendStatus(200);
                console.log("Employee Personal Tax Return Updated");
                // console.log("results -" + results);
                return;
            }
        });    
    
});





// Post for adding Accounts Production Metric
router.post("/addaccprod", (req, res) => {

    const foundFName=req.body.user;
    const foundCompany=req.body.company;

    const today = new Date();

        Companies_2020_2021.findOneAndUpdate({"Name": foundCompany, "Employees.fName": foundFName}, {$push: {"Employees.$.AccountsProduction": today}}, function(err, results){
            if(err) {
                console.log("Update Accounts Production Error: " + err);
                res.status(500).send("Update Accounts Production Error");
                throw (err);
            } else {
                res.sendStatus(200);
                console.log("Employee Accounts Production Updated");
                // console.log("results -" + results);
                return;
            }
        });    
    
});







// Get request for All Metrics
router.post("/allmetrics", async (req, res) => {

    const data = req.body;

    isCompanyNull(data.company);

    await Companies_2020_2021.findOne({"Name": data.company}, function(err, foundCompany){
        if(err) {
            console.log("All Metrics Company error: " + err);
            res.status(500).send("All Metrics Error");
            throw (err);
        } else {
            console.log("Processing Metrics");
            const {Employees, Name, Application, Year, _id} = foundCompany;

            console.log("Sending Metrics");

            return (
            res.json({
                message: "All Metrics",
                employees: Employees
            })
            );
            
        };
    });
});


  

module.exports = router;




                // loops over properties
            // for(var property in Employees){
            //     console.log(property + " = " + Employees[property]);
                
            // }
