import styled from "styled-components";

import { useFilter } from "../contexts/FilterContext";
import Main from "./Main";

const StyledStartPage = styled.div`
  grid-column: 2/-1;
  grid-row: 2;
  margin: 1em;
  padding: 1em;
  justify-self: center;
  align-self: center;
  max-width: 95%;

  //display different layout based on the groupings activity which is defines in the context when the user clicks on the apply button.
  display: ${(props) => (props.$active ? "grid" : "none")};
  align-items: center;
  grid-template-rows: repeat(auto-fill, minmax(20em, auto));

  grid-template-columns: auto;
  gap: 1em;

  box-shadow: 1px 1px 5px 1px #ccc;
  border-radius: 5px;
  div {
    justify-self: center;
    align-self: center;
  }
  img {
    /* max-height: 50%; */
    max-width: 70%;
    box-shadow: 2px 2px 5px 2px #b0afaf;
    border-radius: 5px;
    justify-self: center;
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;
//starting page when no item is selected
function StartPage() {
  const { groupings } = useFilter();

  //check if any grouping is active(if the user clicked on apply button) if yes then show the main page which contains the charts and tables
  const active = groupings
    ? groupings?.some((grouping) => grouping.active === true)
    : false;

  return (
    <>
      <StyledStartPage $active={!active}>
        <div>
          <h2>Welcome to Data viz!</h2>
          <p>Explore and Analyze Your Data with Ease.</p>
          <p>
            Search, filter, and visualize data to gain deeper understanding.
          </p>
          <p>Make informed decisions with interactive data exploration.</p>
        </div>
        <img src="startingImg.png" alt="starting image" />
      </StyledStartPage>

      {active ? <Main /> : null}
    </>
  );
}

export default StartPage;
