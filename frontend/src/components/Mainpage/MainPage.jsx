import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import "./MainPage.css";
import BarGraph from "../bargraph/bargraph";
import MetricList from "../MetricList/MetricList";
import RangeSlider from "../RangeSlider/RangeSlider";



export default function MainPage() {
  const metrics = [
    "Deployment Frequency",
    "Lead Time for Changes",
    "Avg. Retro Mood",
    "Open Issue Bug Count",
    "Refinement Changes",
    "Avg. Pull Request Turnaround Time",
  ];
  const dummyCorrelationValues = [
    ["Deployment Frequency", 0.9],
    ["Lead Time for Changes", -0.5],
    ["Avg. Retro Mood", 0.3],
    ["Open Issue Bug Count", -0.2],
    ["Refinement Changes", 0.1],
    ["Avg. Pull Request Turnaround Time", 0.6]
]


  const [range, setRange] = useState([0, 100]);
  const [mainMetric, setMainMetric] = useState(metrics[0]);
  const [comparedMetrics, setComparedMetrics] = useState(
    metrics.reduce((acc, metric) => {
      acc[metric] = true;
      return acc;
    }, {})
  );

  const handleRangeChange = (newRange) => {
    console.log("New range: " + newRange)
    setRange(newRange);
  };

  const handleMainMetricChange = (event) => {
    setMainMetric(event.target.value);
  };

  const handleComparedMetricChange = (event) => {
    setComparedMetrics({
      ...comparedMetrics,
      [event.target.name]: event.target.checked,
    });
  };

  const metricListStyles = {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f6f6f6",
    margin: "1rem",
  };

  const rangePickerStyles = {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f6f6f6",
    margin: "1rem",
  }

  const barGraphStyle = {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f6f6f6",
    margin: "1rem",
    alignSelf: 'center'
  }
  
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#EBF8FF",
        height: "100vh",
        width: "100vw",
        flexDirection: "row",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1}}>
        <RangeSlider sx= {rangePickerStyles} range={range} onRangeChange={handleRangeChange} />
        <MetricList
          mainMetric={mainMetric}
          comparedMetrics={comparedMetrics}
          onMainMetricChange={handleMainMetricChange}
          onComparedMetricChange={handleComparedMetricChange}
          setComparedMetrics={setComparedMetrics}
          sx={metricListStyles}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 3
        }}
      >
        <BarGraph
            sx={barGraphStyle}
            correlations={dummyCorrelationValues}
            mainMetric={mainMetric}
            comparedMetrics={comparedMetrics}
        />
      </Box>
    </Box>
  );
}
