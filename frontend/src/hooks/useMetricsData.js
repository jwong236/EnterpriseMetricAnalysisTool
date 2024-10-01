import { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import { metricsMapping } from "../utils/constants";

export default function useMetricsData(dateRange) {
  const [allMetricsData, setAllMetricsData] = useState([]);
  const root_path = "http://127.0.0.1:5000";

  useEffect(() => {
    const fetchData = async () => {
      const startDate = formatDate(dateRange[0]); // Format start date to YYYY-MM-DD
      const endDate = formatDate(dateRange[1]); // Format start date to YYYY-MM-DD

      const fetchPromises = Object.keys(metricsMapping).map((metric) => {
        // Convert the metric name to a key that matches the format in metricIds
        const metricKey = metricsMapping[metric].endpoint;
        const metricId = metricsMapping[metric].id;

        if (!metricId) {
          console.error(`No ID found for metric: ${metricKey}`);
          return { name: metric, data: [] }; // Return empty values if ID not found
        }

        // Derive the API endpoint from the metric key directly
        const endpoint = metricKey;

        const url = `${root_path}/v1/raw_metrics/${endpoint}?start_date=${startDate}&end_date=${endDate}`;

        return fetch(url)
          .then((response) => {
            if (!response.ok)
              throw new Error(`Error fetching ${metric}: ${response.status}`);
            return response.json();
          })
          .then((data) => ({
            name: metric,
            data: data.data,
          }))
          .catch((error) => {
            console.error(`Error fetching data for ${metric}:`, error);
            return { name: metric, data: [] };
          });
      });

      const results = await Promise.all(fetchPromises);
      setAllMetricsData(results);
    };

    fetchData();
  }, [dateRange]);

  return allMetricsData;
}
