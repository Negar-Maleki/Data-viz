import { ResponsiveTreeMap } from "@nivo/treemap";
import { useFilter } from "../contexts/FilterContext";

export default function TreeMap({ chartData }) {
  const { selectedMeasure, groupings } = useFilter();

  if (!Array.isArray(groupings) || groupings.length === 0) {
    console.error("groupings is not defined or empty");
    return;
  }

  if (!Array.isArray(chartData) || chartData.length === 0) {
    console.error("data is not defined or empty");
    return;
  }

  const levelName = groupings.map(
    (grouping) => grouping.drillDown?.data?.level
  );

  if (!levelName.every(Boolean)) {
    console.error("One or more groupings do not have a valid dimensionName");
    return;
  }
  const getRandomHslColor = () => {
    const hue = Math.floor(Math.random() * 361);
    const saturation = 70;
    const lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  const getLastYearData = (arr) => {
    const maxY = Math.max(...arr.map((item) => item.Year));
    return arr.filter((d) => Number(d.Year) === maxY);
  };
  const lastYearData = getLastYearData(chartData);

  const transformData = (group) => {
    const groupedData = group.reduce((result, item) => {
      const children = item[groupings[0].caption];

      if (!result[children]) {
        result[children] = [];
      }

      result[children].push({
        name: children,
        year: item.Year,
        loc: item[selectedMeasure.label],
        color: getRandomHslColor(),
      });

      return result;
    }, {});

    Object.keys(groupedData).forEach((series) => {
      groupedData[series].sort((a, b) => a.x - b.x);
    });

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
  const groupedData = transformData(lastYearData, levelName);
  const calculatePercentage = (data) => {
    const total = data.children.reduce((sum, child) => sum + child.loc, 0);
    data.children.forEach((child) => {
      child.percentage = ((child.loc / total) * 100).toFixed(2) + "%";
    });
    return data;
  };
  console.log(calculatePercentage(lastYearData));
  return (
    <ResponsiveTreeMap
      data={groupedData}
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
        modifiers: [["darker", 1.2]],
      }}
      label={(e) => e.id.split(" ")[0] + " (" + e.formattedValue + ")"}
      parentLabelPosition="left"
      parentLabelTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.1]],
      }}
    />
  );
}
