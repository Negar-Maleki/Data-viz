import styled from "styled-components";
import Filters from "./Filters";

const StyledSidebar = styled.div`
  grid-column: 1/2;
  grid-row: 2;
  background-color: #d5b9b8;

  display: grid;
  grid-template-columns: 1fr;
  /* grid-template-rows: repeat(auto-fit, minmax(10em, auto)); */
  gap: 1em;
  padding: 1em;
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Filters />
      <Filters />
      <Filters />
      <Filters />
    </StyledSidebar>
  );
}

export default Sidebar;
