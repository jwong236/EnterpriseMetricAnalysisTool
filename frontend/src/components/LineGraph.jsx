import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, CircularProgress } from "@mui/material";
import useMetricsData from "../hooks/useMetricsData";
import { metricsMapping } from "../utils/constants";

const rightCardBackgroundStyle = {
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  flex: 3,
};

const LineGraph = ({ metrics, dateRange }) => {
  const offset = 1;
  const [loading, setLoading] = useState(true);
  const allMetrics = useMetricsData(dateRange);

  const maxXAxisValue = metrics.reduce(
    (max, metric) => Math.max(max, metric.values.length),
    0
  );
  const xAxisData = Array.from(
    { length: maxXAxisValue },
    (_, i) => i / 2 + offset
  );

  const series = metrics.map((metric) => ({
    label: metric.name,
    data: metric.values,
  }));

  return (
    <Box sx={rightCardBackgroundStyle}>
      <Typography variant="h5" gutterBottom>
        Metrics Over Time
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <LineChart
          series={series}
          yAxis={[{ label: "Metric Value" }]}
          xAxis={[{ data: xAxisData, label: "Sprint Number" }]}
          layout="horizontal"
          height={400}
          margin={{ top: 120, right: 100, bottom: 40, left: 40 }}
        />
      )}
    </Box>
  );
};

export default LineGraph;
