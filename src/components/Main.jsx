import styled from "styled-components";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useFilter } from "../contexts/FilterContext";

import { getFilteredData } from "../service/data/client";

import HorizontalBar from "./HorizontalBar";
import LineChart from "./LineChart";
import "primeicons/primeicons.css";
import { ProgressSpinner } from "primereact/progressspinner";

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
  const [data, setData] = useState([]);

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
        <span>empty data set</span>
      </StyledError>
    );
  }

  return (
    <StyledMain>
      <HorizontalBar />
      <LineChart data={data} />
    </StyledMain>
  );
}

export default Main;
