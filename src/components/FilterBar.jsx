import styled from "styled-components";
import { LuChevronsUpDown } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";
import { Fragment, useState } from "react";

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
  const { dispatch } = useFilter();

  const filterByOptions = [
    { label: "Equal to", value: "=" },
    { label: "Greater than", value: ">" },
    { label: "Less than", value: "<" },
    { label: "Greater than or equal to", value: ">=" },
    { label: "Less than or equal to", value: "<=" },
  ];

  const handleAggregate = (e) => {
    console.log(e.value);
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, name: e.value, key: uuidv4() },
      },
    });
  };

  const handleOperation = (e) => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, operation: e.value },
      },
    });
  };

  const handleInputValue = (e) => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, inputValue: e.value },
      },
    });
  };

  const handleApplyFilter = () => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, active: true },
      },
    });
  };

  const handleEditFilter = () => {
    dispatch({
      type: "updateFilter",
      payload: {
        oldFilter: filter,
        newFilter: { ...filter, active: false },
      },
    });
  };

  const handleDeleteFilter = () => {
    dispatch({
      type: "removeFilter",
      payload: filter.key,
    });
  };

  return (
    <StyledFilter>
      <Fragment>
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
                options={filterByOptions}
                placeholder={filterByOptions[0].label}
                dropdownIcon={<LuChevronsUpDown />}
              />

              <InputNumber
                decrementButtonClassName="p-button-info"
                incrementButtonClassName="p-button-info"
                showButtons
                value={filter.inputValue}
                onValueChange={handleInputValue}
              />
            </StyledNumFilter>
          </>
        ) : (
          <StyledSelectedOption>
            <Tag
              unstyled
              value={`${filter.name.name} ${filter.operation} ${filter.inputValue}`}
            />
          </StyledSelectedOption>
        )}
        <StyledButton>
          {filter.active ? (
            <Button label="Edit" severity="info" onClick={handleEditFilter} />
          ) : (
            <Button label="Apply" severity="info" onClick={handleApplyFilter} />
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
