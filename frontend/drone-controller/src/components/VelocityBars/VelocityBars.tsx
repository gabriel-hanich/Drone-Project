import { useState } from "react";
import "./VelocityBars.css"
import { useConnection } from "../../services/DroneConnection";


const VelocityBars:React.FC = ()=>{
    const scaling = 50;

    let xAcc = useConnection().droneInfo.xAcc * scaling;
    let yAcc = -1 * useConnection().droneInfo.yAcc * scaling;


    return(
        <>
            <div className="container instrument-container">
                <div className="dot"></div>
                <div className={"arrow " + (yAcc == 0 ? 'hidden' : '')} id="arrow-horizontal" style={{width: Math.abs(yAcc), transform: `translate(0%, -50%) rotate3d(0,0,${yAcc > 0 ? 1 : 0},180deg) translateX(${yAcc > 0 ? yAcc : 0}px)`}}>
                    <div className="arrow-head" id="arrow-head-horizontal"></div>
                </div>
                <div className={"arrow " + (xAcc == 0 ? 'hidden' : '')} id="arrow-vertical" style={{height:Math.abs(xAcc), transform: `translate(-50%, 0) rotate3d(${xAcc > 0 ? 1 : 0}, 0, 0, 180deg) translateY(${xAcc > 0 ? xAcc : 0}px)`}}>
                    <div className="arrow-head" id="arrow-head-vertical"></div>
                </div>

            </div>
        </>
    )
}

export default VelocityBars;