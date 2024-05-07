import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';

const LineGraph = ({ sx, metrics }) => {
    
    const maxXAxisValue = metrics.reduce((max, metric) => Math.max(max, metric.values.length), 0);
    const xAxisData = Array.from({ length: maxXAxisValue }, (_, i) => i + 1);

    const series = metrics.map(metric => ({
        label: metric.name,
        data: metric.values
    }));

    return (
        <Box sx={sx}>
            <Typography variant="h5" gutterBottom>
                Metrics Over Time
            </Typography>
            <LineChart
                series={series}
                yAxis={[{ label: 'Metric Value' }]}
                xAxis={[{ data: xAxisData, label: 'Sprint Number'}]}
                layout="horizontal"
                height={400}
                width={1300}
                margin={{ top: 120, right: 100, bottom: 40, left: 40 }}
                
            />
        </Box>
    );
};

export default LineGraph;
