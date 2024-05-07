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

  const [deploymentFrequencyData, setDeploymentFrequencyData] = useState([]);
  const [leadTimeForChangesData, setLeadTimeForChangesData] = useState([]);
  const [avgRetroMoodData, setAvgRetroMoodData] = useState([]);
  const [openIssueBugCountData, setOpenIssueBugCountData] = useState([]);
  const [refinementChangesData, setRefinementChangesData] = useState([]);
  const [avgPullRequestTurnaroundTimeData, setAvgPullRequestTurnaroundTimeData] = useState([]);
  const [avgBlockedTaskTimeData, setAvgBlockedTaskTimeData] = useState([]);

  useEffect(() => {
    const metricsList = [
        deploymentFrequencyData,
        leadTimeForChangesData,
        avgRetroMoodData,
        openIssueBugCountData,
        refinementChangesData,
        avgPullRequestTurnaroundTimeData,
        avgBlockedTaskTimeData
    ];
    
    
    const validMetrics = metricsList.filter(metric => 
        metric.values && metric.values.length > 0 && lineGraphMetrics[metric.name]
    );
    
    setAllMetricsData(validMetrics);
}, [lineGraphMetrics]);

  
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

      // Use the inverseMetricNameMap to translate API keys to readable names
      for (const key in apiCorrelations) {
        const readableKey = inverseMetricNameMap[key] || key; // Use the readable name, fallback to the API key if mapping doesn't exist
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
    const fetchAvgRetroMoodData = async () => {
      const url = `http://127.0.0.1:5000/v1/raw_metrics/avg_retro_mood?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setAvgRetroMoodData({ name: "Avg Retro Mood", values: data.data.map(item => item.avg_retro_mood) });
        
      } catch (error) {
        console.error("Error fetching Avg. Retro Mood data:", error);
      }
    };
  
    fetchAvgRetroMoodData();
  }, [dateRange]);
  
  useEffect(() => {
    const fetchOpenIssueBugCountData = async () => {
      const url = `http://127.0.0.1:5000/v1/raw_metrics/open_issue_bug_count?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setOpenIssueBugCountData({ name: "Open Issue Bug Count", values: data.data.map(item => item.open_issue_bug_count) });
      } catch (error) {
        console.error("Error fetching Open Issue Bug Count data:", error);
      }
    };
  
    fetchOpenIssueBugCountData();
  }, [dateRange]);
  
  useEffect(() => {
    const fetchRefinementChangesData = async () => {
      const url = `http://127.0.0.1:5000/v1/raw_metrics/refinement_changes_count?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setRefinementChangesData({ name: "Refinement Changes", values: data.data.map(item => item.refinement_changes_count) });
      } catch (error) {
        console.error("Error fetching Refinement Changes data:", error);
      }
    };
  
    fetchRefinementChangesData();
  }, [dateRange]);
  
  useEffect(() => {
    const fetchAvgPullRequestTurnaroundTimeData = async () => {
      const url = `http://127.0.0.1:5000/v1/raw_metrics/avg_pull_request_turnaround_time?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setAvgPullRequestTurnaroundTimeData({ name: "Avg Pull Request Turnaround Time", values: data.data.map(item => item.avg_pull_request_turnaround_time) });
      } catch (error) {
        console.error("Error fetching Avg. Pull Request Turnaround Time data:", error);
      }
    };
  
    fetchAvgPullRequestTurnaroundTimeData();
  }, [dateRange]);
  
  useEffect(() => {
    const fetchAvgBlockedTaskTimeData = async () => {
      const url = `http://127.0.0.1:5000/v1/raw_metrics/avg_blocked_task_time?start_date=${formatDate(dateRange[0])}&end_date=${formatDate(dateRange[1])}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setAvgBlockedTaskTimeData({ name: "Avg Blocked Task Time", values: data.data.map(item => item.avg_blocked_task_time) });
      } catch (error) {
        console.error("Error fetching Avg. Blocked Task Time data:", error);
      }
    };
  
    fetchAvgBlockedTaskTimeData();
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
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#f5f6f7", alignItems: 'center'}}>
      <Typography variant='h3' color='primary.dark' sx={{margin: '2rem 1rem 1rem 1rem'}}>UCICapstone2024 Enterprise Metric Analysis Tool</Typography>
      <RangeSlider sx={{...cardBackgroundStyle, width: '89.5%'}} range={dateRange} onRangeChange={handleRangeChange} />
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
