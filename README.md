# Drone-Controller
Software to fly, operate and analyse a single-propellor drone. Developed by the Dynamics and Control subteam within ANU Rocketry. 

This repo contains ESP32 firmware that reads values from the sensors, run a control system and operates a web server to enable communication with the drone over Wifi. This is found within `./drone-firmware`

The `./ground-station` folder contains a web-server that acts as a bridge between the website and the drone. The webserver talks to both, thus avoiding any requirement for the website to maintain direct connection to the drone.

`./frontend` Contains a React website that is capable of reading data from the ground-station and displaying it. It also enables the user to issue commands to the drone and tune it's control system. 

The `./plotter` tool enables real-time graphing of any of the variables sent back by the drone. 


# Setup
To start, clone the repo using `gh repo clone gabriel-hanich/Drone-Project`

## Drone Firmware.
The Drone Firmware can be flashed to an ESP32 using the [PlatformIO](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide) VS Code Extension. Once you the extension has been downloaded, open the `./drone-firmware` folder as a PlatformIO project. This can be done by opening the PlatformIO home page and then selecting `Open Project`. 

The extension will then download the arduino modules necessary for the project and do other configuration steps. 

As these configuration updates are occuring, the program constants need to be defined. Open the file `./drone-firmware/src/ProgramConstants.h` and fill in the struct. The name of the WiFi network should be put into the `ssid` value, and it's password into the `password` value. The port can also be changed, or left at it's default value of 80.

Once this has been completed, connect the ESP32 to the computer. Then, by using the command menu accessed by pressing `CTRL+SHIFT+P`, run `PlatformIO: Upload`, which will build and upload the code to the ESP32. 

Running the `PlatformIO: Serial Monitor` will then show the values being sent back to the computer over Serial. This provides enough information to connect the ground station tool to the drone over WiFi. 

## Ground Station
The Ground Station software is written as an ExpressJS webserver. To run it, first ensure that you have downloaded and set up [NodeJS](https://nodejs.org/en/download). Then, download [TypeScript](https://www.typescriptlang.org/) by running `npm install -g typescript`. Finally, you need to download [ts-node](https://www.npmjs.com/package/ts-node), which is a tool that allows NodeJS to work with TypeScript. This can be done by running `npm install -g ts-node`. 

After both of these tools have been downloaded, open the `./ground-station` directory as your current working directory, and run `npm i` to download all of the dependencies required for the project. This may take a little while depending on how much you have used nodeJS.

Once all of the packages have been downloaded, the webserver can be started by running the command `npm start`. If you see `The main server is running at http://localhost:8080/` then everything has worked succesfully. 

## Website
The Website also runs using NodeJS. Thus, you will not need to download NodeJS again if already have for Ground-Station. The website dependencies can be downloaded by opening `./frontend/drone-controller` and running `npm i`.

Once that has been completed, the website can be ran locally by running `npm start`. Then open `http://localhost:3000` to see the website. 

Further information on using the website can be found in the master doc within the software chapter. 

## Plotter
To use the plotter, make sure that you have [Python](https://www.python.org/downloads/) downloaded. Then, use pip to install [matplotlib](https://pypi.org/project/matplotlib/) using `pip install matplotlib`. Then the plotter can be accessed by running `main.py`.