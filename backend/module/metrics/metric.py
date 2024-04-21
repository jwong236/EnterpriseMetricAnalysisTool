import functions

# Function registration table
getMetricDataFunctions = [
    ... # add the functions to the table
]

# This class gives a "strategy" getData(). The strategy should give data needed for the metrics
class Metric:
    def __init__(self, startSprint, endSprint):
        self.startSprint = startSprint
        self.endSprint = endSprint
    
    # getMetricData is a function
    # return: a list of numbers. EX: [1,3,2] for rollover times in 3 sprints
    # the result can be used to calculate the correlation score
    def getData(self, getMetricData):
        return getMetricData(self.startSprint, self.endSprint)
    