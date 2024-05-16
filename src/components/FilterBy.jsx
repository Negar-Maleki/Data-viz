import styled from "styled-components";

import { Button } from "primereact/button";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import FilterBar from "./FilterBar";
import { useState } from "react";

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

function FilterBy({}) {
  const [filterCount, setFilterCount] = useState([1]);

  const handleAddFilter = () => {
    setFilterCount(filterCount + 1);
  };

  return (
    <StyledFilter>
      <label>Filter by</label>
      {[...filterCount].map((_, index) => (
        <Inplace unstyled="true" key={index}>
          <InplaceDisplay>
            <Button
              type="button"
              label="Add filter"
              outlined
              severity="info"
              icon="pi pi-plus"
              onClick={handleAddFilter}
            />
          </InplaceDisplay>
          <InplaceContent>
            <fieldset>
              <FilterBar />
            </fieldset>
          </InplaceContent>
        </Inplace>
      ))}
    </StyledFilter>
  );
}

export default FilterBy;
