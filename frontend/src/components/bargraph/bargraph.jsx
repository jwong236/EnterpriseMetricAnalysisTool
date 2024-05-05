import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';

const positiveColor = '#FFD700'; // Yellow for positive correlations
const negativeColor = '#0000FF'; // Blue for negative correlations

const BarGraph = ({ sx, correlations, mainMetric, comparedMetrics }) => {
    const correlationEntries = Object.entries(correlations.correlations || {});

    const processedCorrelations = correlationEntries
        .filter(([metric, value]) => comparedMetrics[metric] && metric !== mainMetric)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .map(([metric, value]) => ({
            metric,
            value: Math.abs(value),
            color: value >= 0 ? positiveColor : negativeColor
        }));

    return (
        <Box sx={sx}>
            <Typography variant="h6" sx={{ mb: 2 }}>{mainMetric} Correlation Against...</Typography>
            <BarChart
                dataset={processedCorrelations}
                yAxis={[{ scaleType: 'band', dataKey: 'metric' }]}
                series={[{
                    dataKey: 'value',
                    fill: ({ datum }) => datum.color,
                    valueFormatter: (value) => `${value.toFixed(2)} units`
                }]}
                layout="horizontal"
                width={1300}
                height={500}
                margin={{ left: 210 }}
            />
        </Box>
    );
};

export default BarGraph;
