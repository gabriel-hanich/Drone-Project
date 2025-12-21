import { useEffect, useState } from "react";
import { useConnection } from "../../../services/DroneConnection";
import "./RawData.css"

const RawData:React.FC = ()=>{
    const connection = useConnection();
    const [rawData, setRawData] = useState<String>("");

    useEffect(()=>{
        setRawData(connection.backendURL);
    }, [connection])



    return(
        <>
            <div className="wrapper">
                <h1>Raw data from the drone</h1>
                <div className="data-container">
                    <code>{rawData}</code>
                </div>
            </div>
        </>
    )
    
}

export default RawData;