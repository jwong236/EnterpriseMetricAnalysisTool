import './App.css';
import React, {useEffect, useState} from 'react';
import {BarGraph, LineGraph} from './components';
import DummyData from './components/DummyData.json';
import DummyData2 from './components/DummyData.json';
import RangeSlider from './components/RangeSlider/RangeSlider';
import SprintRange from './components/SprintRange/SprintRange';
let raw_data = [
  ['Deployment Frequency', [15, 12, 18, 20, 17, 14, 22, 19, 16, 21]],
  ['Lead Time for Changes', [3, 4, 2, 5, 3, 4, 6, 2, 3, 5]],
  ['Avg. Blocked Task Time', [2, 2.5, 2.3, 2.7, 3.1, 2.8, 3, 3.2, 3.2, 3.4]],
  ['Avg. Pull Request Pickup Time', [2, 1, 3, 2, 1, 2, 4, 3, 2, 1]],
  ['Avg. Retro Mood', [4, 3, 5, 4, 3, 5, 4, 3, 5, 4]],
  ['Open Issue Bug Count', [25, 30, 20, 22, 28, 26, 18, 24, 29, 23]],
  ['Refinement Changes', [10, 12, 8, 9, 11, 15, 7, 10, 8, 13]]
]

// let correlations = [
//   ['Deployment Frequency',          -0.409392],
//   ['Lead Time for Changes',          0.429082],
//   ['Avg. Pull Request Pickup Time', -0.624221],
//   ['Avg. Retro Mood',                0.000000],
//   ['Open Issue Bug Count',           0.466147],
//   ['Refinement Changes',             0.802181]
// ]

const correlationMockData = Object.entries(DummyData.Sprint1).map(([key, value]) => {
  return [key, value.Correlation];
});


function App() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [correlations, setCorrelations] = useState([]);

  // const fetchData = async (startDate, endDate) => {
  //   // const response = await fetch(``);
  //   //const data = await response.json();
  //   setCorrelations(correlations);
  // };

  const mockDataFetch = () => {
    // Determine the condition for using DummyData2
    const useDummyData2 = shouldUseDummyData2(startDate, endDate);

    const dataToUse = useDummyData2 ? DummyData2.Sprint1 : DummyData.Sprint1;
    const correlations = Object.entries(dataToUse).map(([key, value]) => {
      return [key, value.Correlation];
    });
    setCorrelations(correlations);
  }
   const shouldUseDummyData2 = (start, end) => {
    console.log("shouldUseDummyData")
    // Example condition: switch if the selected range spans more than a certain number of days
    const startDay = new Date(start).getDate();
    const endDay = new Date(end).getDate();
    return (endDay - startDay) > 10; // Change this based on your specific needs
  };
  useEffect(() => {
    mockDataFetch();
  }, [startDate, endDate])
  
  
  return (
    <>
      <div className="title">
        <h1>Correlation Bar Graph</h1>
      </div>
      <div className="date-range">
        <SprintRange
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          ></SprintRange>
      </div>
      <BarGraph correlations={correlations} />
      {/* <LineGraph raw_data={raw_data} /> */}
  </>
  );
}

export default App
