import { clear } from "@testing-library/user-event/dist/clear";
import { createContext, useContext, useReducer } from "react";

const FilteringContext = createContext();

const initialState = {
  measureNodes: null,
  dimensionNodes: null,
  selectedMeasure: null,
  selectedItem: null,
  selectedAggregate: null,
  inputValue: 0,
  applyFilter: "=",
  groupings: [],
  appliedMajorOption: [],
  appliedOptions: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "setNodes":
      return { ...state, measureNodes: action.payload };
    case "setMeasure": {
      return {
        ...state,
        selectedMeasure: action.payload,
      };
    }
    case "setDimensionNodes":
      return {
        ...state,
        dimensionNodes: action.payload,
      };
    case "setAppliedMajorOption":
      return { ...state, appliedMajorOption: action.payload };
    case "setAppliedOptions":
      return { ...state, appliedOptions: action.payload };
    case "setInputValue":
      return { ...state, inputValue: action.payload };
    case "setSelectedAggregate":
      return { ...state, selectedAggregate: action.payload };
    case "addGroupings":
      return {
        ...state,
        groupings: [...state.groupings, action.payload],
      };
    case "replaceGrouping":
      const newGroupings = state.groupings.filter(
        (grouping) => grouping.drillDown.key === action.payload.oldGroupingKey
      );
      return {
        ...state,
        groupings: [...newGroupings, action.payload.newGrouping],
      };
    case "removeGrouping":
      return {
        ...state,
        groupings: state.groupings.filter(
          (grouping) => grouping.drillDown.key !== action.payload
        ),
      };
    case "setSelectedItem":
      return {
        ...state,
        selectedItem: action.payload,
      };
    case "setApplyFilter":
      return {
        ...state,
        applyFilter: action.payload,
      };
    case "clear":
      return {
        ...state,
        groupings: [],
        appliedMajorOption: [],
        appliedOptions: [],
      };
    case "clearGroupings":
      return {
        ...state,
        groupings: [],
      };
    case "clearAppliedOptions":
      return {
        ...state,
        appliedOptions: [],
      };
    default:
      return new Error("Unknown action");
  }
}

function FilterProvider({ children }) {
  const [
    {
      measureNodes,
      selectedMeasure,
      appliedMajorOption,
      appliedOptions,
      inputValue,
      selectedAggregate,
      groupings,
      dimensionNodes,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <FilteringContext.Provider
      value={{
        measureNodes,
        selectedMeasure,
        appliedMajorOption,
        appliedOptions,
        inputValue,
        selectedAggregate,
        groupings,
        dimensionNodes,
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
