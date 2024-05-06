import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BarGraph from "./BarGraph";
import MetricList from "./MetricList";
import RangeSlider from "./SprintRangeSlider";
import LineGraph from "./LineGraph";

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function createDummyValues() {
  const choices = [2, 3, 6];
  return Array.from({ length: 10 }, () => choices[Math.floor(Math.random() * choices.length)]);
}



export default function MainPage() {
  const metrics = [
    "Deployment Frequency",
    "Lead Time for Changes",
    "Avg. Retro Mood",
    "Open Issue Bug Count",
    "Refinement Changes",
    "Avg. Pull Request Turnaround Time",
  ];

  const metricNameMap = {
    "deployment_frequency": "Deployment Frequency",
    "lead_times": "Lead Time for Changes",
    "avg_retro_mood": "Avg. Retro Mood",
    "open_issue_bug_count": "Open Issue Bug Count",
    "refinement_changes": "Refinement Changes",
    "average_turnaround_time": "Avg. Pull Request Turnaround Time"
  };
  
  const dummyCorrelationData = {
    correlations: {
        "Deployment Frequency": 0.23,
        "Lead Time for Changes": -0.26,
        "Avg. Retro Mood": 0.26,
        "Open Issue Bug Count": -0.62,
        "Refinement Changes": 0.36,
        "Avg. Pull Request Turnaround Time": 0.63
    }
};

  const [dateRange, setDateRange] = useState([new Date('2023-01-01'), new Date('2023-12-31')]);
  const [barGraphMainMetric, setBarGraphMainMetric] = useState(metrics[0]);
  const [barGraphMetrics, setBarGraphMetrics] = useState(
    metrics.reduce((acc, metric) => ({ ...acc, [metric]: true }), {})
  );
  const [lineGraphMetrics, setLineGraphMetrics] = useState(
    metrics.reduce((acc, metric) => ({ ...acc, [metric]: true }), {})
  );
  const [correlations, setCorrelations] = useState([]);
  const [deploymentFrequencyData, setDeploymentFrequencyData] = useState([]);
  const [pullRequestTurnaroundTimeData, setPullRequestTurnaroundTimeData] = useState([]);
  const [leadTimeForChangesData, setLeadTimeForChangesData] = useState([]);
  const [allMetricsData, setAllMetricsData] = useState([]);



  useEffect(() => {
    const metricsList = [
        deploymentFrequencyData,
        leadTimeForChangesData,
        { name: "Avg. Retro Mood", values: createDummyValues() },
        { name: "Open Issue Bug Count", values: createDummyValues() },
        { name: "Refinement Changes", values: createDummyValues() },
        pullRequestTurnaroundTimeData
    ];

    const validMetrics = metricsList.filter(metric => 
        metric.values && metric.values.length > 0 && lineGraphMetrics[metric.name]
    );

    setAllMetricsData(validMetrics);
}, [deploymentFrequencyData, leadTimeForChangesData, pullRequestTurnaroundTimeData, lineGraphMetrics]);

  
 

  useEffect(() => {
    const fetchDeploymentFrequencyData = async () => {
      const url = `http://127.0.0.1:5000/v1/raw_metrics/deployment_frequency?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDeploymentFrequencyData({ name: "Deployment Frequency", values: data.data.map(item => item.deployments) });
      } catch (error) {
        console.error("Error fetching Deployment Frequency data:", error);
      }
    };

    fetchDeploymentFrequencyData();
  }, [dateRange]);
  
  useEffect(() => {
    const fetchPullRequestTurnaroundTimeData = async () => {
      const url = `http://127.0.0.1:5000/v1/raw_metrics/pull_request_turnaround_time?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPullRequestTurnaroundTimeData({ name: "Avg. Pull Request Turnaround Time", values: data.data.map(item => item.average_turnaround_time) });
      } catch (error) {
        console.error("Error fetching Pull Request Turnaround Time data:", error);
      }
    };
  
    fetchPullRequestTurnaroundTimeData();
  }, [dateRange]);
  
  useEffect(() => {
    const fetchLeadTimeForChangesData = async () => {
      const url = `http://127.0.0.1:5000/v1/raw_metrics/lead_time_for_changes?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setLeadTimeForChangesData({ name: "Lead Time for Changes", values: data.data.map(item => item.total_lead_time) });
      } catch (error) {
        console.error("Error fetching Lead Time for Changes data:", error);
      }
    };
  
    fetchLeadTimeForChangesData();
  }, [dateRange]);
  



  



  useEffect(() => {
    const fetchData = async () => {
      const formatDate = (date) => date.toISOString().split('T')[0];
      const metric = barGraphMainMetric.replace(/\s+/g, '_').toLowerCase();
      const url = `http://127.0.0.1:5000/v1/correlation?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}&main_metric=${metric}`;
  
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const apiCorrelations = data.correlations || {};
        const adjustedCorrelations = {};
        for (const key in apiCorrelations) {
          const standardizedKey = metricNameMap[key] || key;
          adjustedCorrelations[standardizedKey] = apiCorrelations[key];
        }
  
        const fullCorrelations = {...dummyCorrelationData.correlations};
        for (const key in adjustedCorrelations) {
          fullCorrelations[key] = adjustedCorrelations[key];
        }
  
        setCorrelations({correlations: fullCorrelations});
      } catch (error) {
        console.error('Failed to fetch correlations:', error);
        setCorrelations(dummyCorrelationData);
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
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#f5f6f7", alignItems: 'center'}}>
      <Typography variant='h3' color='primary.dark' sx={{margin: '2rem 1rem 1rem 1rem'}}>UCICapstone2024 Enterprise Metric Analysis Tool</Typography>
      <RangeSlider sx={{...cardBackgroundStyle, width: '80%'}} range={dateRange} onRangeChange={handleRangeChange} />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <MetricList
          sx={cardBackgroundStyle}
          dropDownMetric={barGraphMainMetric}
          metrics={barGraphMetrics}
          onDropDownMetricChange={handleBarGraphMainMetricChange}
          onMetricChange={handleBarGraphMetricChange}
          setMetrics={setBarGraphMetrics}
          showDropdownMetric={true}
        />
        <BarGraph
          sx={cardBackgroundStyle}
          correlations={correlations}
          mainMetric={barGraphMainMetric}
          comparedMetrics={barGraphMetrics}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <MetricList
          sx={cardBackgroundStyle}
          metrics={lineGraphMetrics}
          onMetricChange={handleLineGraphMetricChange}
          setMetrics={setLineGraphMetrics}
          showDropdownMetric={false}
        />
        <LineGraph
          sx={cardBackgroundStyle}
          metrics={allMetricsData}
        />
      </Box>
    </Box>
  );
}
