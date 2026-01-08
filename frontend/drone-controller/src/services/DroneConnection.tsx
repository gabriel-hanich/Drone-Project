import { ReactNode, useContext, useEffect, useState, createContext } from "react";
import { DroneCommand, DroneConnection, DroneData, initialConnection } from "../types";


var backendURL: String = "http://localhost:8080";
var droneURL: String = "";
var lastPacket:number = Date.now();
const ConnectionContext = createContext<DroneConnection | undefined>(undefined);
var lastCommands: DroneCommand[] = [];


// A provider function that automatically updates the drone data every 2 seconds
export function ConnectionProvider({children} : {children:ReactNode}){
    const [value, setValue] = useState<DroneConnection>(initialConnection);
    
    useEffect(() => {
        const interval = setInterval(() => {
            getDroneData(backendURL, droneURL).then((data)=> setValue(data));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ConnectionContext.Provider value={value}>
            {children}
        </ConnectionContext.Provider>
    )
    
}

// Function that enables child react components to access the drone connection data
export function useConnection():DroneConnection{
    const ctx = useContext(ConnectionContext);
    if(ctx === undefined){
        throw new Error("Can't use counter context outside of a <ConnectionContext.Prover>");
    }
    return ctx;
}

// Converts the data from the HTTP request to the drone connection format
function convertDroneResponse(data: any): DroneConnection{
    let dData:DroneConnection = (data as DroneConnection);
    dData.pollingRate = Date.now() - lastPacket;
    lastPacket = Date.now()
    dData.backendConnected = true;
    dData.backendURL = backendURL;
    dData.frontendFirmwareVersion = "0.1.0";
    
    let lastCommand: DroneCommand = DroneCommand.fromString(dData.droneInfo.lastInstruction);
    if(lastCommands.length == 0){
        lastCommands.push(lastCommand)
    }
    else{
        if(lastCommands[lastCommands.length - 1].time != lastCommand.time && lastCommand["operation"].length != 0){
            lastCommands.push(lastCommand)
        }
    }
    
    dData.pastCommands = lastCommands.map((val)=> val.toPrettyString());
    dData.pastCommands.filter((val) => val != "");
    return dData;
}


// Makes a http get request to the backendURL to get the drone data
async function getDroneData(backendURL:String, droneURL:String): Promise<DroneConnection>{
    let prom:Promise<DroneConnection> = new Promise((resolve, reject)=>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: "no-store",
        };
        fetch((backendURL as any), (requestOptions as any)).then((response: Response) =>{
            response.json().then((data)=>{resolve(convertDroneResponse(data))}).catch((error) => {resolve(initialConnection); console.log(error)})
        }).catch((error)=>{
            console.log(error);
            resolve(initialConnection);
        })
    });
    return prom;   
}
// Sends a single command to the ground station
// NOTE: command must be in prettified form (i.e without the timestamp ahead of it)
export async function sendCommandString(command: String): Promise<void> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: `${Date.now()} ${command}` }),
        cache: "no-store"
    };

    try {
        const res = await fetch(`${backendURL}/commands`, (requestOptions as any));

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

export function sendCommandObject(command:DroneCommand): void{
    sendCommandString(command.toPrettyString());
}

export function setBackendURL(newURL:String){
    backendURL = newURL;
}

export function setDroneURL(newURL:String){
    droneURL = newURL;
}

export function getBackendURL():String{
    return backendURL
}

export function getDroneURL():String{
    return droneURL
}