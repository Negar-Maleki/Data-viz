import styled from "styled-components";

const StyledFooter = styled.footer`
  grid-column: 1/-1;
  background-color: #efefef;
`;

function Footer() {
  return <StyledFooter>footer</StyledFooter>;
}

export default Footer;
