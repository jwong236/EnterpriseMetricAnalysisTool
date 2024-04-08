import './App.css'
// import {Bargraph} from './components';
import {BarChart} from '@mui/x-charts/BarChart'

let dataset = [
  {
    metric: "Deployment Frequency",
    negative_correlation: 0.3
  },
  {
    metric: "Open Issue Bug Count",
    positive_correlation: 0.5
  },
  {
    metric: "Average Pull Request Pickup Time",
    negative_correlation: 0.6
  },
  {
    metric: "Retrospective Meeting Satisfaction",
    negative_correlation: 0.2
  },
  {
    metric: "Mid-Sprint Refinement Changes",
    positive_correlation: 0.8
  }
]

dataset = dataset.sort((a, b) => {
  let aval = a.hasOwnProperty('positive_correlation') ? a.positive_correlation : a.negative_correlation;
  let bval = b.hasOwnProperty('positive_correlation') ? b.positive_correlation : b.negative_correlation;
  return aval < bval? 1 : -1;
})

const positive_color = '#0057D2';
const negative_color = '#AA0808';

function App() {

  return (
    <>
    <div>
      <p>Rollover Rate vs. Metrics</p>
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
    </>
  )
}

export default App
