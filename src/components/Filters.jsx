import React, { useState } from "react";
import styled from "styled-components";

import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const StyledFilters = styled.div`
  display: grid;
  gap: 1em;

  label {
    padding-bottom: 1em;
  }
`;
const StyledButton = styled.div`
  display: grid;
  gap: 0.2em;
  grid-auto-flow: column;
`;

function Filters() {
  const [selectedCities, setSelectedCities] = useState(null);
  const cities = [
    { name: "Geography", code: "GEO" },
    { name: "Citizen status", code: "CTST" },
    { name: "Employment status", code: "EMST" },
    { name: "Degree", code: "DG" },
    { name: "Ethnicity", code: "ETH" },
  ];

  return (
    <StyledFilters>
      <MultiSelect
        value={selectedCities}
        onChange={(e) => setSelectedCities(e.value)}
        options={cities}
        optionLabel="name"
        filter
        placeholder="Total population"
        maxSelectedLabels={3}
        dropdownIcon="pi pi-chevron-down "
      />

      <div className="p-inputgroup">
        <InputText placeholder="Search..." />
        <Button icon="pi pi-search" className="p-button-warning" />
      </div>
      <StyledButton>
        <Button label="Delete" severity="danger" outlined />
        <Button label="Apply" severity="info" />
      </StyledButton>
    </StyledFilters>
  );
}

export default Filters;
