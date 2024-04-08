import './App.css';
import React from 'react';
import {MyBarGraph, MyLineGraph} from './components';

let raw_data = {
  'Deployment Frequency': [15, 12, 18, 20, 17, 14, 22, 19, 16, 21],
  'Lead Time for Changes': [3, 4, 2, 5, 3, 4, 6, 2, 3, 5],
  'Time to Restore Service': [4, 6, 2, 5, 4, 3, 7, 4, 3, 5],
  'Change Failure Rate': [0.1, 0.2, 0.05, 0.15, 0.1, 0.25, 0.2, 0.1, 0.15, 0.05],
  'Avg. Blocked Task Time': [2, 2.5, 2.3, 2.7, 3.1, 2.8, 3, 3.2, 3.2, 3.4],
  'Avg. Pull Request Pickup Time': [2, 1, 3, 2, 1, 2, 4, 3, 2, 1],
  'Avg. Retro Mood': [4, 3, 5, 4, 3, 5, 4, 3, 5, 4],
  'Open Issue Bug Count': [25, 30, 20, 22, 28, 26, 18, 24, 29, 23],
  'Refinement Changes': [10, 12, 8, 9, 11, 15, 7, 10, 8, 13]
}

let correlations = [
  ['Deployment Frequency',          -0.409392],
  ['Lead Time for Changes',          0.429082],
  ['Change Failure Rate',            0.516650],
  ['Time to Restore Service',        0.164581],
  ['Avg. Pull Request Pickup Time', -0.624221],
  ['Avg. Retro Mood',                0.000000],
  ['Open Issue Bug Count',           0.466147],
  ['Refinement Changes',             0.802181]
]

function App() {
  return (
    <>
    <MyBarGraph correlations={correlations}/>
    <MyLineGraph raw_data={raw_data}/>
    </>
  )
}

export default App
