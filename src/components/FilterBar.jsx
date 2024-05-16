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
  const { selectedLabels, applyMajorOptionState, applyOptionsState, dispatch } =
    useFilter();
  const [selectedItem, setSelectedItem] = useState("=");
  const [inputValue, setInputValue] = useState(0);
  const [selectedAggregate, setSelectedAggregate] = useState(null);

  const filterByOptions = [
    { label: "Equal to", value: "=" },
    { label: "Greater than", value: ">" },
    { label: "Less than", value: "<" },
    { label: "Greater than or equal to", value: ">=" },
    { label: "Less than or equal to", value: "<=" },
  ];

  const handleApplyFilter = () => {
    // if (filterByOptions && selectedAggregate) ;
  };

  const handleDeleteFilter = () => {};
  console.log(applyMajorOptionState, applyOptionsState);
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

    const res = await fetch(
      `https://zircon-api.datausa.io/cubes/${labelName}/aggregate.jsonrecords?drilldown[]=[Year].[Year]&drilldown[]=[${startingDimentsionName}].[${startingHierarchyName}]&measures[]=${measures}&order=[Measures].[${measures}]&order_desc=true&nonempty=true&parents=true&sparse=true`
    );

    const data = await res.json();
  }

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
  return (
    <StyledFilter>
      {selectedLabels ? (
        <Dropdown
          value={selectedAggregate}
          onChange={(e) => setSelectedAggregate(e.value)}
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
          onChange={(e) => setInputValue(e.value)}
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
