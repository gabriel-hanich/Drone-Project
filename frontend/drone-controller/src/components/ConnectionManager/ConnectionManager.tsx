import { useState } from "react";
import "./ConnectionManager.css"
import { getBackendURL, getDroneURL, setBackendURL, useConnection } from "../../services/DroneConnection";

const ConnectionManager:React.FC = ()=>{
    let backendConnected : boolean = useConnection().backendConnected;
    let droneConnected : boolean = useConnection().droneConnected;

    const [userEnteredGroundStationURL, setUserGroundStationURL] = useState<String>(getBackendURL());
    const [userDroneURL, setUserDroneURL] = useState<String>(getDroneURL());

    function updateURLs(){
        setBackendURL(userEnteredGroundStationURL);
        setUserDroneURL(userDroneURL);
    }


    return(
        <>
            <div className="container rounded expand connection-container">
                <div className="status-container expand">
                    <div className={(backendConnected ? 'status-active' : 'status-inactive') + " connection-status"}></div>
                    <p className="connection-text">Backend</p>
                    <div className={(droneConnected ? 'status-active' : 'status-inactive') + " connection-status"}></div>
                    <p className="connection-text">Drone</p>
                </div>
                <div className="settings-container expand">
                    <p className="settings-elem">Ground Station URL</p>
                    <input type="text"  className="settings-elem" value={userEnteredGroundStationURL.toString()} onChange={e => setUserGroundStationURL(e.target.value)}/>
                    <p className="settings-elem">Drone URL</p>
                    <input type="text"  className="settings-elem" value={userDroneURL.toString()} onChange={e => setUserDroneURL(e.target.value)}/>
                    <button className="settings-elem settings-button" onClick={updateURLs}>Update</button>
                </div>
            </div>
        </>
    )
    
}

export default ConnectionManager;