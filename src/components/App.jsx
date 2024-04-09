import styled from "styled-components";
import Main from "./Main";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const StyledApp = styled.div`
  width: 100%;
  height: 100vh;
  @media screen and (min-width: 775px) {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: auto 1fr auto;
  }
`;

function App() {
  return (
    <StyledApp>
      <NavBar />
      <Sidebar />
      <Main />
      <Footer />
    </StyledApp>
  );
}

export default App;
