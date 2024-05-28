import React, { useState } from "react";
import styled from "styled-components";

import { useFilter } from "../contexts/FilterContext";
import { Button } from "primereact/button";
import { TreeSelect } from "primereact/treeselect";
import { Tag } from "primereact/tag";

const StyledFilters = styled.div`
  display: grid;
  gap: 1em;

  label {
    padding-bottom: 1em;
  }
`;
const StyledButton = styled.div`
  display: grid;
  gap: 0.2em;
  grid-auto-flow: column;
`;

const StyledSelectedOption = styled.div`
  background-color: #ccc;
  border-radius: 5px;
  padding: 5px;
  width: max-content;
`;

function ChildGrouping({
  grouping,
  selectedMajorOption,
  onSetSelectedMajorOption,
}) {
  const [selectedDimensionKey, setSelectedDimensionKey] = useState(
    grouping.drillDown.key
  );

  const [selectedCutsKeys, setSelectedCutsKeys] = useState([]);
  const { groupings, dimensionNodes, dispatch } = useFilter();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(false);

  const handleSelectGroupByNode = (e) => {
    selectedOptions.push(e.node);
  };

  const handleSelectDimensionsNode = (e) => {
    onSetSelectedMajorOption(e.node);

    dispatch({
      type: "replaceGrouping",
      payload: {
        oldKey: grouping.drillDown.key,
        newGrouping: {
          drillDown: e.node,
          selectedCuts: [],
          active: false,
          cutsOptions: [],
        },
      },
    });
  };

  const handleApplyFilter = () => {
    if (selectedMajorOption && selectedOptions.length === 0) {
      dispatch({
        type: "setAppliedMajorOption",
        payload: selectedMajorOption,
      });

      setIsEditButtonVisible(true);
    } else if (selectedOptions && selectedOptions.length > 0) {
      dispatch({
        type: "setAppliedOptions",
        payload: selectedOptions,
      });
      dispatch({
        type: "setAppliedMajorOption",
        payload: selectedMajorOption,
      });
      setIsEditButtonVisible(true);
    }
  };
  const handleEditFilter = () => {
    setIsEditButtonVisible(false);
    setSelectedOptions([]);
  };

  const handleDeleteFilter = () => {
    dispatch({
      type: "removeGrouping",
      payload: grouping.drillDown.key,
    });
  };

  const handleDimensionChange = (e) => {
    setSelectedDimensionKey(e.value);
  };

  // console.log("grouping", grouping);
  // console.log("dimensionNodes", dimensionNodes);
  // console.log("newDimensionNodes", newDimensionNodes);
  return (
    <StyledFilters>
      {!isEditButtonVisible ? (
        <>
          <TreeSelect
            options={dimensionNodes}
            onChange={handleDimensionChange}
            value={selectedDimensionKey}
            metaKeySelection={false}
            placeholder="Select Item"
            onNodeSelect={handleSelectDimensionsNode}
            filter
          />
          <div className="p-inputgroup">
            <TreeSelect
              options={grouping.cutsOptions}
              onChange={(e) => setSelectedCutsKeys(e.value)}
              value={selectedCutsKeys}
              metaKeySelection={false}
              display="chip"
              selectionMode="checkbox"
              filter
              multiple
              onNodeSelect={handleSelectGroupByNode}
            />
          </div>
        </>
      ) : selectedOptions ? (
        selectedOptions.map((item, i) => (
          <StyledSelectedOption key={i}>
            <Tag unstyled value={item.label} />
          </StyledSelectedOption>
        ))
      ) : null}
      <StyledButton>
        {isEditButtonVisible ? (
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
    </StyledFilters>
  );
}

export default ChildGrouping;
