// Environment Variables
require('dotenv').config();
const http = require("http");
const express = require("express");
const ws = require("ws");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const bodyParser = require("body-parser");
const router = express.Router();
const mongoose = require("mongoose");
const api = require("./routes/api");
const request = require("request");
const axios = require("axios");
const Pusher = require("pusher");
const sentaEmployee = require('./models/sentaemployee');
const path = require("path");
// const setupWebSocket = require("./setupWebSocket");
const port = process.env.PORT || 9000;




// Pusher setup
// const pusher = new Pusher({
//     appID : (process.env.PUSHER_APP_ID),
//     key : (process.env.PUSHER_KEY),
//     secret : (process.env.PUSHER_SECRET),
//     cluster : (process.env.PUSHER_CLUSTER),
//     forceTLS: true,
// });
// Pusher Web Socket
// const channel = "SentaMetrics";




// Express Setup
const app = express();

app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use("/api", api);


// Route to launch React index
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
};


// Websocket Server
const server = http.Server(app);
const wss = new ws.Server({server: server, path: "/"});
app.disable("x-powered-by");

wss.on("connection", function (wss) {
    wss.send("Connection Established with senta node server");

    wss.on("message", (e) => {
        console.log("Message recieved - " + e.data);
    });
    
});





// Connect to MongoDB
mongoose.connect((process.env.MONGOPERFORMANCEMONITOR), {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));

// Mongo Change Stream
db.once("open", async () => { 

    // This is Mongoose Change Streams
    const sentaJobCollection = db.collection("companies_2020_2021");
    const changeStream = sentaJobCollection.watch();

     // listening to change stream from mongo db   
    //  changeStream.on("change", (change) => {
    //     console.log(change);

    //     if(change.operationType === "replace") {
    //         const realtimeDocument = change.fullDocument;
    //         console.log("company is - " + realtimeDocument.Name);
    //         const realtimeEmployees = realtimeDocument.Employees;
    //         const firstEmployeeObect = realtimeEmployees[0];
    //         console.log("First Employee name is - " + firstEmployeeObect.fName);
    //         console.log("First Employee Vat Returns Completed - " + firstEmployeeObect.VATReturn);
    //       
    //     } else {
    //         console.log("Change not applicable for realtime");
    //     }
    // });

        
});

let workers = [];


if (cluster.isMaster) {
    console.log("Master " + process.pid + " is running");

    //Fork workers
    for (let i = 0; i < numCPUs; i++) {
        workers.push(cluster.fork());

        // recieve from workers
        workers[i].on("message", (message) => {
            console.log(message);
        });
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log("Worker " + worker.process.pid + " died with code: " + code + " and signal: " + signal);
        console.log("Starting new worker");
        cluster.fork();
        workers.push(cluster.fork());

        workers[workers.length-1].on("message", (message) => {
            console.log(message);
        });
    });
    
} else {
    server.listen(port, () => {
        console.log("Server Running on port " + port);
    });

    console.log("Worker " + process.pid + " started");

};



