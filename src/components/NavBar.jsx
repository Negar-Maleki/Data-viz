import styled from "styled-components";
import Header from "./Header";
import NavButton from "./NavButton";
import ResponsiveMenu from "./ResponsiveMenu";

const StyledNavBar = styled.div`
  grid-column: 1/-1;
  grid-row: 1;
  background-color: #c8b5b5;
  width: 100%;

  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  @media screen and (min-width: 775px) {
    grid-template-columns: 3fr 1fr;
  }
`;

function NavBar() {
  return (
    <StyledNavBar>
      <Header />
      <NavButton />
      <ResponsiveMenu />
    </StyledNavBar>
  );
}

export default NavBar;
