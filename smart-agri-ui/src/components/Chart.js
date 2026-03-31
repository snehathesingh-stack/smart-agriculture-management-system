import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

// ✅ VERY IMPORTANT (this fixes your error)
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Chart({ crop, yieldData }) {
  const data = {
    labels: [crop],
    datasets: [
      {
        label: "Yield (kg)",
        data: [yieldData],
        backgroundColor: "green"
      }
    ]
  };

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <Bar data={data} />
    </div>
  );
}

export default Chart;