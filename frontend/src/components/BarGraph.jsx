import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';

const BarGraph = ({ sx, correlations, mainMetric, comparedMetrics }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const correlationEntries = Object.entries(correlations.correlations || {});

    useEffect(() => {
        if (correlationEntries.length > 0) {
            setLoading(false);
        }
    }, [correlationEntries]);

    const processedCorrelations = correlationEntries
        .filter(([metric, value]) => comparedMetrics[metric] && metric !== mainMetric)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .map(([metric, value]) => ({
            metric,
            value: value,
        }));

    return (
        <Box sx={sx}>
            <Typography variant="h6" sx={{ mb: 2 }}>{mainMetric} Correlation Against...</Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <Box width="100%">

                    <BarChart
                        dataset={processedCorrelations}
                        yAxis={[{ scaleType: 'band', dataKey: 'metric' }]}
                        xAxis={[{
                            colorMap: {
                                type: 'piecewise',
                                thresholds: [0],
                                colors: ["#0064a4", theme.palette.secondary.main],
                            }
                        }]}
                        series={[{
                            dataKey: 'value',
                            valueFormatter: (value) => `${value.toFixed(2)} units`
                        }]}
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
