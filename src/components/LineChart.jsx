import React from "react";
import styled, { useTheme } from "styled-components";
import * as d3 from "d3";
import { ResponsiveLine } from "@nivo/line";

import { financialStrings } from "../constants/terms";

import { useFilter } from "../contexts/FilterContext";
import chroma from "chroma-js";

const StyledCharts = styled.div`
  width: 100%;
  height: 100%;
`;

// LineChart component
//chartData is the data passed as props by the parent component that will be used to render the chart
export default function LineChart({ chartData }) {
  const { selectedMeasure, groupings } = useFilter();

  //Check if groupings and chartData are defined and not empty
  if (!Array.isArray(groupings) || groupings.length === 0) {
    console.error("groupings is not defined or empty");
    return;
  }

  //Check if groupings and chartData are defined and not empty
  if (!Array.isArray(chartData) || chartData.length === 0) {
    console.error("data is not defined or empty");
    return;
  }

  //Get the levelName from the groupings. the levelName will be used to create the data structure that line chart component expects
  const levelName = groupings.map(
    (grouping) => grouping.drillDown?.data?.level
  );

  //Check if levelName is defined and not empty
  if (!levelName.every(Boolean)) {
    console.error("One or more groupings do not have a valid dimensionName");
    return;
  }

  //financialStrings is an array of strings that are used to identify financial terms in the selected measure
  //formatNumber is a function that formats the number based on if the selected measure contains financial terms or not. if yes, it will format the number as currency else it will format the number as a number
  const formatNumber = financialStrings.some((str) =>
    selectedMeasure.label.includes(str)
  )
    ? d3.format("$.3s")
    : d3.format(".3s");

  //formatYear is a function that add the word years to the number in case the selected measure is age
  const formatYear = () => {
    return "years";
  };

  //transformData is a function that transforms the data to the format that the line chart component expects
  const transformData = (records) => {
    //item is the data that is passed to the chartData. this data is what we get from the api response
    const groupedData = records.reduce((result, dataRow) => {
      //series is the value of the grouping caption. this is the submenu of what the user selected from group by dropdown. the user selects a group and the series are the option in that group
      //we need to find the value of the selected group from the dataRow and use it as the series

      let series = groupings
        .filter((gr) => gr.active)
        .reduce((acc, gr) => dataRow[gr.caption] + " | " + acc, "")
        .slice(0, -2);

      if (!result[series]) {
        result[series] = [];
      }

      //create the requiered data structure for the line chart component as result object. firstGroupCaption is the value of the first group caption that is used to classify the data if there are more than one groupings
      result[series].push({
        x: dataRow["ID Year"],
        y: dataRow[selectedMeasure.label],
        firstGroupCaption: dataRow[groupings[0].caption],
      });
      return result;
    }, {});

    //sort the data based on the x value to be sure the data(years) are in the correct order
    Object.keys(groupedData).forEach((series) => {
      groupedData[series].sort((a, b) => a.x - b.x);
    });

    //set up the id from the groupedData key and what we've got as series before
    return Object.keys(groupedData).map((series) => {
      return {
        id: series,
        firstGroupCaption: groupedData[series][0].firstGroupCaption,
        data: groupedData[series],
      };
    });
  };

  //groupedData is the transformed data that is passed to the line chart component

  const groupedData = transformData(chartData);

  //the functions below are used to get the top 10 records for the data that are more than 10 records to display only top 10 records. this is done by calculating the average of the records and sorting them in descending order

  const averageRecords = Object.keys(groupedData).map((groupKey) => {
    const records = groupedData[groupKey];
    const average = records.data.reduce(
      (sum, record) => (sum + record.y) / records.data.length,
      0
    );

    return { records, average };
  });
  const sortedData = averageRecords.sort((a, b) => b.average - a.average);
  let topTenData = sortedData
    .slice(0, 10)
    .sort((a, b) => a.average - b.average)
    .map((data) => data.records);

  //uniqueGroups is an array of unique values of the firstGroupCaption from the topTenData
  const uniqueGroups = Array.from(
    new Set(topTenData.map((d) => d.firstGroupCaption))
  );

  //lineColors is an array of colors that are used to color the lines in the line chart.
  const lineColors =
    uniqueGroups.length > 1
      ? chroma.scale("Spectral").colors(uniqueGroups.length)
      : ["#0895b8"];

  //colorMap is an object that reduce over the uniqueGroups array and create an object with the uniqueGroups as keys and the lineColors as values
  const colorMap = uniqueGroups.reduce((result, cut, i) => {
    return {
      ...result,
      [cut]: lineColors[i],
    };
  }, {});

  //Adding the color property to each object in the topTenData array
  topTenData = topTenData.map((d) => {
    return {
      ...d,
      color: colorMap[d.firstGroupCaption],
    };
  });

  //ResponsiveLine is the line chart component from nivo library that is used to render the line chart
  return (
    <StyledCharts>
      <ResponsiveLine
        data={topTenData}
        margin={{ top: 50, right: 100, bottom: 50, left: 90 }}
        xScale={{ type: "linear", min: "auto", max: "auto" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        enableSlices={"x"}
        yFormat={
          groupings.some((g) => g.drillDown.label === "Age")
            ? (value) => formatYear(value)
            : (value) => formatNumber(value)
        }
        enablePoints={false}
        axisTop={null}
        axisRight={null}
        curve="natural"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Year",
          legendOffset: 40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        theme={{
          text: { fontSize: ".8em" },
          axis: { legend: { text: { fontSize: "1em" } } },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: selectedMeasure.label,
          legendOffset: -70,
          legendPosition: "middle",
          truncateTickAt: 0,
          format: (value) => formatNumber(value),
        }}
        colors={topTenData.map((d) => d.color)}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderColor={{ from: "serieColor" }}
        pointBorderWidth={2}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
      />
    </StyledCharts>
  );
}
// {groupings.some((g) => g.drillDown.label === "Age")
//   ? formatYear(point.data.y)
//   : formatNumber(point.data.y)}
