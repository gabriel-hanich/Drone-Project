import { useState } from "react";
import "./VelocityBars.css"
import { useConnection } from "../../services/DroneConnection";


const VelocityBars:React.FC = ()=>{
    const scaling = 50;

    let xVel = useConnection().droneInfo.xVel * scaling;
    let yVel = -1 * useConnection().droneInfo.yVel * scaling;


    return(
        <>
            <div className="container instrument-container">
                <div className="dot"></div>
                <div className="arrow" id="arrow-horizontal" style={{width: Math.abs(yVel), transform: `translate(0%, -50%) rotate3d(0,0,${yVel > 0 ? 1 : 0},180deg) translateX(${yVel > 0 ? yVel : 0}px)`}}>
                    <div className="arrow-head" id="arrow-head-horizontal"></div>
                </div>
                <div className="arrow" id="arrow-vertical" style={{height:Math.abs(xVel), transform: `translate(-50%, 0) rotate3d(${xVel > 0 ? 1 : 0}, 0, 0, 180deg) translateY(${xVel > 0 ? xVel : 0}px)`}}>
                    <div className="arrow-head" id="arrow-head-vertical"></div>
                </div>

            </div>
        </>
    )
}

export default VelocityBars;