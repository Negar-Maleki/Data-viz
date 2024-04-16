import styled from "styled-components";

const StyledHeader = styled.div`
  font-size: 2em;
  padding-left: 1em;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  width: 5em;
  img {
    width: 2em;
  }

  @media screen and (max-width: 775px) {
    justify-items: end;
    justify-self: end;
    padding-right: 0.5em;
    h5 {
      display: none;
    }
    img {
      width: 1em;
    }
  }
`;

function Header() {
  return (
    <StyledHeader>
      <img src="LogoNoBG.png" alt="logo" />
      <h5>Data viz</h5>
    </StyledHeader>
  );
}

export default Header;
