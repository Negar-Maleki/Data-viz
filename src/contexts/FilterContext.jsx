import { createContext, useContext, useReducer } from "react";

const FilteringContext = createContext();

const initialState = {
  measureNodes: null,
  selectedLabels: null,
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
    case "setSelectedLabels":
      return { ...state, selectedLabels: action.payload };
    case "setAppliedMajorOption":
      return { ...state, appliedMajorOption: action.payload };
    case "setAppliedOptions":
      return { ...state, appliedOptions: action.payload };
    case "setInputValue":
      return { ...state, inputValue: action.payload };
    case "setSelectedAggregate":
      return { ...state, selectedAggregate: action.payload };
    case "setGroupedBy":
      return {
        ...state,
        groupings: [
          {
            grouping: action.payload,
            cuts: action.payload,
            active: true,
            key: action.payload,
          },
        ],
      };

    default:
      return new Error("Unknown action");
  }
}

function FilterProvider({ children }) {
  const [
    {
      measureNodes,
      selectedLabels,
      appliedMajorOption,
      appliedOptions,
      inputValue,
      selectedAggregate,
      groupings,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <FilteringContext.Provider
      value={{
        measureNodes,
        selectedLabels,
        appliedMajorOption,
        appliedOptions,
        inputValue,
        selectedAggregate,
        groupings,
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
