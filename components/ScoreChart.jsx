import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ScoreChart = ({ current, simulated }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: simulated ? true : false,
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: { size: 12, weight: "bold" }
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        displayColors: true
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: { color: "#f1f5f9" },
        ticks: { font: { size: 12 }, color: "#94a3b8" }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 }, color: "#94a3b8" }
      }
    },
    interaction: { mode: "index", intersect: false }
  };

  const labels = ["Today", "7 Days", "15 Days", "30 Days"];

  const getInterpolatedData = (d) => {
    const future15 = d.score + (d.future30 - d.score) / 2;
    return [d.score, d.future7, future15, d.future30];
  };

  const datasets = [
    {
      label: "Actual Projection",
      data: getInterpolatedData(current),
      borderColor: "#4f46e5",
      backgroundColor: "rgba(79, 70, 229, 0.05)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#4f46e5",
      pointBorderWidth: 2,
      pointRadius: 4
    }
  ];

  if (simulated) {
    datasets.push({
      label: "What-If Simulation",
      data: getInterpolatedData(simulated),
      borderColor: "#d946ef",
      backgroundColor: "transparent",
      borderDash: [5, 5],
      tension: 0.4,
      fill: false,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#d946ef",
      pointBorderWidth: 2,
      pointRadius: 4
    });
  }

  const data = { labels, datasets };

  return <Line options={options} data={data} />;
};

export default ScoreChart;
