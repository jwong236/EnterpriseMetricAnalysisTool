import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BarGraph from "../components/BarGraph";
import MetricList from "../components/MetricList";
import RangeSlider from "../components/SprintRangeSlider";
import LineGraph from "../components/LineGraph";
import { metricsMapping } from "../utils/constants";

export default function MainPage() {
  const [mainMetric, setMainMetric] = useState("Deployment Frequency");
  const [selectedBarGraphMetrics, setSelectedBarGraphMetrics] = useState([]);
  const [selectedLineGraphMetrics, setSelectedLineGraphMetrics] = useState([]);

  // State for managing the selected date range
  const [dateRange, setDateRange] = useState([
    new Date("2023-01-01"),
    new Date("2023-12-31"),
  ]);

  // Handler for when the date range is updated via RangeSlider
  const handleRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#f5f6f7",
        alignSelf: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center",
          width: "100%",
          maxWidth: "1870px",
          margin: "3rem",
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          color="primary.dark"
          sx={{ margin: "2rem 1rem 1rem 1rem" }}
        >
          UCICapstone2024 Enterprise Metric Analysis Tool
        </Typography>
        {/* Range Slider */}
        <RangeSlider range={dateRange} onRangeChange={handleRangeChange} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
            {/* Bar graph MetricList*/}
            <MetricList
              metricsList={Object.keys(metricsMapping)}
              toggleDropdown={true}
              setMainMetric={setMainMetric}
              setSelectedMetrics={setSelectedBarGraphMetrics}
            />
            <BarGraph
              mainMetric={mainMetric}
              selectedMetrics={selectedBarGraphMetrics}
              dateRange={dateRange}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
            {/* The line graph */}
            <MetricList
              metricsList={Object.keys(metricsMapping)}
              toggleDropdown={false}
              setSelectedMetrics={setSelectedLineGraphMetrics}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
