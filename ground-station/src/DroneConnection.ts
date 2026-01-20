import { DroneCommand, DroneConnection, DroneData, initialDroneData } from "./types"

export async function getDroneData(currentConnection:DroneConnection): Promise<DroneConnection>{
    return new Promise<DroneConnection>(async (resolve, reject)=>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: "no-store"
        };

        currentConnection.droneInfo = initialDroneData;
        currentConnection.droneConnected = false;
        if(currentConnection.droneURL == ''){
            resolve(currentConnection);
        }

        try{
            if(currentConnection.droneURL != ''){
                let respsonse = await fetch(currentConnection.droneURL.toString(), (requestOptions as any))
                if(respsonse.status == 200){
                    respsonse.json().then((result)=>{
                        currentConnection.droneInfo = ((result as any) as DroneData)
                        currentConnection.droneConnected = true;
                        resolve(currentConnection);
                    })
                }
            }
        }
        catch(err){
            console.log("Error when getting drone data");
            console.log(err);
            reject(currentConnection)
        }
    });
};

export function sendDroneCommand(droneURL:String, dCommand:DroneCommand): void{
    const requestOptions = {
        method: 'POST',
        cache: 'no-store'
    };
    try{
        const url = `${droneURL}?command=${encodeURIComponent(dCommand.toString().toString())}`;
        fetch(url, (requestOptions as any));
    } catch(err){
        console.log("Error when sending drone command");
        console.log(err);
    }

};