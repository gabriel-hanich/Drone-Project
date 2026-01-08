from enum import Enum
import random
import matplotlib.pyplot as plt

# Source: https://stackoverflow.com/questions/287871/how-do-i-print-colored-text-to-the-terminal
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def selectFromList(lst, prompt="Select one of the following", failMsg=f"{bcolors.FAIL}Please type a number corresponding to one of the options{bcolors.ENDC}"):
    '''Allows the user to select a value from a list of values, returns the selected value'''
    print(prompt)
    for valIndex, val in enumerate(lst):
        print(f"{valIndex + 1}. " + val)

    res = input("-> ")

    try:
        val = int(res)
        return lst[val-1]
    except Exception:
        print(failMsg)
        return selectFromList(lst, prompt, failMsg)


def inputValidExpression(state, prompt, helpFunction):
    '''
    Allows the user to an expression, which is then validated to ensure it does not produce an error,
    before the expression is returned as a string
    '''
    while True:
        expression = input(prompt)

        if(expression == "HELP"):
            helpFunction()
            continue
        if(expression == "BACK"):
            return "BACK"
                        
        try:
            testVal = eval(expression)
            return expression
        except Exception:
            print(f"\n{bcolors.FAIL}Your expression produced an error, please write a new one{bcolors.ENDC}")
            continue    

def inputInteger(prompt="Please enter an integer", failText="Please input a valid integer", minVal=None, maxVal=None):
    '''
    Allows the user to input an integer, validates the integer is correct before
    returning the correct value in an int format
    '''

    while True:
        strVal = input(prompt)

        try:
            intVal = int(strVal)
            if(minVal == None or intVal >= minVal) and (maxVal == None or intVal <= maxVal):
                return intVal
            else:
                raise Exception
        except Exception:
            print(failText)

class MenuDepth(Enum):
    WELCOME = 0.0
    SETUP = 1.0
    CONNECTION_SETTINGS = 2.0
    PLOT_SELECTOR = 3.0
    PLOT_VIEWER = 3.1
    GRAPH_LOADER = 4.0



bigLogo = """
  _____           _           _      _____ _       _ _       
 |  __ \         (_)         | |    / ____| |     | | |      
 | |__) | __ ___  _  ___  ___| |_  | (___ | |_ ___| | | __ _ 
 |  ___/ '__/ _ \| |/ _ \/ __| __|  \___ \| __/ _ \ | |/ _` |
 | |   | | | (_) | |  __/ (__| |_   ____) | ||  __/ | | (_| |
 |_|   |_|  \___/| |\___|\___|\__| |_____/ \__\___|_|_|\__,_|
                _/ |                                         
  _____        |__/      __      ___                         
 |  __ \      | |        \ \    / (_)                        
 | |  | | __ _| |_ __ _   \ \  / / _  _____      _____ _ __  
 | |  | |/ _` | __/ _` |   \ \/ / | |/ _ \ \ /\ / / _ \ '__| 
 | |__| | (_| | || (_| |    \  /  | |  __/\ V  V /  __/ |    
 |_____/ \__,_|\__\__,_|     \/   |_|\___| \_/\_/ \___|_|    
"""


def printAxisHelpText():
    print("You can write any valid python expression, and it will be calculated and the value will be plotted")
    print("All the values are stored within an object called `state`. Thus, to have time on the xAxis, write `state.time`")
    print("Below is a list of all the possible variables and a short explanation of what they do")

    linelength = 20
    print(f"{'Variable':<{linelength}} | Explanation")
    print('-'*linelength * 3)
    print(f"{'time':<{linelength}} | Rolling time scale, shows the last n seconds of data")
    print(f"{'opTime':<{linelength}} | Number of milliseconds since drone was armed")
    print(f"{'epochTime':<{linelength}} | Epoch time (number of milliseconds since 01/01/1970)")
    print(f"{'refreshRate':<{linelength}} | The number of milliseconds between each successive packet")
    print(f"{'packetAge':<{linelength}} | The number of milliseconds in the past that the data was captured by the drone")
    print(f"{'pitch':<{linelength}} | The current Pitch of the drone")
    print(f"{'roll':<{linelength}} | The current Roll of the drone")
    print(f"{'yaw':<{linelength}} | The current Yaw of the drone")
    print(f"{'pitchSetPoint':<{linelength}} | The current setpoint for the Pitch of the drone")
    print(f"{'rollSetPoint':<{linelength}} | The current setpoint for the Roll of the drone")
    print(f"{'yawSetPoint':<{linelength}} | The current setpoint for the Yaw of the drone")
    print(f"{'pitchAcc':<{linelength}} | The current acceleration of the drone's Pitch")
    print(f"{'rollAcc':<{linelength}} | The current acceleration of the drone's Roll")
    print(f"{'yawAcc':<{linelength}} | The current acceleration of the drone's Yaw")
    print(f"{'pitchSetPoint':<{linelength}} | The current setpoint for the acceleration of the drone's Pitch")
    print(f"{'rollSetPoint':<{linelength}} | The current setpoint for the acceleration of the drone's Roll")
    print(f"{'yawSetPoint':<{linelength}} | The current setpoint for the acceleration of the drone's Yaw")
    print(f"{'xAcc':<{linelength}} | The current acceleration of the drone in the X axis")
    print(f"{'yAcc':<{linelength}} | The current acceleration of the drone in the Y axis")
    print(f"{'zAcc':<{linelength}} | The current acceleration of the drone in the Z axis")
    print(f"{'xAccSetPoint':<{linelength}} | The current setpoint for the drone's acceleration in the X axis")
    print(f"{'yAccSetPoint':<{linelength}} | The current setpoint for the drone's acceleration in the Y axis")
    print(f"{'zAccSetPoint':<{linelength}} | The current setpoint for the drone's acceleration in the Z axis")
    print(f"{'elevation':<{linelength}} | The drone's current height above the ground")
    print(f"{'elevationSetPoint':<{linelength}} | The intended height of the drone above ground")
    print(f"{'dMotor1Throttle':<{linelength}} | The current throttle of the top drive motor")
    print(f"{'dMotor2Throttle':<{linelength}} | The current throttle of the bottm drive motor")
    print(f"{'fin1Deflection':<{linelength}} | The current deflection of fin 1")
    print(f"{'fin2Deflection':<{linelength}} | The current deflection of fin 2")
    print(f"{'fin3Deflection':<{linelength}} | The current deflection of fin 3")
    print(f"{'fin4Deflection':<{linelength}} | The current deflection of fin 4")


    print()
    print("Using these values, you could calculate the absolute error in the drone's height by entering")
    print("abs(state.elevation - state.elevationSetPoint)\n")


