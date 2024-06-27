import styled from "styled-components";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useFilter } from "../contexts/FilterContext";

import { getFilteredData } from "../service/data/client";

import "primeicons/primeicons.css";
import { ProgressSpinner } from "primereact/progressspinner";
import HorizontalBar from "./HorizontalBar";
import LineChart from "./LineChart";
import { InputSwitch } from "primereact/inputswitch";
import LineChartNew from "./LineChartNew";
import TreeMap from "./TreeMap";

const StyledMain = styled.div`
  grid-column: 2/-1;
  grid-row: 2;

  margin: 1em 0 1em 1em;
  padding: 0;
  padding-bottom: 2em;
  height: 100%;

  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(30em, 1fr));
  grid-template-columns: repeat(auto-fit, minmax(30em, 1fr));
  overflow-x: hidden;

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

const StyledInputSwitch = styled(InputSwitch)`
  grid-column: 2/-1;
  grid-row: 2;
`;

function Main() {
  const { filters, selectedMeasure, groupings } = useFilter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState(false);

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
      }
    };

    getData();

    setLoading(false);
  }, [groupings, filters, selectedMeasure]);

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
  if (error?.message === "500") {
    return (
      <StyledError>
        <i className="pi pi-globe"></i>
        <span>Network error</span>
      </StyledError>
    );
  } else if (error) {
    return (
      <StyledError>
        <i className="pi pi-exclamation-circle"></i>
        <span>Empty data set</span>
      </StyledError>
    );
  }

  return (
    <>
      <StyledInputSwitch className="card flex justify-content-center">
        <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
      </StyledInputSwitch>
      <StyledMain>
        {/* <LineChartNew chartData={data} /> */}
        <TreeMap chartData={data} />
      </StyledMain>
    </>
  );
}

export default Main;
