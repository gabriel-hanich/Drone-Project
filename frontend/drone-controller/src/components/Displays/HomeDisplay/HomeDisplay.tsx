import { useConnection } from "../../../services/DroneConnection";
import "./HomeDisplay.css"

const HomeDisplay:React.FC = ()=>{
    const droneInfo = useConnection().droneInfo;
    const lngth = 3;

    return(
        <div className="wrapper" id="home-wrapper">
            <div className="home-box">
                <h2 className="box-title">Rotation</h2>
                <table className="box-table">
                    <tr>
                        <th></th>
                        <th>Actual</th>
                        <th>Setpoint</th>
                        <th>Error</th>
                    </tr>
                    <tr>
                        <td>Pitch</td>
                        <td>{droneInfo.pitch.toFixed(lngth)}</td>
                        <td>{droneInfo.pitchSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.pitch - droneInfo.pitchSetPoint).toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Roll</td>
                        <td>{droneInfo.roll.toFixed(lngth)}</td>
                        <td>{droneInfo.rollSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.roll - droneInfo.rollSetPoint).toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Yaw</td>
                        <td>{droneInfo.yaw.toFixed(lngth)}</td>
                        <td>{droneInfo.yawSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.yaw - droneInfo.yawSetPoint).toFixed(lngth)}</td>
                    </tr>
                </table>
            </div>
            <div className="home-box">
                <h2 className="box-title">Rotation Acceleration</h2>
                <table className="box-table">
                    <tr>
                        <th></th>
                        <th>Actual</th>
                        <th>Setpoint</th>
                        <th>Error</th>
                    </tr>
                    <tr>
                        <td>Pitch</td>
                        <td>{droneInfo.pitchAcc.toFixed(lngth)}</td>
                        <td>{droneInfo.pitchAccSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.pitchAcc - droneInfo.pitchAccSetPoint).toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Roll</td>
                        <td>{droneInfo.rollAcc.toFixed(lngth)}</td>
                        <td>{droneInfo.rollAccSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.rollAcc - droneInfo.rollAccSetPoint).toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Yaw</td>
                        <td>{droneInfo.yawAcc.toFixed(lngth)}</td>
                        <td>{droneInfo.yawAccSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.yawAcc - droneInfo.yawAccSetPoint).toFixed(lngth)}</td>
                    </tr>
                </table>
            </div>
            <div className="home-box">
                <h2 className="box-title">Lateral Acceleration</h2>
                <table className="box-table">
                    <tr>
                        <th></th>
                        <th>Actual</th>
                        <th>Setpoint</th>
                        <th>Error</th>
                    </tr>
                    <tr>
                        <td>X</td>
                        <td>{droneInfo.xAcc.toFixed(lngth)}</td>
                        <td>{droneInfo.xAccSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.xAcc - droneInfo.xAccSetPoint).toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Y</td>
                        <td>{droneInfo.yAcc.toFixed(lngth)}</td>
                        <td>{droneInfo.yAccSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.yAcc - droneInfo.yAccSetPoint).toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Z</td>
                        <td>{droneInfo.zAcc.toFixed(lngth)}</td>
                        <td>{droneInfo.zAccSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.zAcc - droneInfo.zAccSetPoint).toFixed(lngth)}</td>
                    </tr>
                </table>
            </div>
            <div className="home-box">
                <h2 className="box-title">Elevation</h2>
                <table className="box-table">
                    <tr>
                        <th>Actual</th>
                        <th>Setpoint</th>
                        <th>Error</th>
                    </tr>
                    <tr>
                        <td>{droneInfo.elevation.toFixed(lngth)}</td>
                        <td>{droneInfo.elevationSetPoint.toFixed(lngth)}</td>
                        <td>{(droneInfo.elevation - droneInfo.elevationSetPoint).toFixed(lngth)}</td>
                    </tr>
                </table>
            </div>
            <div className="home-box">
                <h2 className="box-title">Drive Motor</h2>
                <table className="box-table">
                    <tr>
                        <th></th>
                        <th>Throttle</th>
                    </tr>
                    <tr>
                        <td>Motor 1</td>
                        <td>{droneInfo.dMotor1Throttle.toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Motor 2</td>
                        <td>{droneInfo.dMotor2Throttle.toFixed(lngth)}</td>
                    </tr>
                </table>
            </div>
            <div className="home-box">
                <h2 className="box-title">Fin Deflection</h2>
                <table className="box-table">
                    <tr>
                        <th></th>
                        <th>Deflection</th>
                    </tr>
                    <tr>
                        <td>Fin 1</td>
                        <td>{droneInfo.fin1Deflection.toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Fin 2</td>
                        <td>{droneInfo.fin2Deflection.toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Fin 3</td>
                        <td>{droneInfo.fin3Deflection.toFixed(lngth)}</td>
                    </tr>
                    <tr>
                        <td>Fin 4</td>
                        <td>{droneInfo.fin4Deflection.toFixed(lngth)}</td>
                    </tr>
                </table>
            </div>
            <div className="home-box">
                <h2 className="box-title">Connection</h2>
                <table className="box-table">
                    <tr>
                        <th>Refresh Rate</th>
                        <th>Packet Age (s)</th>
                    </tr>
                    <tr>
                        <td>{droneInfo.refreshRate}</td>
                        <td>{((Date.now() / 1000) - droneInfo.packetTime).toFixed(3)}</td>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default HomeDisplay;