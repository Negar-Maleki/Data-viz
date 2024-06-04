import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { useFilter } from "../contexts/FilterContext";

import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";

import FilterBar from "./FilterBar";

const StyledFilter = styled.div`
  display: grid;
  gap: 1em;
  margin-top: 2em;
  label {
    margin-bottom: 0.5em;
  }

  Button {
    display: inline;
    width: 100%;
  }
`;

function FilterBy() {
  const { filters, selectedMeasure, dispatch } = useFilter();
  const aggregates = selectedMeasure?.more.map((name) => ({
    name,
  }));

  const handleAddFilter = () => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: null,
        newFilter: {
          name: { name: aggregates[0].name },
          active: false,
          key: uuidv4(),
          operation: "=",
          inputValue: 0,
        },
      },
    });
  };

  return (
    <StyledFilter>
      <label>Filter by</label>
      {selectedMeasure &&
        filters.map((filter) => (
          <FilterBar key={uuidv4()} filter={filter} aggregates={aggregates} />
        ))}

      <Button
        type="button"
        label="Add filter"
        outlined
        severity="info"
        icon="pi pi-plus"
        onClick={handleAddFilter}
        disabled={selectedMeasure === null}
      />
    </StyledFilter>
  );
}

export default FilterBy;
