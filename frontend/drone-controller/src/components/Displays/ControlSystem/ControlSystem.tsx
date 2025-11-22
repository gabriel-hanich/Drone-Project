import { useState } from "react";
import { sendCommandObject, useConnection } from "../../../services/DroneConnection";
import { ControlSelectCommand, ControlSetCommand } from "../../../types";
import "./ControlSystem.css"

const ControlSystem:React.FC = ()=>{
    let currentController: String = useConnection().droneInfo.currentControlSystem;
    let controllerOptions:String[] = useConnection().droneInfo.controlSystemList
    let isEStopped: Boolean = useConnection().droneInfo.isEStopped;
    let isArmed: Boolean = useConnection().droneInfo.isArmed;

    let controllerParameters: any = useConnection().droneInfo.controlSystemVals;
    let droneConnected:boolean = useConnection().droneConnected

    let [searchedVal, setSearchVal] = useState<String>("");
    let [newControllerParams, setNewControllerParams] = useState(controllerParameters);

    let [loadFields, setLoadFields] = useState<boolean>(false);

    function changeControlSystem(){
        if(!isEStopped && !isArmed){
            var e = document.getElementById("control-chooser");
            let selectCommand:ControlSelectCommand = new ControlSelectCommand(Date.now(), (e as any).value);
            sendCommandObject(selectCommand);
        }
    }


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

    function manageFields(){
        if(droneConnected){
            setLoadFields(true); 
            setNewControllerParams(controllerParameters)
        }
    }

    function generateFields(){
        return Object.keys(controllerParameters).map((key)=>{
            if(key.includes(searchedVal.toString())){
                return (
                <div className={"value-item " + (newControllerParams[key] == controllerParameters[key] ? '' : 'value-changed')} key={key}>
                    <p className="value-name">{key}</p>
                    <button className="value-button cursor" onClick={() => changeVal(key, newControllerParams[key] - 0.1)}>-0.1</button>
                    <button className="value-button cursor" onClick={() => changeVal(key, newControllerParams[key] - 0.01)}>-0.01</button>
                    <input type="number" className="value-input" value={newControllerParams[key]} onChange={(e) => changeVal(key, parseFloat(e.target.value))}/>
                    <button className="value-button cursor" onClick={() => changeVal(key, newControllerParams[key] + 0.01)}>+0.01</button>
                    <button className="value-button cursor" onClick={() => changeVal(key, newControllerParams[key] + 0.1)}>+0.1</button>
                </div>
                )
            }
        });
    }

    function updateFields(){
        Object.keys(newControllerParams).forEach((thisKey)=>{
            if(newControllerParams[thisKey] != controllerParameters[thisKey]){
                let droneCmd = new ControlSetCommand(Date.now(), thisKey, newControllerParams[thisKey]);
                sendCommandObject(droneCmd);
            }
        });
    }

    return(
        <>
            <div className="wrapper">
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