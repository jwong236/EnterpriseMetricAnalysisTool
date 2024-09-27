// hooks/useMetricsData.js
import { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate"; // Import the date formatter

export default function useMetricsData(dateRange) {
  const [allMetricsData, setAllMetricsData] = useState([]);
  const root_path = "http://127.0.0.1:5000"; // Example root path

  useEffect(() => {
    const metricEndpoints = [
      {
        name: "Deployment Frequency",
        endpoint: "deployment_frequency",
        key: "deployments",
      },
      {
        name: "Lead Time for Changes",
        endpoint: "lead_time_for_changes",
        key: "avg_lead_time",
      },
      {
        name: "Avg Pull Request Merge Time",
        endpoint: "avg_pull_request_merge_time",
        key: "avg_pull_request_merge_time",
      },
      {
        name: "Avg Blocked Task Time",
        endpoint: "avg_blocked_task_time",
        key: "avg_blocked_time",
      },
      {
        name: "Avg Retro Mood",
        endpoint: "avg_retro_mood",
        key: "retro_mood",
      },
      {
        name: "Open Issue Bug Count",
        endpoint: "open_issue_bug_count",
        key: "total_bug_count",
      },
      {
        name: "Refinement Changes Count",
        endpoint: "refinement_changes_count",
        key: "refinement_changes_count",
      },
    ];

    const fetchData = async () => {
      const startDate = formatDate(dateRange[0]); // Format start date
      const endDate = formatDate(dateRange[1]); // Format end date

      const fetchPromises = metricEndpoints.map(async (metric) => {
        const url = `${root_path}/v1/raw_metrics/${metric.endpoint}?start_date=${startDate}&end_date=${endDate}`;
        console.log("Fetching from URL:", url); // Debugging the API call

        try {
          const response = await fetch(url);
          if (!response.ok)
            throw new Error(
              `Error fetching ${metric.name}: ${response.status}`
            );
          const data = await response.json();
          return {
            name: metric.name,
            values: data.data.map((item) => item[metric.key]),
          };
        } catch (error) {
          console.error(`Error fetching data for ${metric.name}:`, error);
          return { name: metric.name, values: [] };
        }
      });

      const results = await Promise.all(fetchPromises);
      setAllMetricsData(results); // Set the fetched data
    };

    fetchData(); // Trigger the fetch when dateRange changes
  }, [dateRange]);

  return allMetricsData;
}
