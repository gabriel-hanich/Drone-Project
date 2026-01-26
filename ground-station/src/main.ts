/**
 * A web server that functions as a go-between from the frontend to 
 * the drone. Currently only supports communication with the drone over http
 **/ 
import { DroneCommand, DroneConnection, DroneOperation, initialConnection } from "./types"
import { RecordKeeper } from "./RecordKeeper";
import { getDroneData, sendDroneCommand } from "./DroneConnection";
const cors = require('cors');


const port: number = 8080; // The port that the webserver is hosted at  
const versionNumber: String = "0.0.1"; // The current version of this code
const newThreshold: number = 500 // The maximum age of a packet before the server will make another request to the drone (in ms)


// Initalise the web server
const express = require('express');
const app = express();

const recordManager = new RecordKeeper();

var lastCommand: String = "";

app.use(cors()); // This allows all origins
app.use(express.json());

var connectionData:DroneConnection = initialConnection
connectionData.backendFirmwareVersion = versionNumber;


app.get("/", (req, res)=>{
    recordManager.takeData(connectionData.droneInfo);
    if(Date.now() - connectionData.droneInfo.packetTime >= newThreshold){
        getDroneData(connectionData).then((result)=>{
            connectionData = result;
            res.send(JSON.stringify(connectionData));
        }, (err)=>{
            connectionData.droneConnected = false;
            res.send(JSON.stringify(connectionData));
        });
    }else{
        res.send(JSON.stringify(connectionData));
    };
});

app.post("/commands", (req,res)=>{
    let command:DroneCommand = DroneCommand.fromString(req.body.command);

    if(command.operation == DroneOperation.START_RECORD){
        recordManager.startRecording(connectionData.droneInfo);
    }
    if(command.operation == DroneOperation.END_RECORD){
        recordManager.stopRecording();
    }
    
    connectionData.isRecording = recordManager.isRecording;
    sendDroneCommand(connectionData.droneURL, command);
    res.status(200);
    res.send({"status": 200});
});


app.post("/serverconfig", (req, res)=>{
    if(req.body.droneURL != ""){
        connectionData.droneURL = req.body.droneURL;
    }
    if(req.body.droneConnectionType != ""){
        connectionData.droneConnectionType = req.body.droneConnectionType;
    }
});


app.listen(port, ()=>{
    console.log("The main server is running at http://localhost:" + port + "/")
})



