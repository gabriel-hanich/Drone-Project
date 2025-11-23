/**
 * Gabriel Hanich - 15/11/2025 
 * 
 * A basic test server with randomly generated data produced every 
 * `updateInteval` seconds,  and the ability to recieve drone commands
 * as text. Used when developing the associated web app. 
 * */ 
import { json } from "stream/consumers";
import { DroneCommand, DroneConnection, DroneData, handleCommand, initialConnection } from "./types"
const cors = require('cors');



// Initalise the web server
const express = require('express');
const app = express();

const port: number = 8080;


var lastCommand: String = "";

app.use(cors()); // This allows all origins
app.use(express.json());

var outputdata:DroneConnection = initialConnection


app.get("/", (req, res)=>{
    res.send(JSON.stringify(outputdata));
});

app.post("/commands", (req,res)=>{
    outputdata = handleCommand(outputdata, DroneCommand.fromString(req.body.command));
    console.log(req.body.command);
    res.status(200);
    res.send({"status": 200});
})


app.listen(port, ()=>{
    console.log("The test server is running at http://localhost:" + port + "/")
})



