import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function MetricList({ sx, mainMetric, comparedMetrics, onMainMetricChange, onComparedMetricChange, setComparedMetrics }) {
    const metrics = [
        "Deployment Frequency",
        "Lead Time for Changes",
        "Avg. Retro Mood",
        "Open Issue Bug Count",
        "Refinement Changes",
        "Avg. Pull Request Turnaround Time"
    ];

    const isAllSelected = metrics.every(metric => metric === mainMetric || comparedMetrics[metric]);

    const handleAllChecked = (event) => {
        const newComparedMetrics = { ...comparedMetrics };
        metrics.forEach(metric => {
            if (metric !== mainMetric) {
                newComparedMetrics[metric] = event.target.checked;
            }
        });
        setComparedMetrics(newComparedMetrics);
    };

    return (
        <Box sx={sx}>
            <Typography variant="h4" gutterBottom>
                Metric List
            </Typography>
            <Typography variant="h6" gutterBottom>
                Main Metric
            </Typography>
            <FormControl fullWidth>
                <Select
                    value={mainMetric}
                    onChange={onMainMetricChange}
                >
                    {metrics.map(metric => (
                        <MenuItem key={metric} value={metric}>{metric}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                Compared Metrics
            </Typography>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isAllSelected}
                            onChange={handleAllChecked}
                            indeterminate={!isAllSelected && metrics.some(metric => comparedMetrics[metric])}
                        />
                    }
                    label="All"
                />
                {metrics.map(metric => (
                    <FormControlLabel
                        key={metric}
                        control={
                            <Checkbox
                                checked={comparedMetrics[metric]}
                                onChange={onComparedMetricChange}
                                name={metric}
                                disabled={metric === mainMetric}
                            />
                        }
                        label={metric}
                        sx={{
                            color: metric === mainMetric ? 'grey.500' : 'inherit',
                            textDecoration: metric === mainMetric ? 'line-through' : 'none'
                        }}
                    />
                ))}
            </FormGroup>
        </Box>
    );
}
