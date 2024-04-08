import React from 'react';
import './linegraph.css';
import {LineChart} from '@mui/x-charts/LineChart';
import {FormGroup, FormControlLabel, Checkbox} from '@mui/material';

let raw_data = {
    'Deployment Frequency': [15, 12, 18, 20, 17, 14, 22, 19, 16, 21],
    'Lead Time for Changes': [3, 4, 2, 5, 3, 4, 6, 2, 3, 5],
    'Time to Restore Service': [4, 6, 2, 5, 4, 3, 7, 4, 3, 5],
    'Change Failure Rate': [0.1, 0.2, 0.05, 0.15, 0.1, 0.25, 0.2, 0.1, 0.15, 0.05],
    'Avg. Blocked Task Time': [2, 2.5, 2.3, 2.7, 3.1, 2.8, 3, 3.2, 3.2, 3.4],
    'Avg. Pull Request Pickup Time': [2, 1, 3, 2, 1, 2, 4, 3, 2, 1],
    'Avg. Retro Mood': [4, 3, 5, 4, 3, 5, 4, 3, 5, 4],
    'Open Issue Bug Count': [25, 30, 20, 22, 28, 26, 18, 24, 29, 23],
    'Refinement Changes': [10, 12, 8, 9, 11, 15, 7, 10, 8, 13],
}
  
let LineGraph = () => {
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
        <div class="chart">
          <h1>Check Metrics</h1>
          <FormGroup>
          {checkboxes}
          <FormControlLabel control={<Checkbox />} label="Average Task Blocked Time" />
          </FormGroup>
        </div>
  
        <div class="chart">
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