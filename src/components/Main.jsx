import styled from "styled-components";
import { useEffect, useState } from "react";

import { ProgressSpinner } from "primereact/progressspinner";
import { InputSwitch } from "primereact/inputswitch";

import { useFilter } from "../contexts/FilterContext";
import { getFilteredData } from "../service/client";

import LineChart from "./LineChart";
import TreeMap from "./TreeMap";
import ChartDialog from "./ChartDialog";
import Tables from "./Tables";
import CsvDownloadButton from "./CsvDownloadButton";

const StyledMain = styled.div`
  grid-column: 2/-1;
  grid-row: 2;
  justify-self: space-between;

  padding: 0;
  margin: 1em;
  padding-bottom: 2em;
  height: 100%;
  overflow-x: auto;
  //The main component uses a grid layout with auto-fill rows and auto-fit columns to dynamically distribute content. However, to meet the requirements of the Nivo charting library, minimum and maximum sizes are explicitly defined for each content element using the minmax function.
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(30em, 1fr));
  grid-template-columns: repeat(auto-fit, minmax(30em, 1fr));

  gap: 3em;

  :last-child:nth-child(odd) {
    grid-column: 1/-1;
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledError = styled.div`
  i {
    font-size: 6em;
  }
  color: #33333380;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    font-size: 1em;
  }
`;

const StyledInputSwitch = styled.div`
  grid-column: 2/-1;
  grid-row: 2;
  margin: 1em;

  display: grid;
  grid-template-columns: 1fr 1fr;
  width: fit-content;
  gap: 1em;
  font-size: 1.2em;
  font-weight: 600;
`;

//main component that contains the charts and tables components
function Main() {
  //get the filters, selected measure and groupings from the context
  const { filters, selectedMeasure, groupings } = useFilter();
  //state to store the error to see if there is any error
  const [error, setError] = useState(null);
  //state to store the loading state to display the loading spinner
  const [loading, setLoading] = useState(false);
  //state to store the data that is fetched from the server
  const [data, setData] = useState([]);
  //state to store the checked state of the input switch
  const [checked, setChecked] = useState(false);
  //state to store the visibility of the table
  const [tableVisible, setTableVisible] = useState(false);
  //state to store the products for downloading tabels with the format we have on display
  const [products, setProducts] = useState([]);

  //fetch the data from the server based on the filters, groupings and selected measure. each time the filters, groupings or selected measure changes
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const newData = await getFilteredData(
          groupings,
          filters,
          selectedMeasure
        );

        setData(newData.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [groupings, filters, selectedMeasure]);

  //if the data is loading or the data is empty show the loading spinner
  if (loading || data.length === 0) {
    return (
      <StyledError>
        <ProgressSpinner
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </StyledError>
    );
  }

  //if there is a network error show which is 500 the network error message
  if (error?.message === "500") {
    return (
      <StyledError>
        <i className="pi pi-globe"></i>
        <span>Network error</span>
      </StyledError>
    );
  } else if (error) {
    //if other errors occured show the error message
    return (
      <StyledError>
        <i className="pi pi-exclamation-circle"></i>
        <span>Empty data set</span>
      </StyledError>
    );
  }
  //function to handle the input switch to switch between the charts and tables
  const handleInputSwitch = (e) => {
    setTableVisible(!tableVisible);
    setChecked(e.value);
  };

  return (
    <>
      <StyledInputSwitch>
        {tableVisible ? (
          <span>Switch to Chart</span>
        ) : (
          <span>Switch to Table</span>
        )}
        <InputSwitch
          checked={checked}
          onChange={handleInputSwitch}
          tooltip={`${tableVisible ? "Show charts" : "Show tables"}`}
        />
      </StyledInputSwitch>

      <StyledMain>
        {!tableVisible && (
          <>
            <div>
              {/* chart dialog containes the primerect Dialog component, zooming in button, and dowloading button  */}
              <ChartDialog>
                {/* <TransformWrapper>
                  <TransformComponent> */}
                <LineChart chartData={data} />
                {/* </TransformComponent>
                </TransformWrapper> */}
              </ChartDialog>
            </div>
            <div>
              <ChartDialog>
                <TreeMap chartData={data} />
              </ChartDialog>
            </div>
          </>
        )}
        {tableVisible && (
          <CsvDownloadButton products={products}>
            <Tables
              chartData={data}
              products={products}
              onSetProducts={setProducts}
            />
          </CsvDownloadButton>
        )}
      </StyledMain>
    </>
  );
}

export default Main;
