import React from 'react';
import './linegraph.css';
import {LineChart} from '@mui/x-charts/LineChart';
import {FormGroup, FormControlLabel, Checkbox} from '@mui/material';
  
let LineGraph = ({raw_data}) => {
    let checkboxes = []
    for (let data in raw_data) {
        checkboxes.push(<FormControlLabel control={<Checkbox />} label={data} />)
    }
    
    // [`Deployment Frequency`, 
    // `Lead Time for Changes`, 
    // `Change Failure Rate`, 
    // `Time to Restore Service`, 
    // `Open Issue Bug Count`, 
    // `Pull Request Pickup Time`, 
    // `Refinement Changes`, 
    // `Task Block Time`, 
    // `Meeting Satisfaction`]
    
    const include = [`Refinement Changes`, 
                    `Avg. Blocked Task Time`]
    
    const get_series = include.map((metric) => {
        return {label: metric, data: raw_data[metric]}
    })

    return (
      <>
      <div class="line-chart-container">
        <div class="center-container">
          <h1>Check Metrics</h1>
          <FormGroup>
          {checkboxes}
          <FormControlLabel control={<Checkbox />} label="Average Task Blocked Time" />
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