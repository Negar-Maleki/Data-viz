import React, { useState } from "react";
import styled from "styled-components";

import { useFilter } from "../contexts/FilterContext";
import { Button } from "primereact/button";
import { TreeSelect } from "primereact/treeselect";
import { Tag } from "primereact/tag";

const StyledFilters = styled.div`
  display: grid;
  gap: 1em;
`;
const StyledButton = styled.div`
  display: grid;
  gap: 0.2em;
  grid-auto-flow: column;
`;

const StyledSelectedOption = styled.span`
  background-color: #ccc;
  border-radius: 5px;
  padding: 5px;
  margin: 0.1em;
`;

function ChildGrouping({ index, updateGroupingFunction }) {
  const { groupings, filters, dimensionNodes, dispatch } = useFilter();

  const grouping = groupings[index];

  const [selectedDimensionKey, setSelectedDimensionKey] = useState(
    grouping.drillDown.key
  );
  const [selectedCutsKeys, setSelectedCutsKeys] = useState(
    grouping.selectedCuts
  );

  const unselectedDimensions = dimensionNodes.filter(
    (node) =>
      !groupings
        .filter(
          (group) =>
            group.drillDown.key.split("-")[0] !==
            grouping.drillDown.key.split("-")[0]
        )
        .some((g) => g.drillDown.key.split("-")[0] === node.key.split("-")[0])
  );

  const handleSelectGroupByNode = (e) => {
    setSelectedCutsKeys(e.value);
    dispatch({
      type: "updateGrouping",
      payload: {
        oldKey: grouping.drillDown.key,
        newGrouping: {
          ...grouping,
          selectedCuts: e.value,
        },
      },
    });
  };

  const handleSelectDimensionsNode = async (e) => {
    updateGroupingFunction(grouping.drillDown.key, e.node);
  };

  const selectedCutsLabels = grouping.cutsOptions
    .filter((cut) => Object.keys(selectedCutsKeys).includes(`${cut.key}`))
    .map((cut) => cut.label);

  const handleApplyFilter = () => {
    dispatch({
      type: "updateGrouping",
      payload: {
        oldKey: grouping.drillDown.key,
        newGrouping: { ...grouping, active: true },
      },
    });
  };

  const handleEditFilter = () => {
    dispatch({
      type: "updateGrouping",
      payload: {
        oldKey: grouping.drillDown.key,
        newGrouping: { ...grouping, active: false },
      },
    });
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
      {!grouping.active ? (
        <>
          <TreeSelect
            options={unselectedDimensions}
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
              onChange={handleSelectGroupByNode}
              value={selectedCutsKeys}
              metaKeySelection={false}
              display="chip"
              selectionMode="checkbox"
              filter
              multiple
            />
          </div>
        </>
      ) : (
        <span>
          {selectedCutsLabels
            ? selectedCutsLabels.map((item, i) => (
                <StyledSelectedOption key={i}>
                  <Tag unstyled value={item} />
                </StyledSelectedOption>
              ))
            : null}
        </span>
      )}
      <StyledButton>
        {grouping.active ? (
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
