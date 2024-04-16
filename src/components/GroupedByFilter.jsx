import styled from "styled-components";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import Filters from "./Filters";
import { Button } from "primereact/button";
import { useState } from "react";

const StyledFilters = styled.div`
  display: grid;
  min-height: 3.5em;

  label {
    padding: 0.5em 0;
  }
  fieldset {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 1em;
  }
`;

const AddGroupButton = styled(Button)`
  width: 100%;
  display: inline;
`;

function GroupedByFilter() {
  const [filterCount, setFilterCount] = useState([1]);

  const handleAddFilter = () => {
    setFilterCount(filterCount + 1);
  };

  return (
    <StyledFilters>
      <label>Grouped by</label>

      <fieldset>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        <Inplace unstyled="true">
          <InplaceDisplay>
            <Button label="Edit" severity="info" />
          </InplaceDisplay>
          <InplaceContent>
            <Filters />
          </InplaceContent>
        </Inplace>
      </fieldset>

      {[...filterCount].map((_, index) => (
        <Inplace unstyled="true" key={index}>
          <InplaceDisplay>
            <AddGroupButton
              type="button"
              label="Add group"
              outlined
              severity="info"
              icon="pi pi-plus"
              onClick={handleAddFilter}
            />
          </InplaceDisplay>
          <InplaceContent>
            <fieldset>
              <Filters />
            </fieldset>
          </InplaceContent>
        </Inplace>
      ))}
    </StyledFilters>
  );
}

export default GroupedByFilter;
