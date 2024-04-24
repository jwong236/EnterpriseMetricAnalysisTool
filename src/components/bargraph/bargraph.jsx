import React from 'react';
import './bargraph.css';
import {BarChart} from '@mui/x-charts/BarChart';
import {FormGroup, FormControl, FormControlLabel, Checkbox, InputLabel, Select, MenuItem} from '@mui/material';

// const positive_color = '#0057D2';
// const negative_color = '#AA0808';
const positive_color = '#2B7D2B';
const negative_color = '#BB0000';

const BarGraph = ({correlations}) => {
    const [metric, setMetric] = React.useState('');

    const handleChange = (event) => {
      setMetric(event.target.value);
    };

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
    
    const checkboxes = dataset.map((data) => {
        return <FormControlLabel control={<Checkbox />} label={data.metric} />
    })
    
    const dropdowns = dataset.map((data) => {
        return <MenuItem value={data.metric}>{data.metric}</MenuItem>
    })

    return (
    <>
    <div class="bar-chart-container">
      <div class="metrics-container">
        <h1>Select Metrics </h1>
        <FormGroup>
          {checkboxes}
          <FormControlLabel control={<Checkbox />} label="Average Task Blocked Time" />
          <FormControlLabel control={<Checkbox />} label="All" />
        </FormGroup>
      </div>

      <div class="bar-container">
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
    </>
    );
}

export default BarGraph;