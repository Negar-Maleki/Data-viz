import { createContext, useContext, useReducer } from "react";

const FilteringContext = createContext();

const initialState = {
  measureNodes: null,
  dimensionNodes: null,
  selectedMeasure: null,
  groupings: [],
  filters: [],
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

    case "updateFilter":
      const oldFilter = action.payload.oldFilter;
      const newFilter = action.payload.newFilter;

      let newFilters = [];

      if (
        oldFilter !== null &&
        state.filters.find((filter) => filter.key === oldFilter.key)
      ) {
        newFilters = state.filters.map((filter) =>
          filter.key !== oldFilter.key ? filter : newFilter
        );
      } else {
        newFilters = [...state.filters, newFilter];
      }

      return {
        ...state,
        filters: newFilters,
      };
    case "removeFilter":
      return {
        ...state,
        filters: state.filters.filter(
          (filter) => filter.key !== action.payload
        ),
      };
    default:
      return new Error("Unknown action");
  }
}

function FilterProvider({ children }) {
  const [
    { measureNodes, selectedMeasure, groupings, dimensionNodes, filters },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <FilteringContext.Provider
      value={{
        measureNodes,
        selectedMeasure,
        groupings,
        dimensionNodes,
        filters,

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
