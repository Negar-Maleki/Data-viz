import styled from "styled-components";
import FilterShowing from "./FilterShowing";
import GroupedByFilter from "./GroupedByFilter";
import FilterBy from "./FilterBy";

const StyledSidebar = styled.div`
  grid-column: 1/2;
  grid-row: 2;
  width: 100%;
  border-right: 1px solid #ccc;
  padding: 1em;
  @media screen and (max-width: 775px) {
    border-right: none;
  }
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <FilterShowing />
      <GroupedByFilter />
      <FilterBy />
    </StyledSidebar>
  );
}

export default Sidebar;
