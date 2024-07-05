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

//ChildGrouping component is a child component of the MasterGrouping component. It is responsible for displaying the selected cuts and the selected dimensions in the sidebar. It also has the functionality to apply, edit, and delete the selected cuts and dimensions. the index is used to get the grouping from groupings array.
function ChildGrouping({ index, updateGroupingFunction }) {
  const { groupings, dimensionNodes, dispatch } = useFilter();

  const grouping = groupings[index];

  //set the selected dimension key value to the grouping drill down key
  const [selectedDimensionKey, setSelectedDimensionKey] = useState(
    grouping.drillDown.key
  );

  //set the selected cuts keys to the selected cuts in the grouping
  const [selectedCutsKeys, setSelectedCutsKeys] = useState(
    grouping.selectedCuts
  );

  //filter the dimensions that are already in the groupings array and display the unselected dimensions in the dropdown menu.
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

  //handle the selected cuts and update the grouping with the new selected cuts
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

  //update the grouping with the new selected dimension which nees old key and the new grouping
  const handleSelectDimensionsNode = async (e) => {
    updateGroupingFunction(grouping.drillDown.key, e.node);
  };

  //Displaying the selected cuts in the sidebar after the user selects the cuts and clicks on the apply button
  const selectedCutsLabels = grouping.cutsOptions
    .filter((cut) => Object.keys(selectedCutsKeys).includes(`${cut.key}`))
    .map((cut) => cut.label);

  //active is set to true to show the selected cuts in the sidebar and trigger the API call to get the data for the visualization
  const handleApplyFilter = () => {
    dispatch({
      type: "updateGrouping",
      payload: {
        oldKey: grouping.drillDown.key,
        newGrouping: { ...grouping, active: true },
      },
    });
  };

  //edit the selected cuts and dimensions in the sidebar and update the grouping
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
    //set the key of the selected dimension
    setSelectedDimensionKey(e.value);
  };

  // return the selected cuts and dimensions in the sidebar with the apply and delete buttons.
  return (
    <StyledFilters>
      {/* the selected cuts will be displayed on grouped by menu in the sidebar when the user clicks on the apply button.  */}
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
              options={grouping.cutsOptions.filter(
                (cuts) => cuts.label !== "#null"
              )}
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
          {/* The selected cuts will be displayed on grouped by menu in the sidebar when the user clicks on the apply button. */}
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
          <Button label="Edit" severity="primary" onClick={handleEditFilter} />
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
          disabled={groupings.length === 1}
        />
      </StyledButton>
    </StyledFilters>
  );
}

export default ChildGrouping;
