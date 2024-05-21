import React, { useEffect, useState } from "react";
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

function Grouping({ grouping, selectedMajorOption, onSetSelectedMajorOption }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDimensionKey, setSelectedDimensionKey] = useState(
    grouping.drillDown.key
  );
  const [cutsData, setCutsData] = useState(null);
  const [selectedCutsKeys, setSelectedCutsKeys] = useState([]);
  const { selectedMeasure, groupings, dimensionNodes, dispatch } = useFilter();
  const [selectedOptionsState, setSelectedOptionsState] = useState([]);
  const [showEditBtnState, setShowEditBtnState] = useState(false);

  const handleSelectGroupByNode = (e) => {
    selectedOptionsState.push(e.node);
  };
  console.log(grouping);
  console.log(selectedMeasure);
  console.log(grouping.drillDown.label);
  console.log(selectedMeasure.data.dimensions[0].hierarchies[0].levels[1].name);
  useEffect(() => {
    if (
      !selectedMajorOption &&
      grouping.drillDown.label ===
        selectedMeasure.data.dimensions[0].hierarchies[0].levels[1].name
    ) {
      async function getFirstGroup() {
        setIsLoading(true);
        const cubeName = selectedMeasure.name;
        const dimensionName = selectedMeasure.data.dimensions[0].dimensionName;
        const hierarchyName =
          selectedMeasure.data.dimensions[0].hierarchies[0].name;
        const levelName =
          selectedMeasure.data.dimensions[0].hierarchies[0].levels[1].name;
        const res = await fetch(
          `https://zircon-api.datausa.io/cubes/${cubeName}/dimensions/${dimensionName}/hierarchies/${hierarchyName}/levels/${levelName}/members?children=false`
        );
        const data = await res.json();
        setCutsData(data);
        console.log(data);
        setIsLoading(false);
      }
      getFirstGroup();
    }
  }, []);

  const handleSelectDimensionsNode = (e) => {
    onSetSelectedMajorOption(e.node);
    console.log(e.node);
    dispatch({
      type: "replaceGrouping",
      payload: {
        oldKey: grouping.drillDown.key,
        newGrouping: { active: false, drillDown: e.node, cuts: [] },
      },
    });
  };
  console.log(selectedMajorOption);
  // useEffect(() => {
  //   const cubeName = selectedMajorOption.data.cubeName;
  //   const dimensionName = selectedMajorOption.data.dimensionName;
  //   const hierarchyName = selectedMajorOption.data.hierarchyName;
  //   const levelName = selectedMajorOption.label;

  //   async function getGroupsFilters() {
  //     setIsLoading(true);

  //     const res = await fetch(
  //       `https://zircon-api.datausa.io/cubes/${cubeName}/dimensions/${dimensionName}/hierarchies/${hierarchyName}/levels/${levelName}/members?children=false`
  //     );
  //     const data = await res.json();
  //     setCutsData(data);
  //     console.log(cutsData);
  //     setIsLoading(false);
  //   }
  //   getGroupsFilters();
  //   console.log(cutsData);
  // }, [cutsData]);

  const cutsNodes = cutsData?.members.map((member) => ({
    label: member.name,
    key: member.key,
  }));
  // const filtersFullname = cutsData?.full_name
  //   .split(".")
  //   .map((item) => item.replace(/\[|\]/g, ""));

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
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <>
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

export default Grouping;
