import styled from "styled-components";
import { useEffect, useState } from "react";
import { useFilter } from "../contexts/FilterContext";

import { getFilteredData } from "../service/data/client";

import HorizontalBar from "./HorizontalBar";
import LineChart from "./LineChart";
import "primeicons/primeicons.css";

const StyledMain = styled.div`
  grid-column: 2/-1;
  grid-row: 2;

  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(10em, auto));
  grid-template-columns: auto;
  gap: 1em;
  padding: 1em;

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

function Main() {
  const { filters, selectedMeasure, groupings } = useFilter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(false);
        const data = await getFilteredData(groupings, filters, selectedMeasure);
        return data;
      } catch (error) {
        setError(error);
      }
    };

    getData();
    setLoading(true);
  }, [groupings, filters, selectedMeasure]);

  if (error?.message === "500" && loading === true) {
    return (
      <StyledError>
        <i className="pi pi-globe"></i>
        <span>Network error</span>
      </StyledError>
    );
  } else if (error && loading === true) {
    return (
      <StyledError>
        <i className="pi pi-exclamation-circle"></i>
        <span>empty data set</span>
      </StyledError>
    );
  }
  console.log(loading);
  return (
    <StyledMain>
      {!error && loading === false && (
        <>
          <HorizontalBar />
          <LineChart />
        </>
      )}
    </StyledMain>
  );
}

export default Main;
