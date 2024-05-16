import { createContext, useContext, useReducer } from "react";

const FilteringContext = createContext();

const initialState = {
  measureNodes: null,
  selectedLabels: null,
  selectedGroupByLabels: [],
  selectedItem: null,
  selectedAggregate: null,
  inputValue: null,
  applyFilter: "=",
};

function reducer(state, action) {
  switch (action.type) {
    case "setNodes":
      return { ...state, measureNodes: action.payload };

    case "setSelectedLabels":
      return { ...state, selectedLabels: action.payload };
    case "setSelectedGroupByLabels":
      return { ...state, selectedGroupByLabels: action.payload };
    case "setAppliedMajorOption":
      return { ...state, appliedMajorOption: action.payload };
    case "setAppliedOptions":
      return { ...state, appliedOptions: action.payload };

    default:
      return new Error("Unknown action");
  }
}

function FilterProvider({ children }) {
  const [
    {
      measureNodes,
      selectedLabels,
      selectedGroupByLabels,
      appliedMajorOption,
      appliedOptions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  console.log(appliedMajorOption, appliedOptions);
  return (
    <FilteringContext.Provider
      value={{
        measureNodes,
        selectedLabels,
        selectedGroupByLabels,
        appliedMajorOption,
        appliedOptions,
        dispatch,
      }}
    >
      {children}
    </FilteringContext.Provider>
  );
}

const useFilter = () => {
  const context = useContext(FilteringContext);
  if (!context) {
    throw new Error(
      "Filtering context must be used within a FilteringProvider"
    );
  }
  return context;
};

export { FilterProvider, useFilter };
