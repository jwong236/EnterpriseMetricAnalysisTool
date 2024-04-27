import React from 'react';
import './linegraph.css';
import {LineChart} from '@mui/x-charts/LineChart';
import {FormGroup, FormControlLabel, Checkbox} from '@mui/material';

let LineGraph = ({raw_data}) => {

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
      checkboxes.push(<FormControlLabel key={data[0]} control={<Checkbox />} label={data[0]} name={data[0]} checked={state[data[0]]} onChange={handleChecks} />)
    }

    const get_series = raw_data.filter((data) => {
      return state[data[0]];
    }).map((data) => {
      return {label: data[0], data: data[1]}
    })

    return (
      <>
      <div className="line-chart-container">
        <div className="center-container">
          <h1>Check Metrics</h1>
          <FormGroup>
          {checkboxes}
          </FormGroup>
        </div>
  
        <div className="center-container">
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