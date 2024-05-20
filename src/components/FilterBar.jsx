import styled from "styled-components";
import { LuChevronsUpDown } from "react-icons/lu";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useFilter } from "../contexts/FilterContext";

const StyledFilter = styled.div`
  display: grid;
  gap: 1em;
`;

const StyledNumFilter = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(auto-fit, minmax(5em, 1fr));
  width: 100%;
  span {
    input {
      width: 100%;
    }
  }
`;
const StyledButton = styled.div`
  display: grid;
  gap: 0.2em;
  grid-auto-flow: column;
`;
function FilterBar() {
  const {
    selectedLabels,
    appliedMajorOption,
    selectedAggregate,
    inputValue,
    appliedOptions,
    dispatch,
  } = useFilter();
  const [selectedItem, setSelectedItem] = useState("=");

  const filterByOptions = [
    { label: "Equal to", value: "=" },
    { label: "Greater than", value: ">" },
    { label: "Less than", value: "<" },
    { label: "Greater than or equal to", value: ">=" },
    { label: "Less than or equal to", value: "<=" },
  ];

  const handleDeleteFilter = () => {};

  const aggregates = selectedLabels?.more.map((name) => ({ name }));
  // function buildFilterString() {
  //   if (selectedItem === "=") {
  //     return `${measures} = ${inputValue}`;
  //   } else if (selectedItem === ">") {
  //     return `${measures} > ${inputValue}`;
  //   } else if (selectedItem === "<") {
  //     return `${measures} < ${inputValue}`;
  //   } else if (selectedItem === ">=") {
  //     return `${measures} >= ${inputValue}`;
  //   } else if (selectedItem === "<=") {
  //     return `${measures} <= ${inputValue}`;
  //   }
  // }

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
    console.log(appliedMajorOption);
    // try {
    let url = `https://zircon-api.datausa.io/cubes/${labelName}/aggregate.jsonrecords?drilldown[]=[Year].[Year]&drilldown[]=[${startingDimentsionName}].[${startingHierarchyName}]&measures[]=${measures}&order=[Measures].[${measures}]&order_desc=true&nonempty=true&parents=true&sparse=true`;

    if (appliedMajorOption) {
      const drilldownParamFirstMajOpt = appliedMajorOption.label.replace(
        / /g,
        "+"
      );

      url = `https://zircon-api.datausa.io/cubes/${labelName}/aggregate.jsonrecords?drilldown[]=[Year].[Year]&drilldown[]=[${drilldownParamFirstMajOpt}].[${drilldownParamFirstMajOpt}]&measures[]=${measures}&order=[Measures].[${measures}]&order_desc=true&nonempty=true&parents=true&sparse=true`;
    }

    if (appliedOptions) {
      console.log("Applied Options", appliedOptions);
    }

    /*if (appliedMajorOption.length > 1) {
        const cutParams = cutParamRestMajOpt
          .map((param) =>
            appliedOptions.length > 0
              ? `cut[]=${encodeURIComponent(param)}.%26${appliedOptions.map(
                  (param) =>
                    `cut[]=${encodeURIComponent(
                      param.labelreplace(/ /g, "+")
                    )}`
                )}`
              : `cut[]=${encodeURIComponent(param)}`
          )
          .join("&");
        url += `&${cutParams}`;
        if (appliedOptions.length > 0) {
          const cutParams = appliedOptions
            .map((param) => `cut[]=${encodeURIComponent(param.label)}`)
            .join("&");
          url += `&${cutParams}`;
        }
      }*/
    //   }

    //   const res = await fetch(url);

    //   if (!res.ok) {
    //     throw new Error("Network response was not ok");
    //   }
    //   const data = await res.json();
    //   return data;
    // } catch (error) {
    //   console.error("Error:", error);
  }

  const handleApplyFilter = () => {
    console.log("Apply Filter");
    getFilteredData();
  };
  return (
    <StyledFilter>
      {selectedLabels ? (
        <Dropdown
          value={selectedAggregate}
          onChange={(e) =>
            dispatch({ type: "setSelectedAggregate", payload: e.value })
          }
          options={aggregates}
          optionLabel="name"
          placeholder="Select..."
          className="w-full md:w-14rem"
        />
      ) : (
        <Dropdown disabled />
      )}
      <StyledNumFilter>
        <Dropdown
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.value)}
          options={filterByOptions}
          placeholder={filterByOptions[0].label}
          dropdownIcon={<LuChevronsUpDown />}
        />

        <InputNumber
          decrementButtonClassName="p-button-info"
          incrementButtonClassName="p-button-info"
          showButtons
          value={inputValue}
          onChange={(e) =>
            dispatch({ type: "setInputValue", payload: e.value })
          }
        />
      </StyledNumFilter>
      <StyledButton>
        <Button
          label="Delete"
          severity="danger"
          outlined
          onClick={handleDeleteFilter}
        />
        <Button label="Apply" severity="info" onClick={handleApplyFilter} />
      </StyledButton>
    </StyledFilter>
  );
}

export default FilterBar;
