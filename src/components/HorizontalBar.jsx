import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Chart } from "primereact/chart";

const StyledCharts = styled.div``;

function HorizontalBar() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: ["Citizen", "Non-Citizen"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: documentStyle.getPropertyValue("--cyan-700"),
          borderColor: documentStyle.getPropertyValue("--cyan-700"),
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: "My Second dataset",
          backgroundColor: documentStyle.getPropertyValue("--cyan-900"),
          borderColor: documentStyle.getPropertyValue("--cyan-900"),
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };
    const options = {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: true,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            display: false,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <StyledCharts>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </StyledCharts>
  );
}

export default HorizontalBar;
