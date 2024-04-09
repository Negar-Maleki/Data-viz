import { TfiAlignJustify } from "react-icons/tfi";
import styled from "styled-components";

const StyledResponsiveMenu = styled.div`
  grid-column: 1;
  @media screen and (min-width: 775px) {
    display: none;
  }
`;

function ResponsiveMenu() {
  return (
    <StyledResponsiveMenu>
      <TfiAlignJustify />
    </StyledResponsiveMenu>
  );
}

export default ResponsiveMenu;
