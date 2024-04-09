import styled from "styled-components";

const StyledFilters = styled.div`
  background-color: #ece3e25d;
  padding: 1em;
  input {
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
    width: 100%;
  }
`;

function Filters() {
  return (
    <StyledFilters>
      <form>
        <label htmlFor="keyword">Search:</label>
        <input placeholder="Keyword"></input>
      </form>
    </StyledFilters>
  );
}

export default Filters;
