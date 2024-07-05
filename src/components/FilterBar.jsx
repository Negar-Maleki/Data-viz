import styled from "styled-components";
import { LuChevronsUpDown } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";
import { Fragment } from "react";

import { useFilter } from "../contexts/FilterContext";

import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const StyledFilter = styled.div`
  display: grid;
  gap: 1em;
`;

const StyledNumFilter = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(auto-fit, minmax(5em, 1fr));
  width: 100%;
  span {
    input {
      width: 100%;
    }
  }
`;
const StyledSelectedOption = styled.span`
  background-color: #ccc;
  border-radius: 5px;
  padding: 5px;
  margin: 0.1em;
`;
const StyledButton = styled.div`
  display: grid;
  gap: 0.2em;
  grid-auto-flow: column;
`;
function FilterBar({ filter, aggregates }) {
  // Get the dispatch function from the FilterContext
  const { dispatch } = useFilter();

  // The operationOptions array contains the filter options that the user can select from the dropdown
  const operationOptions = [
    { label: "Equal to", value: "=" },
    { label: "Greater than", value: ">" },
    { label: "Less than", value: "<" },
    { label: "Greater than or equal to", value: ">=" },
    { label: "Less than or equal to", value: "<=" },
  ];

  // The handleAggregate function is called when the user selects an aggregate from the dropdown. It dispatches an action to update the filter state with the new aggregate value.
  const handleAggregate = (e) => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, name: e.value, key: uuidv4() },
      },
    });
  };

  // The handleOperation function is called when the user selects a filter operation from the dropdown. It dispatches an action to update the filter state with the new operation value.
  const handleOperation = (e) => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, operation: e.value },
      },
    });
  };

  // The handleInputValue function is called when the user enters a value in the input field. It dispatches an action to update the filter state with the new input value.
  const handleInputValue = (e) => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, inputValue: e.value },
      },
    });
  };

  // The handleApplyFilter function is called when the user clicks the Apply button. It dispatches an action to update the filter state with the active status set to true and api call happens to display charts and tables based on the selected filters.
  const handleApplyFilter = () => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, active: true },
      },
    });
  };

  // The handleEditFilter function is called when the user clicks the Edit button. It dispatches an action to update the filter state with the active status set to false.
  const handleEditFilter = () => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, active: false },
      },
    });
  };

  // The handleDeleteFilter function is called when the user clicks the Delete button. It dispatches an action to remove the filter from the filter state.
  const handleDeleteFilter = () => {
    dispatch({
      type: "removeFilter",
      payload: filter.key,
    });
  };

  return (
    <StyledFilter>
      <Fragment>
        {/* chacking if the filter is not active dispaly the option menus */}
        {!filter.active ? (
          <>
            <Dropdown
              value={filter.name}
              onChange={handleAggregate}
              options={aggregates}
              optionLabel="name"
              placeholder="Select..."
              className="w-full md:w-14rem"
            />
            <StyledNumFilter>
              <Dropdown
                value={filter.operation}
                onChange={handleOperation}
                options={operationOptions}
                placeholder={operationOptions[0].label}
                dropdownIcon={<LuChevronsUpDown />}
              />

              <InputNumber
                decrementButtonClassName="p-button-primary"
                incrementButtonClassName="p-button-primary"
                showButtons
                value={filter.inputValue}
                onValueChange={handleInputValue}
              />
            </StyledNumFilter>
          </>
        ) : (
          <StyledSelectedOption>
            {/* Tag displays what user selected in filter by*/}
            <Tag
              unstyled
              value={`${filter.name.name} ${filter.operation} ${filter.inputValue}`}
            />
          </StyledSelectedOption>
        )}
        <StyledButton>
          {/* Check if the filter active display edit and delete buttons */}
          {filter.active ? (
            <Button
              label="Edit"
              severity="primary"
              onClick={handleEditFilter}
            />
          ) : (
            <Button
              label="Apply"
              severity="primary"
              onClick={handleApplyFilter}
            />
          )}
          <Button
            label="Delete"
            severity="danger"
            outlined
            onClick={handleDeleteFilter}
          />
        </StyledButton>
      </Fragment>
    </StyledFilter>
  );
}

export default FilterBar;
