import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export default function MetricList({
  metricsList,
  toggleDropdown = false,
  setMainMetric,
  setSelectedMetrics,
}) {
  // Default value for the dropdown (Deployment Frequency)
  const defaultMetric = "Deployment Frequency";

  // State to track which metrics are selected, unchecking "Deployment Frequency" by default
  const [metrics, setMetrics] = useState(
    metricsList.reduce((acc, metric) => {
      acc[metric] = metric !== defaultMetric; // Uncheck "Deployment Frequency" initially
      return acc;
    }, {})
  );

  // Dropdown selection state, defaulting to "Deployment Frequency"
  const [dropDownMetric, setDropDownMetric] = useState(defaultMetric);

  // Effect to update selected metrics when metrics change
  useEffect(() => {
    const selectedMetrics = Object.keys(metrics).filter(
      (metric) => metrics[metric]
    );
    setSelectedMetrics(selectedMetrics);
  }, [metrics, setSelectedMetrics]);

  // Check if all metrics (except the one in dropDownMetric) are selected
  const isAllSelected = metricsList
    .filter((metric) => metric !== dropDownMetric)
    .every((metric) => metrics[metric]);

  // Handle "Select All" checkbox change (exclude disabled metric)
  const handleAllChecked = (event) => {
    const newMetrics = metricsList.reduce((acc, metric) => {
      if (metric !== dropDownMetric) {
        acc[metric] = event.target.checked;
      } else {
        acc[metric] = false;
      }
      return acc;
    }, {});
    setMetrics(newMetrics);
  };

  // Handle individual metric checkbox change
  const onMetricChange = (event) => {
    const { name, checked } = event.target;
    setMetrics((prevMetrics) => ({ ...prevMetrics, [name]: checked }));
  };

  // Handle dropdown change and uncheck the metric that is selected in the dropdown
  const onDropDownMetricChange = (event) => {
    const selectedMetric = event.target.value;
    setDropDownMetric(selectedMetric);
    setMainMetric(selectedMetric);

    // Uncheck the selected dropdown metric
    setMetrics((prevMetrics) => ({
      ...prevMetrics,
      [selectedMetric]: false,
    }));
  };

  // Style for the card component
  const cardStyle = {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    flex: 1,
  };

  return (
    <Box sx={cardStyle}>
      <Typography variant="h4" gutterBottom>
        Metrics
      </Typography>

      {/* Dropdown for selecting main metric */}
      {toggleDropdown && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            value={dropDownMetric}
            onChange={onDropDownMetricChange}
            displayEmpty
          >
            {metricsList.map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Metric checkboxes */}
      <FormGroup>
        {/* Select All checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isAllSelected}
              onChange={handleAllChecked}
              indeterminate={
                !isAllSelected &&
                metricsList
                  .filter((metric) => metric !== dropDownMetric)
                  .some((metric) => metrics[metric])
              }
            />
          }
          label="Select All"
        />

        {/* Individual metric checkboxes */}
        {metricsList.map((metric) => (
          <FormControlLabel
            key={metric}
            control={
              <Checkbox
                checked={metrics[metric]}
                onChange={onMetricChange}
                name={metric}
                disabled={metric === dropDownMetric}
              />
            }
            label={metric}
            sx={{
              color: metric === dropDownMetric ? "grey.500" : "inherit",
              textDecoration:
                metric === dropDownMetric ? "line-through" : "none",
            }}
          />
        ))}
      </FormGroup>
    </Box>
  );
}
