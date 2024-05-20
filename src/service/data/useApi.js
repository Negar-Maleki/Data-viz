import { useFilter } from "../../contexts/FilterContext";

const useApiCall = () => {
  const {
    selectedLabels,
    appliedMajorOption,
    appliedOptions,
    selectedAggregate,
    inputValue,
  } = useFilter();

  async function getFilteredData() {
    const labelName = selectedLabels.name;
    const startingDimentsionName =
      selectedLabels.data.dimensions[0].dimensionName.replace(/ /g, "+");
    const startingHierarchyName =
      selectedLabels.data.dimensions[0].hierarchies[0].levels[2].name.replace(
        / /g,
        "+"
      );
    const measures = selectedLabels.label.replace(/ /g, "+");
    try {
      let url = `https://zircon-api.datausa.io/cubes/${labelName}/aggregate.jsonrecords?drilldown[]=[Year].[Year]&drilldown[]=[${startingDimentsionName}].[${startingHierarchyName}]&measures[]=${measures}&order=[Measures].[${measures}]&order_desc=true&nonempty=true&parents=true&sparse=true`;

      if (appliedMajorOption.length > 0) {
        const drilldownParamFirstMajOpt = appliedMajorOption[0].label.replace(
          / /g,
          "+"
        );
        const cutParamRestMajOpt = appliedMajorOption.map((param) =>
          param.label.replace(/ /g, "+")
        );
        url = `https://zircon-api.datausa.io/cubes/${labelName}/aggregate.jsonrecords?drilldown[]=[Year].[Year]&drilldown[]=[${drilldownParamFirstMajOpt}].[${drilldownParamFirstMajOpt}]&measures[]=${measures}&order=[Measures].[${measures}]&order_desc=true&nonempty=true&parents=true&sparse=true`;
        // if (appliedMajorOption.length > 1) {
        //   const cutParams = cutParamRestMajOpt
        //     .map((param) => appliedOptions.length > 0? `cut[]=${encodeURIComponent(param)}.%26${appliedOptions
        //       .map((param) => `cut[]=${encodeURIComponent(param.labelreplace(
        //         / /g,
        //         "+"
        //       ))}`)}`)
        //     .join("&");
        //   url += `&${cutParams}`;
        //   if (appliedOptions.length > 0) {
        //     const cutParams = appliedOptions
        //       .map((param) => `cut[]=${encodeURIComponent(param.label)}`)
        //       .join("&");
        //     url += `&${cutParams}`;
        //   }
        // }
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return getFilteredData;
};
