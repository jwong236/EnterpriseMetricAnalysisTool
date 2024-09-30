import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import useCorrelations from "../hooks/useCorrelations";
import { metricIds, metricsById } from "../utils/constants";

const rightCardBackgroundStyle = {
  width: "100%",
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  flex: 3,
};

const BarGraph = ({ mainMetric, dateRange }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  const correlations =
    useCorrelations(dateRange, mainMetric)?.correlations || {};

  useEffect(() => {
    setLoading(Object.keys(correlations).length === 0);
  }, [correlations]);

  // Process correlations by mapping IDs to human-readable metric names
  const processedCorrelations = Object.entries(correlations)
    .filter(([metric]) => {
      return metricIds[metric]; // Check if the metric has a valid ID
    })
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])) // Sort by absolute correlation value
    .map(([metric, value]) => ({
      metric: metricsById[metricIds[metric]] || metric, // Use the metric ID to get the human-readable name
      value: value,
    }));

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
