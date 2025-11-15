/**
 * Gabriel Hanich - 15/11/2025 
 * 
 * A basic test server with randomly generated data produced every 
 * `updateInteval` seconds,  and the ability to recieve drone commands
 * as text. Used when developing the associated web app. 
 * */ 
import { json } from "stream/consumers";
import { DroneData, generateRandomDroneData } from "./types"



// Initalise the web server
const express = require('express');
const app = express();
const port: number = 3000;

var outputdata:DroneData = generateRandomDroneData();

setInterval(()=>{
    outputdata = generateRandomDroneData();
}, 1000)

app.get("/", (req, res)=>{
    res.send(JSON.stringify(outputdata));
});



app.listen(port, ()=>{
    console.log("The test server is running at http://localhost:" + port + "/")
})



