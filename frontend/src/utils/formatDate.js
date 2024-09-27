// utils/formatDate.js

export function formatDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1); // Months are zero-based in JS
  let day = "" + d.getDate();
  const year = d.getFullYear();

  // Add leading zero if the month or day is a single digit
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-"); // Format: YYYY-MM-DD
}
