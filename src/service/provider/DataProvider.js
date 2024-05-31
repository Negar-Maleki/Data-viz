import React, { useState, useEffect, createContext } from "react";
import { getCubes } from "../data/client";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCubes().then((data) => setData(data));
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export { DataContext, DataProvider };
