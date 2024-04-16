import styled from "styled-components";
import { LuChevronsUpDown } from "react-icons/lu";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

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

function FilterBar() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAggregate, setSelectedAggregate] = useState(null);

  const Aggregates = [
    { name: "Record count", code: "NY" },
    { name: "Total population", code: "RM" },
    { name: "Average wage", code: "LDN" },
    { name: "Average Income", code: "IST" },
    { name: "Average age", code: "PRS" },
  ];

  const items = Array.from({ length: 10 }).map((_, i) => ({
    label: `Item #${i}`,
    value: i,
  }));

  return (
    <StyledFilter>
      <Dropdown
        value={selectedAggregate}
        onChange={(e) => setSelectedAggregate(e.value)}
        options={Aggregates}
        optionLabel="name"
        placeholder="Select..."
        className="w-full md:w-14rem"
      />
      <StyledNumFilter>
        <Dropdown
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.value)}
          options={items}
          virtualScrollerOptions={{ itemSize: 38 }}
          placeholder="Select Item"
          dropdownIcon={<LuChevronsUpDown />}
        />

        <InputNumber
          decrementButtonClassName="p-button-info"
          incrementButtonClassName="p-button-info"
          showButtons
        />
      </StyledNumFilter>
    </StyledFilter>
  );
}

export default FilterBar;
