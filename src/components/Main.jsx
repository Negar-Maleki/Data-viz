import styled from "styled-components";
import HorizontalBar from "./HorizontalBar";
import LineChart from "./LineChart";

const StyledMain = styled.div`
  grid-column: 2/-1;
  grid-row: 2;

  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(10em, auto));
  grid-template-columns: auto;
  gap: 1em;
  padding: 1em;

  :last-child:nth-child(odd) {
    grid-column: 1/-1;
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

function Main() {
  return (
    <StyledMain>
      <HorizontalBar />
      <LineChart />
    </StyledMain>
  );
}

export default Main;
