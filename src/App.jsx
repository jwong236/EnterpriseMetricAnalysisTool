import './App.css';
import React from 'react';
// import {Bargraph} from './components';
import {BarChart} from '@mui/x-charts/BarChart';
import {LineChart} from '@mui/x-charts/LineChart';
import {FormGroup, FormControl, FormControlLabel, Checkbox, InputLabel, Select, MenuItem} from '@mui/material';

let raw_data = {
  'Deployment Frequency': [15, 12, 18, 20, 17, 14, 22, 19, 16, 21],
  'Lead Time for Changes': [3, 4, 2, 5, 3, 4, 6, 2, 3, 5],
  'Change Failure Rate': [0.1, 0.2, 0.05, 0.15, 0.1, 0.25, 0.2, 0.1, 0.15, 0.05],
  'Time to Restore Service': [4, 6, 2, 5, 4, 3, 7, 4, 3, 5],
  'Open Issue Bug Count': [25, 30, 20, 22, 28, 26, 18, 24, 29, 23],
  'Average Pull Request Pickup Time': [2, 1, 3, 2, 1, 2, 4, 3, 2, 1],
  'Refinement Changes': [10, 12, 8, 9, 11, 15, 7, 10, 8, 13],
  'Task Block Time': [2, 3, 1, 2, 3, 4, 2, 1, 2, 3],
  'Meeting Satisfaction': [4, 3, 5, 4, 3, 5, 4, 3, 5, 4]
}

// function toJSON(data){
//   let ret = []
//   for (let key in data){
//     ret.push({metric: key, values: data[key]})
//   }
//   return ret;
// }

// raw_data = toJSON(raw_data);

let correlations = [
  ['Deployment Frequency',       -0.409392],
  ['Lead Time for Changes',       0.429082],
  ['Change Failure Rate',         0.516650],
  ['Time to Restore Service',     0.164581],
  ['Open Issue Bug Count',        0.466147],
  ['Pull Request Pickup Time',   -0.624221],
  ['Refinement Changes',          0.802181],
  ['Meeting Satisfaction',        0.000000]
]

let dataset = correlations.map((metric) => {
  if ( metric[1] < 0 ){
    return {metric: metric[0], positive_correlation: 0, negative_correlation: -metric[1]}
  }
  return {metric: metric[0], positive_correlation: metric[1], negative_correlation: 0}
});

dataset = dataset.sort((a, b) => {
  let aval = a.positive_correlation ? a.positive_correlation : a.negative_correlation;
  let bval = b.positive_correlation ? b.positive_correlation : b.negative_correlation;
  return aval < bval? 1 : -1;
})

// const positive_color = '#0057D2';
// const negative_color = '#AA0808';
const positive_color = '#AA0808';
const negative_color = '#0057D2';

const checkboxes = dataset.map((data) => {
  return <FormControlLabel control={<Checkbox />} label={data.metric} />
})

const dropdowns = dataset.map((data) => {
  return <MenuItem value={data.metric}>{data.metric}</MenuItem>
})
// [`Deployment Frequency`, 
//                 `Lead Time for Changes`, 
//                 `Change Failure Rate`, 
//                 `Time to Restore Service`, 
//                 `Open Issue Bug Count`, 
//                 `Pull Request Pickup Time`, 
//                 `Refinement Changes`, 
//                 `Task Block Time`, 
//                 `Meeting Satisfaction`]

const include = [`Refinement Changes`, 
                `Task Block Time`]

const get_series = include.map((metric) => {
  return {label: metric, data: raw_data[metric]}
})

function App() {
  const [metric, setMetric] = React.useState('');

  const handleChange = (event) => {
    setMetric(event.target.value);
  };

  return (
    <>

    <div class="bar-chart-container">
      <div class="chart">
        <h1>Compare Against...</h1>
        <FormGroup>
          {checkboxes}
          <FormControlLabel control={<Checkbox />} label="Average Task Blocked Time" />
          <FormControlLabel control={<Checkbox />} label="All" />
        </FormGroup>
      </div>

      <div class="chart">
        <p>Correlation of:         
          <FormControl fullWidth>
            <InputLabel>Metric</InputLabel>
            <Select
              value={metric}
              label="Metric"
              onChange={handleChange}
            >
              {dropdowns}
              <MenuItem value="Average Task Blocked Time">Average Task Blocked Time</MenuItem>
            </Select>
          </FormControl>
        </p>
        <BarChart
          dataset={dataset}
          yAxis={[{ scaleType: 'band', dataKey: 'metric' }]}
          series={[{ dataKey: 'positive_correlation', label: 'Positive Correlation', color: positive_color, stack: 'total'},
                  { dataKey: 'negative_correlation', label: 'Negative Correlation', color: negative_color, stack: 'total'}]}
          layout="horizontal"
          height={400}
          width={600}
          margin={{left: 300}}
        />
      </div>
    </div>


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
  )
}

export default App
