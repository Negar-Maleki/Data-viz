import React, { Children, useState } from "react";
import styled from "styled-components";

import { useFilter } from "../contexts/FilterContext";
import { Button } from "primereact/button";
import { TreeSelect } from "primereact/treeselect";
import { ProgressSpinner } from "primereact/progressspinner";
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

function GroupedByFilter({ onSelectedLabel, dimensionsNodes }) {
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [selectedNodeKeysState, setSelectedNodeKeysState] = useState(null);
  const [selectedMajorOptionState, setSelectedMajorOptionState] =
    useState(null);

  const [selectedOptionsState, setSelectedOptionsState] = useState([]);
  const [filterDataState, setFilterDataState] = useState(null);
  const [selectedGroupByKeysState, setSelectedGroupByKeysState] = useState([]);
  const [showEditBtnState, setShowEditBtnState] = useState(false);
  const { appliedOptions, dispatch } = useFilter();

  const handleSelectGroupByNode = (e) => {
    dispatch({ type: "setSelectedGroupByLabels", payload: e.node });

    selectedOptionsState.push(e.node);
  };

  const handleSelectDimensionsNode = (e) => {
    onSelectedLabel(e.node);
    setSelectedMajorOptionState(e.node);

    const cubeName = e.node.data.cubeName;
    const dimensionName = e.node.data.dimensionName;
    const hierarchyName = e.node.data.hierarchyName;
    const levelName = e.node.label;

    async function getGroupsFilters() {
      setIsLoadingState(true);

      const res = await fetch(
        `https://zircon-api.datausa.io/cubes/${cubeName}/dimensions/${dimensionName}/hierarchies/${hierarchyName}/levels/${levelName}/members?children=false`
      );
      const data = await res.json();
      setFilterDataState(data);

      setIsLoadingState(false);
    }
    getGroupsFilters();
  };

  const dimLevMemberNodes = filterDataState?.members.map((member, i) => ({
    label: member.name,
    key: member.key,
  }));
  const filtersFullname = filterDataState?.full_name
    .split(".")
    .map((item) => item.replace(/\[|\]/g, ""));

  const handleApplyFilter = () => {
    if (selectedMajorOptionState && selectedOptionsState.length === 0) {
      dispatch({
        type: "setAppliedMajorOption",
        payload: selectedMajorOptionState,
      });

      setShowEditBtnState(true);
    } else if (selectedOptionsState && selectedOptionsState.length > 0) {
      dispatch({
        type: "setAppliedOptions",
        payload: selectedOptionsState,
      });
      dispatch({
        type: "setAppliedMajorOption",
        payload: selectedMajorOptionState,
      });
      setShowEditBtnState(true);
    }
  };
  const handleEditFilter = () => {
    setShowEditBtnState(false);
  };

  // console.log(
  //   dimLevMemberNodes?.filter(
  //     (node) => Object.keys(selectedGroupByKeysState).indexOf(node.key) !== -1
  //   )
  // );

  const handleDeleteFilter = () => {
    setSelectedMajorOptionState(null);
    setShowEditBtnState(false);
    setSelectedOptionsState([]);
    setSelectedGroupByKeysState(null);
    setSelectedNodeKeysState(null);
    onSelectedLabel(null);
  };

  return (
    <StyledFilters>
      {isLoadingState ? (
        <ProgressSpinner />
      ) : (
        <>
          {!showEditBtnState ? (
            <>
              <TreeSelect
                options={dimensionsNodes}
                onChange={(e) => setSelectedNodeKeysState(e.value)}
                value={selectedNodeKeysState}
                metaKeySelection={false}
                placeholder="Select Item"
                onNodeSelect={handleSelectDimensionsNode}
                filter
              />
              <div className="p-inputgroup">
                <TreeSelect
                  options={dimLevMemberNodes}
                  onChange={(e) => setSelectedGroupByKeysState(e.value)}
                  value={selectedGroupByKeysState}
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
              <Button
                label="Apply"
                severity="info"
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
        </>
      )}
    </StyledFilters>
  );
}

export default GroupedByFilter;
