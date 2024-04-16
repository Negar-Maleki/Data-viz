import styled from "styled-components";
import Header from "./Header";
import NavButton from "./NavButton";
import ResponsiveMenu from "./ResponsiveMenu";

const StyledNavBar = styled.div`
  grid-column: 1/-1;
  grid-row: 1;
  background-color: #fff;
  border-bottom: 0.5em solid var(--yellow-500);
  min-width: 100vw;
  height: 5em;
  color: var(--cyan-900);

  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-content: center;
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
