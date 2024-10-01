import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import useCorrelations from "../hooks/useCorrelations";
import { metricsMapping } from "../utils/constants"; // Import the new metricsMapping

const rightCardBackgroundStyle = {
  width: "100%",
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  flex: 3,
};

const BarGraph = ({ mainMetric, selectedMetrics, dateRange }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  const correlations =
    useCorrelations(dateRange, mainMetric)?.correlations || {};

  useEffect(() => {
    setLoading(Object.keys(correlations).length === 0);
  }, [correlations]);

  // Process correlations by mapping endpoint keys to human-readable metric names
  const processedCorrelations = Object.entries(correlations)
    .filter(([metric]) => {
      // Check if the metric is in selectedMetrics and exists in metricsMapping by the endpoint (key)
      const metricName = Object.keys(metricsMapping).find(
        (key) => metricsMapping[key].endpoint === metric
      );
      return selectedMetrics.includes(metricName);
    })
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])) // Sort by absolute correlation value
    .map(([metric, value]) => {
      // Find the human-readable name using the endpoint (key)
      const metricName = Object.keys(metricsMapping).find(
        (key) => metricsMapping[key].endpoint === metric
      );
      return {
        metric: metricName || metric, // Fallback to the original key if no name found
        value: value,
      };
    });

  // Check if there is no data to render
  if (processedCorrelations.length === 0) {
    return (
      <Box
        sx={{
          ...rightCardBackgroundStyle,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Please select metrics to view correlation data
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={rightCardBackgroundStyle}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {mainMetric} Correlation Data
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box width="100%">
          <BarChart
            dataset={processedCorrelations}
            yAxis={[{ scaleType: "band", dataKey: "metric" }]} // Use "metric" as the y-axis
            xAxis={[
              {
                colorMap: {
                  type: "piecewise",
                  thresholds: [0],
                  colors: ["#0064a4", theme.palette.secondary.main],
                },
              },
            ]}
            series={[
              {
                dataKey: "value",
                valueFormatter: (value) =>
                  `${value.toFixed(5)} correlation value`,
              },
            ]}
            layout="horizontal"
            height={500}
            margin={{ left: 210 }}
          />
        </Box>
      )}
    </Box>
  );
};

export default BarGraph;
