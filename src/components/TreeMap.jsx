import styled from "styled-components";

import { ResponsiveTreeMap } from "@nivo/treemap";

import { useFilter } from "../contexts/FilterContext";
import chroma from "chroma-js";

const StyledCharts = styled.div`
  width: 100%;
  height: 100%;
`;

// TreeMap component
//chartData is the data passed as props by the parent component that will be used to render the chart
export default function TreeMap({ chartData }) {
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

  //for the TreeMAp component, we need to produce color for each node in the tree map as the component expects a color for each node
  const getRandomHslColor = () => {
    //hue is a value between 0 and 360 that represents the color which is randomly generated
    const hue = Math.floor(Math.random() * 361);
    //saturation is a value between 0 and 100 that represents the intensity of the color which is set to 70
    const saturation = 70;
    //lightness is a value between 0 and 100 that represents the brightness of the color which is set to 50
    const lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  //getLastYearData is a function that filters the data to get the data for the last year. in tree map we only need to display the data for the last year
  const getLastYearData = (arr) => {
    //get the maximum number(year) from the data
    const maxY = Math.max(...arr.map((item) => item.Year));
    //filter the data to get the data for the last year
    return arr.filter((d) => Number(d.Year) === maxY);
  };
  //lastYearData is the data for the last year
  const lastYearData = getLastYearData(chartData);

  //calculatePercentage is a function that calculates the percentage of each node in the tree map
  const calculatePercentage = (data) => {
    const total = data.children.reduce(
      (sum, child) => sum + child.children[0].loc,
      0
    );

    data.children.forEach((child) => {
      child.children[0].share =
        ((child.children[0].loc / total) * 100).toFixed(2) + "%";
    });
    return data;
  };

  //transformData is a function that transforms the data to the format that the tree map component expects
  const transformData = (records) => {
    //item is the data that is passed to the chartData. this data is what we get from the api response
    const groupedData = records.reduce((result, dataRow) => {
      //children is the value of the grouping caption. this is the submenu of what the user selected from group by dropdown. the user selects a group and the series are the option in that group

      let children = groupings
        .filter((gr) => gr.active)
        .reduce((acc, gr) => dataRow[gr.caption] + " | " + acc, "")
        .slice(0, -2);

      if (!result[children]) {
        result[children] = [];
      }
      console.log(selectedMeasure);

      //create the requiered data structure for the tree map component as result object
      result[children].push({
        name: children,
        year: dataRow.Year,
        loc: dataRow[selectedMeasure.label],
        firstGroupCaption: dataRow[groupings[0].caption],
      });

      return result;
    }, {});

    //sort the data based on the x value to be sure the data(years) are in the correct order
    Object.keys(groupedData).forEach((series) => {
      groupedData[series].sort((a, b) => a.x - b.x);
    });

    //set up the data structure for the tree map component
    return {
      name: selectedMeasure.label,
      color: getRandomHslColor(),
      children: Object.keys(groupedData).map((series) => ({
        name: series,
        color: getRandomHslColor(),
        children: groupedData[series],
      })),
    };
  };
  //groupedData is the transformed data that is passed to the tree map component
  let groupedData = transformData(lastYearData, levelName);

  const uniqueGroups = Array.from(
    new Set(groupedData.children.map((d) => d.children[0].firstGroupCaption))
  );

  //treeMapColors is an object that contains the color for each node in the tree map
  let treeMapColors =
    uniqueGroups.length > 1
      ? chroma.scale("Spectral").colors(uniqueGroups.length).reverse()
      : ["#0895b8"];

  //creating an object that contains the tree map colors for each node in the tree map based on the index of the unique groups
  treeMapColors = uniqueGroups.reduce((acc, group, index) => {
    return {
      ...acc,
      [group]: treeMapColors[index],
    };
  }, {});

  //Adding the color property to each object in the unique groups array
  groupedData.children.forEach((child) => {
    child.color = treeMapColors[child.children[0].firstGroupCaption];
    child.children[0].color =
      treeMapColors[child.children[0].firstGroupCaption];
  });

  //cutomiseLabel is the data that is passed to the tree map component after calculating the percentage
  const customisedLabel = calculatePercentage(groupedData);
  console.log(customisedLabel);
  return (
    <>
      <StyledCharts>
        <ResponsiveTreeMap
          data={customisedLabel}
          tooltip={({ node }) => {
            return (
              <div
                style={{
                  backgroundColor: "white",
                  padding: ".5em",
                  borderRadius: "10px",
                }}
              >
                <h3>{node.id}</h3>
                Year: {node.data.year} <br />
                {selectedMeasure.label}: {node.formattedValue}
                <br />
                {selectedMeasure.label} share: {node.data.share}
                <br />
              </div>
            );
          }}
          identity="name"
          value="loc"
          valueFormat=".02s"
          tile="binary"
          leavesOnly={true}
          innerPadding={2}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          labelSkipSize={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          colors={customisedLabel.children.map((d) => d.color)}
          label={(e) =>
            (e.id.length > 15 ? e.id.slice(0, 15) + "... (" : e.id + " (") +
            e.formattedValue +
            ")"
          }
          theme={{
            text:
              uniqueGroups.length < 15
                ? { fontSize: "1em" }
                : { fontSize: ".8em" },
          }}
          parentLabelPosition="left"
          parentLabelTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          nodeOpacity={0.7}
        />
      </StyledCharts>
    </>
  );
}
