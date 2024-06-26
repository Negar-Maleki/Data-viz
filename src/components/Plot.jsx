import React, { useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";
import { Bar, Line, Chart as ReactChart } from "react-chartjs-2";
import revenueData from "../data/revenueData.json";

Chart.register(...registerables, TreemapController, TreemapElement);

const Plot = () => {
  const data = {
    labels: revenueData.map((data) => data.label),
    datasets: [
      {
        label: "Revenue",
        data: revenueData.map((data) => data.revenue),
        backgroundColor: "#354973",
        borderColor: "#064FF0",
      },
      {
        label: "Cost",
        data: revenueData.map((data) => data.cost),
        backgroundColor: "#FF3030",
        borderColor: "#FF3030",
      },
    ],
  };
  const options = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    plugins: {
      title: {
        text: "Monthly Revenue & Cost",
      },
    },
  };
  const data1 = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
      },
    ],
  };
  const options1 = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const data2 = {
    datasets: [
      {
        label: "My treemap dataset",
        tree: [15, 6, 6, 5, 4, 3, 2, 2],
        borderColor: "white",
        borderWidth: 1,
        spacing: 0,
        backgroundColor: "navy",
      },
    ],
  };
  const options2 = {
    plugins: {
      title: {
        display: true,
        text: "My treemap chart",
      },
      legend: {
        display: false,
      },
    },
  };
  return <ReactChart type="treemap" data={data2} options={options2} />;
};

export default Plot;
