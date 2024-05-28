import { createContext, useContext, useReducer } from "react";

const FilteringContext = createContext();

const initialState = {
  measureNodes: null,
  dimensionNodes: null,
  selectedMeasure: null,
  groupings: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "setNodes":
      console.log("setNodes", action.payload);
      return { ...state, measureNodes: action.payload };
    case "setMeasure": {
      console.log("setMeasure", action.payload);
      return {
        ...state,
        selectedMeasure: action.payload,
        groupings: [],
      };
    }
    case "setDimensionNodes":
      console.log("setDimensionNodes", action.payload);
      return {
        ...state,
        dimensionNodes: action.payload,
      };
    case "addGroupings":
      console.log("addGroupings", action.payload);
      return {
        ...state,
        groupings: [...state.groupings, action.payload],
      };
    case "replaceGrouping":
      console.log("replaceGrouping", action.payload);
      const oldKey = action.payload.oldKey;
      const newGrouping = action.payload.newGrouping;

      const newGroupings = state.groupings.filter(
        (grouping) => grouping.drillDown.key !== oldKey
      );

      newGroupings.push(newGrouping);
      return {
        ...state,
        groupings: newGroupings,
      };
    case "removeGrouping":
      console.log("removeGrouping", action.payload);
      return {
        ...state,
        groupings: state.groupings.filter(
          (grouping) => grouping.drillDown.key !== action.payload
        ),
      };

    default:
      return new Error("Unknown action");
  }
}

function FilterProvider({ children }) {
  const [
    { measureNodes, selectedMeasure, groupings, dimensionNodes },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <FilteringContext.Provider
      value={{
        measureNodes,
        selectedMeasure,
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
