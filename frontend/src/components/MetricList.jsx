import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function MetricList({
    sx,
    dropDownMetric,
    metrics,
    onDropDownMetricChange,
    onMetricChange,
    setMetrics,
    showDropdownMetric = true
}) {
    const metricOptions = [
        "Deployment Frequency",
        "Lead Time for Changes",
        "Avg Retro Mood",
        "Open Issue Bug Count",
        "Refinement Changes Count",
        "Avg Pull Request Turnaround Time",
        "Avg Blocked Task Time"
    ];

    const isAllSelected = metricOptions.every(metric => metrics[metric]);

    const handleAllChecked = (event) => {
        const newMetrics = { ...metrics };
        metricOptions.forEach(metric => {
            newMetrics[metric] = event.target.checked;
        });
        setMetrics(newMetrics);
    };

    return (
        <Box sx={sx}>
            <Typography variant="h4" gutterBottom>
                Metrics
            </Typography>
            {showDropdownMetric && (
                <FormControl fullWidth>
                    <Select
                        value={dropDownMetric}
                        onChange={onDropDownMetricChange}
                        displayEmpty
                    >
                        {metricOptions.map(metric => (
                            <MenuItem key={metric} value={metric}>{metric}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isAllSelected}
                            onChange={handleAllChecked}
                            indeterminate={!isAllSelected && metricOptions.some(metric => metrics[metric])}
                        />
                    }
                    label="Select All"
                />
                {metricOptions.map(metric => (
                    <FormControlLabel
                        key={metric}
                        control={
                            <Checkbox
                                checked={metrics[metric]}
                                onChange={onMetricChange}
                                name={metric}
                                disabled={metric === dropDownMetric && showDropdownMetric}
                            />
                        }
                        label={metric}
                        sx={{
                            color: metric === dropDownMetric && showDropdownMetric ? 'grey.500' : 'inherit',
                            textDecoration: metric === dropDownMetric && showDropdownMetric ? 'line-through' : 'none'
                        }}
                    />
                ))}
            </FormGroup>
        </Box>
    );
}
