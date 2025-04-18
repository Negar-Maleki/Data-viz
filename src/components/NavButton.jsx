import styled from "styled-components";

const StyledNavButton = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(4, minmax(2em, 1fr));

  @media screen and (max-width: 775px) {
    display: none;
  }
`;

function NavButton() {
  return (
    <StyledNavButton>
      <p>Home</p>
      <p>Reports</p>
      <p>Maps</p>
      <p>About</p>
    </StyledNavButton>
  );
}

export default NavButton;
