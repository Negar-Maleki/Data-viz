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
  cutsNodes,
}) {
  const [selectedDimensionKey, setSelectedDimensionKey] = useState(
    grouping.drillDown.key
  );

  const [selectedCutsKeys, setSelectedCutsKeys] = useState([]);
  const { selectedMeasure, groupings, dimensionNodes, dispatch } = useFilter();
  const [selectedOptionsState, setSelectedOptionsState] = useState([]);
  const [showEditBtnState, setShowEditBtnState] = useState(false);

  const handleSelectGroupByNode = (e) => {
    selectedOptionsState.push(e.node);
  };

  const groupingLabels = groupings.map((grouping) => grouping.drillDown.label);

  const handleSelectDimensionsNode = (e) => {
    onSetSelectedMajorOption(e.node);

    dispatch({
      type: "replaceGrouping",
      payload: {
        oldKey: grouping.drillDown.key,
        newGrouping: { active: false, drillDown: e.node, cuts: [] },
      },
    });
  };

  const handleApplyFilter = () => {
    if (selectedMajorOption && selectedOptionsState.length === 0) {
      dispatch({
        type: "setAppliedMajorOption",
        payload: selectedMajorOption,
      });

      setShowEditBtnState(true);
    } else if (selectedOptionsState && selectedOptionsState.length > 0) {
      dispatch({
        type: "setAppliedOptions",
        payload: selectedOptionsState,
      });
      dispatch({
        type: "setAppliedMajorOption",
        payload: selectedMajorOption,
      });
      setShowEditBtnState(true);
    }
  };
  const handleEditFilter = () => {
    setShowEditBtnState(false);
    setSelectedOptionsState([]);
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

  return (
    <StyledFilters>
      {!showEditBtnState ? (
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
              options={cutsNodes}
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
      ) : selectedOptionsState ? (
        selectedOptionsState.map((item, i) => (
          <StyledSelectedOption key={i}>
            <Tag unstyled value={item.label} />
          </StyledSelectedOption>
        ))
      ) : null}
      <StyledButton>
        {showEditBtnState ? (
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
