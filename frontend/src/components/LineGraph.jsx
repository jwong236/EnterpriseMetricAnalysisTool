import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, CircularProgress } from "@mui/material";

const LineGraph = ({ metrics, offset }) => {
  if (offset === undefined || offset === null) offset = 1;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (metrics && metrics.length > 0) {
      setLoading(false);
    }
  }, [metrics]);

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
    <Box sx={sx}>
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
