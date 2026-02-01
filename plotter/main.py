from util import MenuDepth, bcolors
import util
from DroneState import DroneState
import json
import matplotlib.pyplot as plt


menu = MenuDepth.WELCOME
version = "0.0.2"
print(util.bigLogo)
print(f"Version {version}")
while True:
    if menu == MenuDepth.WELCOME:
        selectedMenu = util.selectFromList(["Change connection settings", "Create a new graph", "Open a saved graph", "EXIT"])
        if selectedMenu == "Change connection settings":
            menu = MenuDepth.CONNECTION_SETTINGS
        if selectedMenu == "Create a new graph":
            menu = MenuDepth.PLOT_SELECTOR
        if selectedMenu == "Open a saved graph":
            menu = MenuDepth.GRAPH_LOADER
        if selectedMenu == "EXIT":
            exit()

    if menu == MenuDepth.CONNECTION_SETTINGS:
        print(f"{bcolors.OKBLUE}\nCurrent Connection settings{bcolors.ENDC}")
        with open("./connectionSettings.json", "r") as settingsFile:
            settings = json.load(settingsFile)
        
        lineLength = 20
        print(f"{'URL':<{lineLength}} | " + settings["url"])
        print(f"{'ms between requests':<{lineLength}} | " + str(settings["delay"]) + "\n")

        changeSettings = util.selectFromList(["URL", "ms between requests", "BACK"])

        if changeSettings == "URL":
            newUrl = input("What should the new URL be\n")
            settings["url"] = newUrl
        elif changeSettings == "ms between requests":
            newDelay = util.inputInteger("How many milliseconds between subsequent requests\n", minVal=0)
            settings["delay"] = newDelay
        elif changeSettings == "BACK":
            menu = MenuDepth.WELCOME
            continue

        with open("./connectionSettings.json", "w") as settingsFile:
            json.dump(settings, settingsFile)

    if menu == MenuDepth.PLOT_SELECTOR:
        try:
            with open("./connectionSettings.json", "r") as settingsFile:
                settings = json.load(settingsFile)
            url = settings["url"]
            delay = settings["delay"]
        except Exception as e:
            print(f"{bcolors.FAIL}FAILED TO READ SETTINGS FILE{bcolors.ENDC}")
            print(e)
            break

        graphType = util.selectFromList(["Line graph", "Scatter plot", "BACK"], "Select a type of graph")

        if graphType == "BACK":
            menu = MenuDepth.WELCOME
            continue;
        
      
        # Allows the user to input expressions for the x-axis, and all the series 
        state = DroneState(url)
        xAxisExp = util.inputValidExpression(state, "Write an expression for the X-Axis\n - Write HELP for help and BACK to go back\n", util.printAxisHelpText)
        if(xAxisExp == "BACK"):
            menu = MenuDepth.WELCOME
            continue

        # Each series has its own expression, label and color
        seriesCount = util.inputInteger("How many series should be graphed?\n", f"\n{bcolors.FAIL}Please input a valid integer greater then or equal to 1{bcolors.ENDC}", 1)
        seriesExps = []
        seriesLabels= []
        seriesColors = []

        for i in range(seriesCount):
            axisExp = util.inputValidExpression(state, f"Write an expression for the Y-Axis for series {i+1}\n - Write HELP for help and BACK to go back\n", util.printAxisHelpText)
            if(axisExp == "BACK"):
                menu = MenuDepth.WELCOME
                continue
            seriesExps.append(axisExp)

        xAxisLabel = input(f"Label for the X Axis ({xAxisExp})\n")
        if(xAxisLabel == ""):
            xAxisLabel = xAxisExp
        

        yAxisLabel = ""
        if seriesCount == 1: # If there is only 1 series, then there is no legend and the user only defines a label for the Y-Axis
            yAxisLabel = input(f"Label for the Y Axis ({seriesExps[0]})\n")
            if(yAxisLabel == ""):
                yAxisLabel = seriesExps[0]
            seriesColors.append(util.getSeriesColor(0))
        else:
            yAxisLabel = input("Label for the Y Axis\n")
            for index, series in enumerate(seriesExps):
                lbl = input(f"Label for the series {index+1} ({series})\n")
                if lbl == "":
                    lbl = series
                seriesLabels.append(lbl)
                seriesColors.append(util.getSeriesColor(index))

        maxDP = -1
        if(graphType == "Line graph"):
            maxDP = util.inputInteger("\nMaximum number of data points to be plotted\n Enter -1 for data removal to be disabled\n", minVal=-1)
            util.plotLineGraph(state, xAxisExp, seriesExps, xAxisLabel, yAxisLabel, seriesLabels, seriesColors, maxDP, (delay/1000))
        
        if(graphType == "Scatter plot"):
            util.plotScatterPlot(state, xAxisExp, seriesExps, xAxisLabel, yAxisLabel, seriesLabels, seriesColors, (delay/1000))
        
        # After the graph has been displayed, give the user the option to save the data for easy use next time
        nextAction = util.selectFromList([
            "Save this figure so it can be plotted again",
            "Discard the figure and go back to the main menu"
            "Discard the figure and Exit"
        ], "Select the next action")

        if nextAction == "Save this figure so it can be plotted again":
            with open("./data/graphData.json", "r") as graphFile:
                existingData = json.load(graphFile)
            
            if(existingData['version'] != version):
                print(f"{bcolors.WARNING}The graph save data was produced by a different version of the CLI. Do you want to continue? (Y/n){bcolors.ENDC}")
                if(input().lower() == 'n'):
                    continue

            graphName = input("Enter a name for this graph\n")
            existingData["graphs"].append({
                "name": graphName,
                "type": graphType,
                "xAxisExp": xAxisExp,
                "seriesExps": seriesExps,
                "seriesLabels": seriesLabels,
                "seriesColors": seriesColors,
                "xAxisLabel": xAxisLabel,
                "yAxisLabel": yAxisLabel,
                "maxDP": maxDP
            })
            existingData["version"] = version

            with open("./data/graphData.json", "w") as graphFile:
                json.dump(existingData, graphFile, indent=4)

            print(f"{bcolors.OKGREEN}Succesfully Saved the graph to file!{bcolors.ENDC}")
            menu = MenuDepth.WELCOME
    
        if nextAction == "Discard the figure and go back to the main menu":
            menu = MenuDepth.WELCOME
            continue

        if nextAction == "Discard the figure and Exit":
            exit()
    
    if menu == MenuDepth.GRAPH_LOADER:
        with open("./data/graphData.json", "r") as graphDataFile:
            graphData = json.load(graphDataFile)

        print(f"Found {len(graphData['graphs'])} stored graph formats")
        gNames = list(val["name"] for val in graphData["graphs"])
        gNames.append("BACK")
        graphName = util.selectFromList(gNames)

        if(graphName == "BACK"):
            menu = MenuDepth.WELCOME
            continue

        try:
            with open("./connectionSettings.json", "r") as settingsFile:
                settings = json.load(settingsFile)
            url = settings["url"]
            delay = settings["delay"]
        except Exception as e:
            print(f"{bcolors.FAIL}FAILED TO READ SETTINGS FILE{bcolors.ENDC}")
            print(e)
            break

        chosenGraph = {}
        for elmt in graphData["graphs"]:
            if elmt["name"] == graphName:
                chosenGraph = elmt
                break
        
        state = DroneState(url)

        if(chosenGraph['type'] == 'Line graph'):
            util.plotLineGraph(
                state, 
                chosenGraph["xAxisExp"],
                chosenGraph["seriesExps"],
                chosenGraph["xAxisLabel"],
                chosenGraph["yAxisLabel"],
                chosenGraph["seriesLabels"],
                chosenGraph["seriesColors"],
                chosenGraph["maxDP"],
                (delay / 1000)
                )
        elif(chosenGraph['type'] == 'Scatter plot'):
            util.plotScatterPlot(
                state, 
                chosenGraph["xAxisExp"],
                chosenGraph["seriesExps"],
                chosenGraph["xAxisLabel"],
                chosenGraph["yAxisLabel"],
                chosenGraph["seriesLabels"],
                chosenGraph["seriesColors"],
                (delay / 1000)
            )
        