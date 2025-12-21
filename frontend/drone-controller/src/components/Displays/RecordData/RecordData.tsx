import { useState } from "react";
import { sendCommandObject, useConnection } from "../../../services/DroneConnection";
import { DroneOperation, PassiveCommand } from "../../../types";
import "./RecordData.css"

const RecordData:React.FC = ()=>{
    const isRecording = useConnection().isRecording;
    const [askedRecord, setAsked] = useState<boolean>(false);


    function startRecording(){
        if(isRecording){
            return
        }
        sendCommandObject(new PassiveCommand(DroneOperation.START_RECORD, Date.now()));
        setAsked(true);
    }
    
    function stopRecording(){
        if(!isRecording){
            return
        }
        sendCommandObject(new PassiveCommand(DroneOperation.END_RECORD, Date.now()));
        setAsked(false);
    }

    return(
        <>
            <div className="wrapper">
                <div className="record-box">
                    <button className={"rec-button " + (!isRecording ? 'active-btn' : 'disabled-btn')} id="start-rec" onClick={startRecording}>
                        <div className="rec-inset" id="start-inset">
                            <p>Start</p>
                        </div>
                    </button>
                    <button className={"rec-button " + (isRecording ? 'active-btn' : 'disabled-btn')} id="stop-rec" onClick={stopRecording}>
                        <div className="rec-inset" id="end-inset">
                            <p>End</p>
                        </div>
                    </button>
                    {
                        askedRecord ? (isRecording ? <p>Recording Started</p> : <p>Pending Recording Start</p>) : isRecording ? <p>Recording Started</p> : <p>Not Recording</p>
                    }
                </div>
            </div>
        </>
    )
    
}

export default RecordData;