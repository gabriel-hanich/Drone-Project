import { FormEvent, useState } from "react";
import "./TextConsole.css"
import { sendCommandString, useConnection } from "../../services/DroneConnection";

const TextConsole:React.FC = ()=>{
    const pastCommands = useConnection().pastCommands;

    function addNewCommand(inputVal: React.KeyboardEvent<HTMLInputElement>){
         if(inputVal.key == "Enter"){
            const currentCommand = inputVal.currentTarget.value.trim();
            if (!currentCommand) return;
            inputVal.currentTarget.value = "";
            sendCommandString(currentCommand);
        }
    }



    
    return(
        <>
            <div className="container console-container rounded">
                <div className="log-container">
                    <p className="log-text">Drone Controller Version 0.1.0</p>
                    {
                        pastCommands.map(cmd => <p className="log-text" key={Math.random()}>{cmd}</p>)
                    }
                </div>
                <div className="input-container">
                    <input type="text" className="console-input" placeholder="Type Drone Commands" onKeyDown={(e) => addNewCommand(e)}/>
                </div>
            </div>
        </>
    )
}

export default TextConsole;