import styled from "styled-components";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";

import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import StartPage from "./StartPage";

const StyledApp = styled.div`
  width: 100%;
  height: 100%;

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
      <StartPage />
      <Footer />
    </StyledApp>
  );
}

export default App;
