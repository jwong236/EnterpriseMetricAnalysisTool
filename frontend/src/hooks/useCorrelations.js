// hooks/useCorrelations.js
import { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";

export default function useCorrelations(dateRange, barGraphMainMetric) {
  const [correlations, setCorrelations] = useState({});
  const root_path = "http://127.0.0.1:5000";

  useEffect(() => {
    const fetchData = async () => {
      const startDate = formatDate(dateRange[0]); // Format start date to YYYY-MM-DD
      const endDate = formatDate(dateRange[1]); // Format end date to YYYY-MM-DD

      // Ensure the metric is properly formatted (no spaces, lowercase)
      const metric = barGraphMainMetric.replace(/\s+/g, "_").toLowerCase();
      const url = `${root_path}/v1/correlation?start_date=${startDate}&end_date=${endDate}&main_metric=${metric}`;

      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Error fetching correlations: ${response.status}`);

        const data = await response.json();

        setCorrelations(data); // Set the transformed correlation data
      } catch (error) {
        console.error("Failed to fetch correlations:", error);
        setCorrelations({}); // Reset correlations on error
      }
    };

    // Fetch data when dateRange or barGraphMainMetric changes
    fetchData();
  }, [dateRange, barGraphMainMetric]);

  return correlations;
}
