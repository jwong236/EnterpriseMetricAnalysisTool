import React, {useState} from 'react';
import './bargraph.css';
import {BarChart} from '@mui/x-charts/BarChart';
import {FormGroup, FormControl, FormControlLabel, Checkbox, InputLabel, Select, MenuItem, Slider, Box} from '@mui/material';
import RangeSlider from '../RangeSlider/RangeSlider';
import SprintRange from '../SprintRange/SprintRange';

const positive_color = '#2B7D2B';
const negative_color = '#BB0000';

const BarGraph = ({correlations}) => {
    // Turn correlations, which is an array of arrays, into an map with keys metric name and value of correlation against (selected metric)
    // Will change in the future when we figure out our data format
    const dataset = correlations.map((metric) => {
      return { 
        metric: metric[0], 
        positive_correlation: metric[1] < 0 ? 0 : metric[1], 
        negative_correlation: metric[1] > 0 ? 0 : -metric[1]
      }
    })
    
    // Sort the correlation based on correlation magnitude. 
    const sorted_dataset = dataset.sort((a, b) => {
        let aval = a.positive_correlation ? a.positive_correlation : a.negative_correlation;
        let bval = b.positive_correlation ? b.positive_correlation : b.negative_correlation;
        return aval < bval? 1 : -1;
    })

    // used to set the current metric we're comparing against
    const [metric, setMetric] = useState('');

    const handleChange = (event) => {
      setMetric(event.target.value);
    };
    
    let states = {}
    for (let data of dataset) {
      states[data.metric] = true
    }
    // used to keep track of which metrics to compare against the selected metric
    const [state, setState] = useState(states);

    const filtered_dataset = sorted_dataset.filter((data) => { // filter out the metrics that are not selected based on state objects
      return state[data.metric] && data.metric !== metric
    })
    const empty_data = [{metric: "No Metrics Selected", "positive_correlation": 1, "negative_correlation": 1}]
    const use_dataset = filtered_dataset.length ? filtered_dataset : empty_data;  // if no metrics are selected, use empty data

    // handle checkbox changes
    const handleChecks = (event) => { 
      setState({ 
        ...state, 
        [event.target.name]: event.target.checked
      });
    }
    
    // Create checkboxes for each metric
    const checkboxes = sorted_dataset.map((data) => {
        return <FormControlLabel 
        key={data.metric} 
        control={<Checkbox disabled={data.metric === metric} />} 
        checked={state[data.metric]} 
        onChange={handleChecks} 
        name={data.metric} 
        label={data.metric} />
    })
    
    // Creates dropdown items
    const dropdowns = sorted_dataset.map((data) => {
        return <MenuItem key={data.metric} value={data.metric}>{data.metric}</MenuItem>
    })
    
    return (
      <div className="bar-chart-container">
        <div className="metrics-container">
          <h2>Target Metrics</h2>    
            <FormControl fullWidth>
              <InputLabel>Metric</InputLabel>
              <Select
                value={metric}
                label="Metric"
                onChange={handleChange}
              >
                {dropdowns}
              </Select>
            </FormControl>
          <h2>Comparison Metrics </h2>
          <FormGroup>
            {checkboxes}
          </FormGroup>
        </div>

        <div className="bar-container">
          <BarChart
            dataset={use_dataset}
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
    );
}

export default BarGraph;