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
      return { ...state, measureNodes: action.payload };
    case "setMeasure": {
      return {
        ...state,
        selectedMeasure: action.payload,
        groupings: [],
      };
    }
    case "setDimensionNodes":
      return {
        ...state,
        dimensionNodes: action.payload,
      };

    case "updateGrouping":
      const oldKey = action.payload.oldKey;
      const newGrouping = action.payload.newGrouping;
      let newGroupings = [];
      if (
        state.groupings.find((grouping) => grouping.drillDown.key === oldKey)
      ) {
        newGroupings = state.groupings.map((grouping) =>
          grouping.drillDown.key !== oldKey ? grouping : newGrouping
        );
      } else {
        newGroupings = [...state.groupings, newGrouping];
      }

      return {
        ...state,
        groupings: newGroupings,
      };
    case "removeGrouping":
      return {
        ...state,
        groupings: state.groupings.filter(
          (grouping) => grouping.drillDown.key !== action.payload
        ),
      };
    case "selctedCuts":
      return {
        ...state,
        groupings: state.groupings.map((grouping) => {
          if (grouping.drillDown.key === action.payload.key) {
            return {
              ...grouping,
              selectedCuts: action.payload.selectedCuts,
            };
          }
          return grouping;
        }),
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
