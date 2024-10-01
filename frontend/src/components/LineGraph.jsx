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

const LineGraph = ({ selectedMetrics, dateRange }) => {
  const offset = 1;
  const allMetrics = useMetricsData(dateRange); // Fetch all metric data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allMetrics.length > 0) {
      setLoading(false); // Stop loading when data is available
    }
  }, [allMetrics]);

  // Filter allMetrics to include only selectedMetrics
  const filteredMetrics = allMetrics.filter((metric) =>
    selectedMetrics.includes(metric.name)
  );

  // Calculate the maximum length of the metric values for the x-axis
  const maxXAxisValue = filteredMetrics.reduce(
    (max, metric) => Math.max(max, metric.data.length),
    0
  );

  // Generate x-axis data based on the longest metric
  const xAxisData = Array.from(
    { length: maxXAxisValue },
    (_, i) => i / 2 + offset
  );

  // Extract the correct key from metricsMapping for each metric
  console.log(filteredMetrics);
  const series = filteredMetrics
    .map((metric) => {
      const metricName = metric.name;
      const metricKey = metricsMapping[metricName]?.key;

      if (!metricKey) {
        console.error(`No key found for metric: ${metricName}`);
        return null;
      }

      // Extract the values using the correct key (e.g., retro_mood, avg_lead_time, etc.)
      const data = metric.data.map((item) => item[metricKey]);

      return {
        label: metricName,
        data: data,
      };
    })
    .filter(Boolean); // Remove null entries in case of errors

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
