import React from 'react';
import './linegraph.css';
import {LineChart} from '@mui/x-charts/LineChart';
import {FormGroup, FormControlLabel, Checkbox} from '@mui/material';

let LineGraph = ({raw_data}) => {

    raw_data = [
      ['Deployment Frequency', [15, 12, 18, 20, 17, 14, 22, 19, 16, 21]],
      ['Lead Time for Changes', [3, 4, 2, 5, 3, 4, 6, 2, 3, 5]],
      ['Avg. Blocked Task Time', [2, 2.5, 2.3, 2.7, 3.1, 2.8, 3, 3.2, 3.2, 3.4]],
      ['Avg. Pull Request Pickup Time', [2, 1, 3, 2, 1, 2, 4, 3, 2, 1]],
      ['Avg. Retro Mood', [4, 3, 5, 4, 3, 5, 4, 3, 5, 4]],
      ['Open Issue Bug Count', [25, 30, 20, 22, 28, 26, 18, 24, 29, 23]],
      ['Refinement Changes', [10, 12, 8, 9, 11, 15, 7, 10, 8, 13]]
    ]

    let states = {}    
    for (let data of raw_data) {
      states[data[0]] = false  
    }
    const [state, setState] = React.useState(states);

    // handle checkbox changes
    let checkboxes = []
    const handleChecks = (event) => { 
      setState({ 
        ...state, 
        [event.target.name]: event.target.checked
      });
    }
    for (let data of raw_data) {
      checkboxes.push(<FormControlLabel control={<Checkbox />} label={data[0]} name={data[0]} checked={state[data[0]]} onChange={handleChecks} />)
    }

    const get_series = raw_data.filter((data) => {
      console.log(state[data[0]])
      return state[data[0]];
    }).map((data) => {
      return {label: data[0], data: data[1]}
    })
    console.log(get_series)

    return (
      <>
      <div class="line-chart-container">
        <div class="center-container">
          <h1>Check Metrics</h1>
          <FormGroup>
          {checkboxes}
          </FormGroup>
        </div>
  
        <div class="center-container">
          <p>Raw Data</p>
          <LineChart
            yAxis={[{label: 'Metric Value'}]}
            xAxis={[{data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], label: 'Sprint Number'}]}
            series={get_series}
            layout="horizontal"
            height={600}
            width={600}
          />
        </div>
      </div>
      </>
    );
}

export default LineGraph;