import styled from "styled-components";
import "primereact/resources/themes/lara-light-cyan/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";

import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import StartPage from "./StartPage";
import { FilterProvider } from "../contexts/FilterContext";

const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  //display the grid layout for the app in different screen sizes
  @media screen and (min-width: 775px) {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: auto 1fr auto;
  }
`;

//App component that wraps the whole application and the context provider. The context provider is used to provide the state and dispatch to the child components
function App() {
  return (
    <StyledApp>
      <FilterProvider>
        <NavBar />
        <Sidebar />
        <StartPage />
      </FilterProvider>
      <Footer />
    </StyledApp>
  );
}

export default App;
