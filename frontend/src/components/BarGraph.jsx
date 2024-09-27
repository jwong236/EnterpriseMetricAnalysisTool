import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";

const BarGraph = ({ sx, mainMetric, correlations, metricNames }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  // Use Object.entries on correlations.correlations directly
  const correlationEntries = Object.entries(correlations.correlations || {});

  // Set loading state based on whether there are any correlations
  useEffect(() => {
    setLoading(correlationEntries.length === 0);
  }, [correlationEntries]);

  // Process correlations and map metric keys to readable names using metricNames
  const processedCorrelations = correlationEntries
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])) // Sort by absolute correlation value
    .map(([metric, value]) => ({
      // Use the metricNames mapping to get the human-readable name
      metric: metricNames[metric] || metric, // Fallback to the original name if not found
      value: value,
    }));

  return (
    <Box sx={sx}>
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
                dataKey: "value", // Use "value" as the x-axis
                valueFormatter: (value) => `${value.toFixed(2)} units`, // Format the values
              },
            ]}
            layout="horizontal"
            height={500}
            margin={{ left: 210 }} // Adjust the left margin for readability
          />
        </Box>
      )}
    </Box>
  );
};

export default BarGraph;
