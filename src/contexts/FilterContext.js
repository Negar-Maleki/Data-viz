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
    //setting the measures from the first API call. AN array has been created with the data from the API
    case "setNodes":
      return { ...state, measureNodes: action.payload };
    case "setMeasure": {
      //setting the selected measure from the treeSelect menue(showing)
      return {
        ...state,
        selectedMeasure: action.payload,
        groupings: [],
        filters: [],
      };
    }
    case "setDimensionNodes":
      //Accessing the dimension nodes from the second API call geting cuts data
      return {
        ...state,
        dimensionNodes: action.payload,
      };
    //Updating the data that passes through the groupings array for API call to get the data for the visualization
    case "updateGrouping":
      //getting the old key and the new grouping. If the old key is found in the groupings array, the new grouping will replace the old grouping. If not, the new grouping will be added to the groupings array
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
    //updating the filter array for API call to get the data for the visualization
    case "updateFilter":
      //getting the old filter and the new filter. If the old filter is found in the filters array, the new filter will replace the old filter. If not, the new filter will be added to the filters array.
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
  //sending the initial state to the reducer
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
  // creating a custom hook to use the context
  const context = useContext(FilteringContext);
  if (!context) {
    throw new Error(
      "Filtering context must be used within a FilteringProvider"
    );
  }
  return context;
};

export { FilterProvider, useFilter };
