import styled from "styled-components";
import { LuChevronsUpDown } from "react-icons/lu";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

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
function FilterBar({ selectedLabels }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAggregate, setSelectedAggregate] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [applyFilter, setApplyFilter] = useState("=");

  const Aggregates = selectedLabels?.more.map((name) => ({ name }));

  const filterByOptions = [
    { label: "Equal to", value: "=" },
    { label: "Greater than", value: ">" },
    { label: "Less than", value: "<" },
    { label: "Greater than or equal to", value: ">=" },
    { label: "Less than or equal to", value: "<=" },
  ];

  const handleApplyFilter = () => {
    if (filterByOptions && selectedAggregate) setApplyFilter(filterByOptions);
  };

  const handleDeleteFilter = () => {
    setApplyFilter("=");
    setInputValue(null);
  };

  function buildAPIRequest(
    measures,
    filters,
    drilldowns,
    cuts,
    order,
    orderDesc,
    nonEmpty,
    parents,
    sparse
  ) {
    let baseUrl =
      "https://zircon-api.datausa.io/cubes/pums_5/aggregate.jsonrecords?";
    let queryParams = [];

    // Add measures
    measures.forEach((measure) => {
      queryParams.push(`measures[]=${encodeURIComponent(measure)}`);
    });

    // Add filters
    filters.forEach((filter) => {
      queryParams.push(`filter[]=${encodeURIComponent(filter)}`);
    });

    // Add drilldowns
    drilldowns.forEach((drilldown) => {
      queryParams.push(`drilldown[]=${encodeURIComponent(drilldown)}`);
    });

    // Add cuts
    cuts.forEach((cut) => {
      queryParams.push(`cut[]=${encodeURIComponent(cut)}`);
    });

    // Add order
    if (order) {
      queryParams.push(`order=${encodeURIComponent(order)}`);
    }

    // Add order_desc
    if (orderDesc) {
      queryParams.push(`order_desc=${orderDesc}`);
    }

    // Add other parameters
    if (nonEmpty) {
      queryParams.push("nonempty=true");
    }
    if (parents) {
      queryParams.push("parents=true");
    }
    if (sparse) {
      queryParams.push("sparse=true");
    }

    // Construct the final URL
    const finalUrl = baseUrl + queryParams.join("&");

    return finalUrl;
  }

  // Example usage:
  const apiUrl = buildAPIRequest(
    ["Total Population"],
    ["Total Population < 10000", "Record Count = 1000"],
    ["Total Population < 10000", "Record Count = 1000"],
    ["[Year].[Year]", "[PUMS Occupation].[Major Occupation Group]"],
    [
      "[Geography].[State].%26[04000US02]",
      "[Employment Status].[Employment Status Parent].%26[Not Employed]",
    ],
    "[Measures].[Total Population]",
    true,
    true,
    true,
    true
  );

  console.log(apiUrl);

  return (
    <StyledFilter>
      {selectedLabels ? (
        <Dropdown
          value={selectedAggregate}
          onChange={(e) => setSelectedAggregate(e.value)}
          options={Aggregates}
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
