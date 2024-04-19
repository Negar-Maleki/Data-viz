import styled from "styled-components";

const StyledStartPage = styled.div`
  grid-column: 2/-1;
  grid-row: 2;
  margin: 1em;
  padding: 1em;
  justify-self: center;
  align-self: center;
  display: grid;
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
    max-height: 30em;
    box-shadow: 2px 2px 5px 2px #b0afaf;
    border-radius: 5px;
    justify-self: center;
  }
  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

function StartPage() {
  return (
    <StyledStartPage>
      <div>
        <h2>Welcome to Data viz!</h2>
        <p>Explore and Analyze Your Data with Ease.</p>
        <p>Search, filter, and visualize data to gain deeper understanding.</p>
        <p>Make informed decisions with interactive data exploration.</p>
      </div>

      <img src="startingImg.png" alt="starting image" />
    </StyledStartPage>
  );
}

export default StartPage;