def getSeriesColor(index):
    '''
    Returns a unique color for each index value less then 10. 
    For indices greater then 10, returns a random color. Colors are
    returned as HEX strings
    '''

    cList = [
        "#940d0d",
        "#2403fc",
        "#d97d14",
        "#c609db",
        "#0cab71",
        "#520d30",
        "#6c62c4",
        "#204245",
        "#f20c60",
        "#133d09"
    ]
    if (index <= 9):
        return cList[index]
     
    # Source https://stackoverflow.com/questions/13998901/generating-a-random-hex-color-in-python
    r = lambda: random.randint(0,255)
    return '#%02X%02X%02X' % (r(),r(),r())

def addGraphData(existingData, expression, state, maxDP):
    newVal = eval(expression)
    existingData.append(newVal)

    if(len(existingData) > maxDP) and maxDP != -1:
        existingData = existingData[(len(existingData) - maxDP):]

    return existingData
    
def nestedMin(lst):
    '''Where lst is a list of lists, returns the smallest value in any of the lists'''
    minVal = None
    for inner in lst:
        m = min(inner)
        if(minVal == None or m < minVal):
            minVal = m
    
    return minVal

def nestedMax(lst):
    '''Where lst is a list of lists, returns the largest value in any of the lists'''
    maxVal = None
    for inner in lst:
        m = max(inner)
        if(maxVal == None or m > maxVal):
            maxVal = m
    
    return maxVal



def plotLineGraph(state, xAxisExp, seriesExps, xAxisLabel, yAxisLabel, seriesLabels, seriesColors, maxDP):
    """
    Plots a line graph that updates in real time
    - state is the current DroneState object
    - xAxisExp is a string which holds the expression used to calculate 
    the X-values for the graph
    - seriesExps is a list of strings, where each string is an expression
    used to calculate the Y-value for one of the series
    - xAxisLabel is a string which will be used to label the X-Axis 
    - yAxisLabel is a string which will be used to label the Y-Axis 
    - seriesLabels is a list of strings that will be used in the plot
    legend to describe the series
    - seriesColors is a list of the colors that each series will be 
    - maxDP is the maximum number of datapoints that will be plotted on
    the graph. Set to -1 for all datapoints to be graphed
    """
    seriesCount = len(seriesExps)
    x = [0]
    y = list([0] for _ in range(seriesCount))
    graphLines = []

    for i in range(seriesCount):
        if(seriesCount == 1):
            line, = plt.plot(x, y[i])
        else:
            line, = plt.plot(x, y[i], label=seriesLabels[i], c=seriesColors[i])
        graphLines.append(line)

    if(seriesCount > 1):
        plt.legend(loc='upper left')
    win = plt.gcf() # Get the current window

    while(True):
        if not plt.fignum_exists(win.number): # Break the loop if the user closes the window
            break

        x = addGraphData(x, xAxisExp, state, maxDP)
        for i in range(seriesCount):
            y[i] = addGraphData(y[i], seriesExps[i], state, maxDP)
            graphLines[i].set_data(x, y[i])
        
        plt.xlim(min(x)-1, max(x)+1)
        plt.ylim(nestedMin(y)-0.1, nestedMax(y)+0.1)
        plt.xlabel(xAxisLabel)
        plt.ylabel(yAxisLabel)

        state.randomiseVals()
        plt.pause(0.25)

def plotScatterPlot(state, xAxisExp, seriesExps, xAxisLabel, yAxisLabel, seriesLabels, seriesColors):
    seriesCount = len(seriesExps)
    x = [0]
    y = list([0] for _ in range(seriesCount))


    if(seriesCount > 1):
        for i in range(seriesCount):
            plt.scatter(0, 0, color=seriesColors[i], label=seriesLabels[i])
        plt.legend(loc='upper left')
    win = plt.gcf() # Get the current window
    minX = 0
    maxX = 0
    minY = 0
    maxY = 0

    while(True):
        if not plt.fignum_exists(win.number): # Break the loop if the user closes the window
            break
        
        x = eval(xAxisExp)
        if(x < minX):
            minX = x
        if(x > maxX):
            maxX = x
        for i in range(seriesCount):
            y = eval(seriesExps[i])
            if(y < minY):
                minY = y
            if(y > maxY):
                maxY = y
            
            if(seriesCount == 1):
                plt.scatter(x, y, color=seriesColors[i])
            else:
                plt.scatter(x, y, color=seriesColors[i], label=seriesLabels[i])
        
        plt.xlim(minX-0.1, maxX+0.1)
        plt.ylim(minY-0.1, maxY+0.1)
        plt.xlabel(xAxisLabel)
        plt.ylabel(yAxisLabel)

        state.getNewData()
        plt.pause(0.25)