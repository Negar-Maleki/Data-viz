import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { useFilter } from "../contexts/FilterContext";

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

// Filter by component to display the filter bars and add filter button
function FilterBy() {
  // Get the filters, selected measure and dispatch function from the FilterContext
  const { filters, selectedMeasure, dispatch } = useFilter();

  // Get the aggregates from the selected measure. The aggregates are the selected topic dimensions that the user selected in the showing menue and used to populate the filter dropdown. aggregates is an array of
  const aggregates = selectedMeasure?.more.map((name) => ({
    name,
  }));

  // The handleAddFilter function is called when the user clicks the add filter button. It dispatches an action to update the filter state with a new filter object. The key is generated using the uuidv4 function from the uuid package.
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
        severity="primary"
        icon="pi pi-plus"
        onClick={handleAddFilter}
        disabled={selectedMeasure === null}
      />
    </StyledFilter>
  );
}

export default FilterBy;
