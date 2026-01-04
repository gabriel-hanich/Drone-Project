import { ChangeEvent, useState } from "react";
import { sendCommandObject, useConnection } from "../../../services/DroneConnection";
import { ControlSelectCommand, ControlSetCommand } from "../../../types";
import "./ControlSystem.css"

const ControlSystem:React.FC = ()=>{
    let currentController: String = useConnection().droneInfo.currentControlSystem;
    let controllerOptions:String[] = useConnection().droneInfo.controlSystemList
    let isEStopped: Boolean = useConnection().droneInfo.isEStopped;
    let isArmed: Boolean = useConnection().droneInfo.isArmed;
    let droneConnected:boolean = useConnection().droneConnected;
    let controllerParameters: any = useConnection().droneInfo.controlSystemVals; // The controller parameters as they are on the drone


    let [searchedVal, setSearchVal] = useState<String>("");
    let [newControllerParams, setNewControllerParams] = useState(controllerParameters); // The controller parameters as they have been set by the user

    let [loadFields, setLoadFields] = useState<boolean>(false); // If the button to load the fields has been pressed

    // Sends the command to switch the active control system to the selected one if the drone is disarmed and not E-stopped
    function changeControlSystem(){
        if(!isEStopped && !isArmed){
            var e = document.getElementById("control-chooser");
            let selectCommand:ControlSelectCommand = new ControlSelectCommand(Date.now(), (e as any).value);
            sendCommandObject(selectCommand);
        }
    }


    // Changes a single value within the newParameters object
    function changeVal(key:String, newVal:number){
        let newObj:any = {};
        Object.keys(newControllerParams).forEach((thisKey)=>{
            if(thisKey == key){
                newObj[thisKey as any] = newVal;
            }else{
                newObj[thisKey as any] = newControllerParams[thisKey as any];
            }
        });

        setNewControllerParams(newObj);
    }

    // If the button is pressed, updates the new parameters to match the ones on the drone
    function manageFields(){
        if(droneConnected){
            setLoadFields(true); 
            setNewControllerParams(controllerParameters)
        }
    }

    // Generates the form which enables the user to modify the controller parameters
    function generateFields(){
        return Object.keys(controllerParameters).map((key)=>{
            if(key.includes(searchedVal.toString())){
                return (
                <div className={"value-item " + (newControllerParams[key] == controllerParameters[key] ? '' : 'value-changed')} key={key}>
                    <p className="value-name">{key}</p>
                    <button className="value-button cursor" onClick={() => changeVal(key, newControllerParams[key] - 0.1)}>-0.1</button>
                    <button className="value-button cursor" onClick={() => changeVal(key, newControllerParams[key] - 0.01)}>-0.01</button>
                    <input type="number" className="value-input" value={newControllerParams[key]} onChange={(e) => changeVal(key, parseFloat(e.target.value))} pattern="-?[0-9]+"/>
                    <button className="value-button cursor" onClick={() => changeVal(key, newControllerParams[key] + 0.01)}>+0.01</button>
                    <button className="value-button cursor" onClick={() => changeVal(key, newControllerParams[key] + 0.1)}>+0.1</button>
                </div>
                )
            }
        });
    }

    // Sends a command to the drone to update only the modified controller parameters
    function updateFields(){
        Object.keys(newControllerParams).forEach((thisKey)=>{
            if(newControllerParams[thisKey] != controllerParameters[thisKey]){
                let droneCmd = new ControlSetCommand(Date.now(), thisKey, newControllerParams[thisKey]);
                sendCommandObject(droneCmd);
            }
        });
    }

    // Manages setting the parameter values based on an uploaded csv file
    function handleCSV(event:ChangeEvent<HTMLInputElement>){
        if (event.target.files == null){
            return
        }
        let uploadedFile:File = event.target.files[0];
        const reader = new FileReader();

        reader.onload = updateParamsFromCSV;
        reader.readAsText(uploadedFile);
    }

    // Actually sets the new parameters using the csv file as passed from the fileReader
    function updateParamsFromCSV(event:ProgressEvent<FileReader>) {
        let fileContents: String = (event.target as FileReader).result as String;
        let fileLines:String[] =  fileContents.split("\n");
        let newParameters: any = {}
        fileLines.forEach((line)=>{
            let paramPair = line.split(",");
            if(paramPair.length == 2){
                newParameters[paramPair[0]] = parseFloat(paramPair[1].replaceAll("\r", ""));
            }
        })
        setNewControllerParams(newParameters);
    }

    // Creates a csv file using the current `newParameters`
    function downloadVals(){
        let outputString: string = "";
        Object.keys(newControllerParams).forEach((key) => {
            outputString = outputString + key + "," + newControllerParams[key].toString() + "\n"
        });
        const blob = new Blob([outputString], {type: "text/csv"});
        
        
        // Create a link element
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = currentController + "-params.csv";  // filename

        // Trigger the download
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
    }


    return(
        <>
            <div className="wrapper control-wrapper">
                <div className="selector-container expand">
                    <div className="control-item">
                        <p className="control-text">Current Control System</p>
                        <em className="control-text">{currentController}</em>
                    </div>
                    <div className="control-item">
                        <p className="control-text">Select Control System</p>
                        <select name="Control System" id="control-chooser" className="cursor" defaultValue={currentController.toString()}>
                            {
                                controllerOptions.map(opt => <option value={opt.toString()} key={opt.toString()}>{opt}</option>)
                            }

                        </select>
                        <br></br>
                        <button className={"update-btn " + (isArmed || isEStopped ? "disabled-button" : '') } onClick={changeControlSystem}>Update</button>
                        {(isArmed || isEStopped) && <p className="control-text explainer-text">Can't change control system if drone is E-Stopped or Armed</p>}
                    </div>
                    {
                        loadFields && 
                        <div className="control-item">
                            <p className="control-text">Upload values from csv file</p>
                            <input id="control-file" type="file" accept=".csv" onChange={(e)=>handleCSV(e)}/>
                        </div>
                    }
                    {
                        loadFields && 
                        <div className="control-item">
                            <p className="control-text">Download values to CSV file</p>
                            <button className="control-button" onClick={downloadVals}>Download</button>
                        </div>
                    }
                    
                </div>
                <div className="value-contianer expand">
                    <div className="value-bar">
                        <input type="text" className="value-search" placeholder="Search Values" onChange={(val)=> setSearchVal(val.target.value)}/>
                        <button className="value-update update-btn" onClick={updateFields}>Update Modified Values</button>
                    </div>
                    <div className="value-items">
                        {loadFields ? generateFields() : <button className={"update-btn load-btn " + (droneConnected ? '' : 'disabled-button')} onClick={manageFields}>Load Fields</button>}
                    </div>
                </div>
                <div className="update-container expand"></div>
            </div>
        </>
    )
    
}

export default ControlSystem;