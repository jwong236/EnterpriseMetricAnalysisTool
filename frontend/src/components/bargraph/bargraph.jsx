import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';

const positiveColor = '#FFD700'; // Yellow for positive correlations
const negativeColor = '#0000FF'; // Blue for negative correlations

const BarGraph = ({ sx, correlations, mainMetric, comparedMetrics }) => {
    const filteredCorrelations = correlations.filter(correlation =>
        comparedMetrics[correlation[0]] && correlation[0] !== mainMetric
    );

    const sortedCorrelations = filteredCorrelations.sort((a, b) => 
        Math.abs(b[1]) - Math.abs(a[1])
    );

    const dataset = sortedCorrelations.map(correlation => ({
        metric: correlation[0],
        value: Math.abs(correlation[1]),
        color: correlation[1] >= 0 ? positiveColor : negativeColor
    }));

    return (
        <Box sx={sx}>
            <BarChart
                dataset={dataset}
                yAxis={[{ scaleType: 'band', dataKey: 'metric'}]}
                series={[{
                    dataKey: 'value',
                    fill: 'color',
                    label: mainMetric + ' Correlation Against...',
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
