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

  const [range, setRange] = useState([20, 70]);
  const [mainMetric, setMainMetric] = useState(metrics[0]);
  const [comparedMetrics, setComparedMetrics] = useState(
    metrics.reduce((acc, metric) => {
      acc[metric] = true;
      return acc;
    }, {})
  );

  const handleRangeChange = (newRange) => {
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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <RangeSlider range={range} onRangeChange={handleRangeChange} />
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
          backgroundColor: "lightblue",
          width: "100%",
          height: "100%",
        }}
      ></Box>
    </Box>
  );
}
