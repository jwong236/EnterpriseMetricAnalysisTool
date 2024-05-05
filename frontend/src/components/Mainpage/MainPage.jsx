import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BarGraph from "../bargraph/bargraph";
import MetricList from "../MetricList/MetricList";
import RangeSlider from "../RangeSlider/RangeSlider";
import LineGraph from "../linegraph/linegraph";

export default function MainPage() {
  const metrics = [
    "Deployment Frequency",
    "Lead Time for Changes",
    "Avg. Retro Mood",
    "Open Issue Bug Count",
    "Refinement Changes",
    "Avg. Pull Request Turnaround Time",
  ];

  const dummyRawData = [
    { name: "Deployment Frequency", values: [5, 10, 15, 20, 18, 16, 14, 12, 10, 8] },
    { name: "Lead Time for Changes", values: [7, 8, 7, 6, 5, 4, 3, 4, 5, 6] },
    { name: "Avg. Retro Mood", values: [3, 4, 5, 5, 3, 2, 4, 5, 4, 3] },
    { name: "Open Issue Bug Count", values: [10, 9, 7, 8, 6, 5, 4, 3, 2, 1] },
    { name: "Refinement Changes", values: [2, 2, 3, 4, 5, 5, 6, 7, 8, 9] },
    { name: "Avg. Pull Request Turnaround Time", values: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3] }
  ];
  const dummyCorrelationData = {
    correlations: {
        "Deployment Frequency": 0.9,
        "Lead Time for Changes": -0.5,
        "Avg. Retro Mood": 0.3,
        "Open Issue Bug Count": -0.2,
        "Refinement Changes": 0.1,
        "Avg. Pull Request Turnaround Time": 0.6
    }
};

  const [dateRange, setDateRange] = useState([new Date('2023-01-01'), new Date('2023-12-31')]);
  const [barGraphMainMetric, setBarGraphMainMetric] = useState(metrics[0]);
  const [barGraphMetrics, setBarGraphMetrics] = useState(
    metrics.reduce((acc, metric) => ({ ...acc, [metric]: true }), {})
  );
  const [lineGraphMetrics, setLineGraphMetrics] = useState(
    metrics.reduce((acc, metric) => ({ ...acc, [metric]: true }), {})
  );
  const [correlations, setCorrelations] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const formatDate = (date) => date.toISOString().split('T')[0];
  //     const metric = barGraphMainMetric.replace(/\s+/g, '_').toLowerCase();  // Ensure metric is in correct format
  //     const url = `http://127.0.0.1:5000/v1/correlation?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}&main_metric=${metric}`;

  //     try {
  //       const response = await fetch(url);
  //       if (!response.ok) throw new Error('Network response was not ok');
        
  //       const data = await response.json();
  //       const apiCorrelations = data.correlations || {};

  //       // Fill in missing data from dummyCorrelationData
  //       const fullCorrelations = {...dummyCorrelationData.correlations}; // Start with dummy data
  //       for (const key in apiCorrelations) {
  //         fullCorrelations[key] = apiCorrelations[key]; // Overwrite with API data where available
  //       }

  //       setCorrelations({correlations: fullCorrelations});
  //     } catch (error) {
  //       console.error('Failed to fetch correlations:', error);
  //       setCorrelations(dummyCorrelationData); // Use dummy data if fetch fails
  //     }
  //   };

  //   fetchData();
  // }, [dateRange, barGraphMainMetric, dummyCorrelationData]);  // Include dummyCorrelationData in dependency array if it can change



  const handleRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const handleBarGraphMainMetricChange = (event) => {
    setBarGraphMainMetric(event.target.value);
  };

  const handleBarGraphMetricChange = (event) => {
    setBarGraphMetrics({
      ...barGraphMetrics,
      [event.target.name]: event.target.checked,
    });
  };

  const handleLineGraphMetricChange = (event) => {
    setLineGraphMetrics({
      ...lineGraphMetrics,
      [event.target.name]: event.target.checked,
    });
  };

  const cardBackgroundStyle = { 
    margin: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f6f6f6"
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#EBF8FF", alignItems: 'center'}}>
      <Typography variant='h3' color='black' sx={{margin: '2rem 1rem 1rem 1rem'}}>UCICapstone2024 Enterprise Metric Analysis Tool</Typography>
      <RangeSlider sx={{...cardBackgroundStyle, width: '80%'}} range={dateRange} onRangeChange={handleRangeChange} />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <MetricList
          sx={cardBackgroundStyle}
          dropDownMetric={barGraphMainMetric}
          metrics={barGraphMetrics}
          onDropDownMetricChange={handleBarGraphMainMetricChange}
          onMetricChange={handleBarGraphMetricChange}
          setMetrics={setBarGraphMetrics}
          showDropdownMetric={true}
        />
        <BarGraph
          sx={cardBackgroundStyle}
          correlations={dummyCorrelationData}
          mainMetric={barGraphMainMetric}
          comparedMetrics={barGraphMetrics}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <MetricList
          sx={cardBackgroundStyle}
          metrics={lineGraphMetrics}
          onMetricChange={handleLineGraphMetricChange}
          setMetrics={setLineGraphMetrics}
          showDropdownMetric={false}
        />
        <LineGraph
          sx={cardBackgroundStyle}
          metrics={dummyRawData}
        />
      </Box>
    </Box>
  );
}
