import { DroneData } from "./types";
const fs = require("node:fs");

export class RecordKeeper{
    // A class that stores drone data for the period between the start and stop
    // functions being called. It then exports this data in a .csv format after
    // the stop function is run

    public isRecording: boolean = false;
    private recordedData:string[] = [];
    private recordingStartTime:number = 0;
    private keyList:string[] = []
    private controlKeyList:string[] = [];

    constructor(){}

    // Initialises the new recording by clearing out old data
    private initRecording(initialData:DroneData):void{
        this.recordedData = [];
        this.keyList = [];
        this.controlKeyList = [];
        let firstLine:string = "epoch_time,delta_time"
        let keys = Object.keys(initialData);
        keys.forEach((val)=>{
            firstLine = firstLine + "," + val.toString();
            this.keyList.push(val.toString());
        });

        let controlKeys = Object.keys(initialData.controlSystemVals);
        controlKeys.forEach((key)=>{
            firstLine = firstLine + "," + "control-" + key.toString();
            this.controlKeyList.push(key.toString());
        })

        this.recordedData = [firstLine];
        this.recordingStartTime = Date.now()
    }


    

    // Actually start taking the data 
    public startRecording(initialData:DroneData): void{
        if(this.isRecording){
            return;
        }
        this.isRecording = true;
        this.initRecording(initialData);
    }

    // Recieves new data from the drone, and then converts it to a string
    // and holds onto it
    public takeData(newData:DroneData){
        if(this.isRecording){
            let keyValPairs = Object.entries(newData);
            let line:string = `${Date.now()},${Date.now() - this.recordingStartTime}`;
            this.keyList.forEach((key)=>{
                keyValPairs.forEach((val)=>{
                    if(val[0] == key){
                        line = line + "," + val[1].toString().replaceAll(",", "/");
                        return 
                    }
                })
            });
            
            let controlPairs = Object.entries(newData.controlSystemVals);
            this.controlKeyList.forEach((key)=>{
                controlPairs.forEach((val)=>{
                    if(val[0] == key){
                        line = line + "," + val[1].toString().replace(",", "/");
                        return 
                    }
                })
            })
            this.recordedData.push(line);
        }
    }

    // Stops the record keeping process and saves the data to a .csv file
    public stopRecording():void{
        if(this.isRecording){
            let dataString:string = this.recordedData.join("\n");
            let d = new Date();
            let fileName:string = `recordings/${d.getFullYear()}${d.getMonth()+1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}DroneRecording.csv`   
            fs.writeFile(fileName, dataString, error=>{
                if(error){
                    console.error(error)
                }
            })
            this.isRecording = false;
        }
    }

}