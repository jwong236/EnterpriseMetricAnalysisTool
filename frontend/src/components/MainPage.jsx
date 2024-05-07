import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BarGraph from "./BarGraph";
import MetricList from "./MetricList";
import RangeSlider from "./SprintRangeSlider";
import LineGraph from "./LineGraph";
import { dateToSprintNumber } from "../utils/dateToSprint";

function formatDate(date) {
  return date.toISOString().split('T')[0];
}


export default function MainPage() {
  const metrics = [
    "Deployment Frequency",
    "Lead Time for Changes",
    "Avg Retro Mood",
    "Open Issue Bug Count",
    "Refinement Changes",
    "Avg Pull Request Turnaround Time",
    "Avg Blocked Task Time"
  ];

  const metricNameMap = {
    "Deployment Frequency": "deployment_frequency",
    "Lead Time for Changes": "lead_time_for_changes",
    "Avg Retro Mood": "avg_retro_mood",
    "Open Issue Bug Count": "open_issue_bug_count",
    "Refinement Changes": "refinement_changes_count",
    "Avg Pull Request Turnaround Time": "avg_pull_request_turnaround_time",
    "Avg Blocked Task Time": "avg_blocked_task_time"
  };
  const inverseMetricNameMap = Object.fromEntries(
    Object.entries(metricNameMap).map(([key, value]) => [value, key])
  );


  const [dateRange, setDateRange] = useState([new Date('2023-01-01'), new Date('2023-12-31')]);
  const [barGraphMainMetric, setBarGraphMainMetric] = useState(metrics[0]);
  const [barGraphMetrics, setBarGraphMetrics] = useState(
    metrics.reduce((acc, metric) => ({ ...acc, [metric]: true }), {})
  );
  const [lineGraphMetrics, setLineGraphMetrics] = useState(
    metrics.reduce((acc, metric) => ({ ...acc, [metric]: true }), {})
  );

  const [allMetricsData, setAllMetricsData] = useState([]);
  const [correlations, setCorrelations] = useState([]);

  useEffect(() => {
    const metricEndpoints = [
      { name: "Deployment Frequency", endpoint: "deployment_frequency", key: "deployments" },
      { name: "Lead Time for Changes", endpoint: "lead_time_for_changes", key: "total_lead_time" },
      { name: "Avg Retro Mood", endpoint: "avg_retro_mood", key: "avg_retro_mood" },
      { name: "Open Issue Bug Count", endpoint: "open_issue_bug_count", key: "open_issue_bug_count" },
      { name: "Refinement Changes", endpoint: "refinement_changes_count", key: "refinement_changes_count" },
      { name: "Avg Pull Request Turnaround Time", endpoint: "avg_pull_request_turnaround_time", key: "avg_pull_request_turnaround_time" },
      { name: "Avg Blocked Task Time", endpoint: "avg_blocked_task_time", key: "avg_blocked_task_time" },
    ];

    const fetchData = async () => {
      const fetchPromises = metricEndpoints.map(async metric => {
        const url = `http://127.0.0.1:5000/v1/raw_metrics/${metric.endpoint}?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          return { name: metric.name, values: data.data.map(item => item[metric.key]) };
        } catch (error) {
          console.error(`Error fetching data for ${metric.name}:`, error);
          return { name: metric.name, values: [] };
        }
      });

      const results = await Promise.all(fetchPromises);
      setAllMetricsData(results);
    };

    fetchData();
  }, [dateRange]);


  
useEffect(() => {
  const fetchData = async () => {
    const formatDate = (date) => date.toISOString().split('T')[0];
    const metric = barGraphMainMetric.replace(/\s+/g, '_').toLowerCase();
    const url = `http://127.0.0.1:5000/v1/correlation?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}&main_metric=${metric}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
      const data = await response.json();
      const apiCorrelations = data.correlations || {};
      const adjustedCorrelations = {};

      for (const key in apiCorrelations) {
        const readableKey = inverseMetricNameMap[key] || key;
        adjustedCorrelations[readableKey] = apiCorrelations[key];
      }

      setCorrelations({ correlations: adjustedCorrelations });
    } catch (error) {
      console.error('Failed to fetch correlations:', error);
      setCorrelations({ correlations: {} });
    }
  };

  fetchData();
}, [dateRange, barGraphMainMetric]);


  const handleRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const handleBarGraphMainMetricChange = (event) => {
    setBarGraphMainMetric(event.target.value);
  };

  const handleBarGraphMetricChange = (event) => {
    setBarGraphMetrics({
      ...barGraphMetrics,
      [event.target.name]: event.target.checked,
    });
  };

  const handleLineGraphMetricChange = (event) => {
    setLineGraphMetrics({
      ...lineGraphMetrics,
      [event.target.name]: event.target.checked,
    });
  };

  const cardBackgroundStyle = { 
    margin: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  }
  // the style for the selection
  const leftCardBackgroundStyle = { 
    margin: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    flex: 1
  }

  // the style fot the chart
  const rightCardBackgroundStyle = { 
    margin: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    flex: 3
  }


  const filteredMetrics = allMetricsData.filter(metric => lineGraphMetrics[metric.name]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#f5f6f7", alignItems: 'center'}}>
      <Typography variant='h3' color='primary.dark' sx={{margin: '2rem 1rem 1rem 1rem'}}>UCICapstone2024 Enterprise Metric Analysis Tool</Typography>
      <RangeSlider sx={{...cardBackgroundStyle, width: '89.5%'}} range={dateRange} onRangeChange={handleRangeChange} />
      <Box sx={{display:"flex", flexDirection:"column", width:"100vw", overflow:"hidden"}}>
        {/* the bar chart */}
        <Box sx={{ display: "flex", flexDirection: "row"}}>
          <MetricList
            sx={leftCardBackgroundStyle}
            dropDownMetric={barGraphMainMetric}
            metrics={barGraphMetrics}
            onDropDownMetricChange={handleBarGraphMainMetricChange}
            onMetricChange={handleBarGraphMetricChange}
            setMetrics={setBarGraphMetrics}
            showDropdownMetric={true}
          />
          <BarGraph
            sx={rightCardBackgroundStyle}
            correlations={correlations}
            mainMetric={barGraphMainMetric}
            comparedMetrics={barGraphMetrics}
          />
        </Box>

        {/* the line graph */}
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <MetricList
            sx={leftCardBackgroundStyle}
            metrics={lineGraphMetrics}
            onMetricChange={handleLineGraphMetricChange}
            setMetrics={setLineGraphMetrics}
            showDropdownMetric={false}
          />
          <LineGraph
            sx={rightCardBackgroundStyle}
            metrics={filteredMetrics}
            offset={dateToSprintNumber(dateRange[0])} // get the date of the start date, then get the sprint
          />
        </Box>
      </Box>
      
    </Box>
  );
}
