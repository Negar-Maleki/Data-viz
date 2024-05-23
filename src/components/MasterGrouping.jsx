import styled from "styled-components";

import { Button } from "primereact/button";
import { Fragment, useEffect, useState } from "react";
import { useFilter } from "../contexts/FilterContext";

import ChildGrouping from "./ChildGrouping";
import { ProgressSpinner } from "primereact/progressspinner";

const StyledFilters = styled.div`
  /* display: ${(props) => (props.groupings ? "grid" : "none")};
  background: ${(props) => (props.groupings ? "red" : "transparent")};
  padding: 1em;
  border: ${(props) => (props.groupings ? "0.5px solid #33333318" : "none")};
  border-radius: 5px; */

  label {
    padding: 0.5em 0;
  }
`;

const StyledAddGroupButton = styled(Button)`
  width: 100%;
  display: inline;
  margin-top: 1em;
`;

function MasterGrouping() {
  const { selectedMeasure, dimensionNodes, groupings, dispatch } = useFilter();
  const [selectedMajorOption, setSelectedMajorOption] = useState(null);
  const [addgroupClickCount, setAddgroupClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cutsData, setCutsData] = useState(null);

  const getCutsData = async (grouping) => {
    let drillDown;
    if (!selectedMajorOption) {
      drillDown = grouping.drillDown.data;
    } else {
      drillDown = selectedMajorOption.data;
      console.log(drillDown);
    }
    const cubeName = drillDown?.cubeName;
    const dimensionName = drillDown?.dimensionName;
    const hierarchyName = drillDown?.hierarchyName;
    const levelName = drillDown?.level;

    async function getCutsData() {
      setIsLoading(true);

      const res = await fetch(
        `https://arkansas-api.datausa.io/cubes/${cubeName}/dimensions/${dimensionName}/hierarchies/${hierarchyName}/levels/${levelName}/members?children=false`
      );
      const data = await res.json();
      setCutsData(data);
      setIsLoading(false);
    }
    if (cubeName && dimensionName && hierarchyName && levelName) getCutsData();
  };

  useEffect(() => {
    groupings.forEach((grouping) => {
      getCutsData(grouping);
    });
  }, [groupings]);
  const maxAddGroup = dimensionNodes?.length;

  const handleAddFilter = () => {
    const flattenDimensions = dimensionNodes
      .map((node) => (node.selectable === true ? node : node.children))
      .flat(1);
    console.log(flattenDimensions);
    const nextGrouping = flattenDimensions.filter((node) => {
      return !groupings.some(
        (grouping) =>
          grouping.drillDown.key.split("-")[0] === node.key.split("-")[0]
      );
    });
    console.log(nextGrouping);
    if (addgroupClickCount < maxAddGroup) {
      setAddgroupClickCount(addgroupClickCount + 1);
    }
    dispatch({
      type: "addGroupings",
      payload: { drillDown: nextGrouping[0], cuts: [], active: false },
    });
  };
  const cutsNodes = cutsData?.members.map((member) => ({
    label: member.name,
    key: member.key,
  }));

  return (
    <>
      <label>Grouped by </label>
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <StyledFilters>
          {groupings.map((grouping) => (
            <Fragment key={grouping.drillDown.key}>
              <p>
                {selectedMajorOption
                  ? `${selectedMajorOption.data?.dimensionName} > ${selectedMajorOption.data.level}`
                  : grouping.drillDown.data
                  ? `${grouping.drillDown.data.dimensionName} > ${grouping.drillDown.data.level}`
                  : `${selectedMeasure.data.dimensions[0].dimensionName} >
                  ${grouping.drillDown.label}`}
              </p>
              <ChildGrouping
                grouping={grouping}
                selectedMajorOption={selectedMajorOption}
                onSetSelectedMajorOption={setSelectedMajorOption}
                cutsNodes={cutsNodes}
              />
            </Fragment>
          ))}
        </StyledFilters>
      )}
      <StyledAddGroupButton
        type="button"
        label="Add group"
        outlined
        severity="info"
        icon="pi pi-plus"
        onClick={handleAddFilter}
        disabled={addgroupClickCount >= maxAddGroup - 1}
      />
    </>
  );
}

export default MasterGrouping;

/*
   <label>Grouped by </label>
      <fieldset>
        <p>
          {selectedLabels && filterCount.length === 1
            ? selectedMajorOptionState
              ? `${selectedMajorOptionState.data.dimensionName} > ${selectedMajorOptionState.data.level}`
              : `${selectedLabels.data.dimensions[0].dimensionName} > ${selectedLabels.data.dimensions[0].hierarchies[0].levels[1].name}`
            : "select item"}
        </p>
        <Inplace unstyled="true">
          <InplaceDisplay>
            <Button
              label="Edit"
              severity="info"
              onClick={handleGroupedByFilters}
            />
          </InplaceDisplay>
          <InplaceContent>
            <GroupedByFilter
              dimensionsNodes={dimensionsNodes}
              selectedMajorOptionState={selectedMajorOptionState}
              onSetSelectedMajorOptionState={setSelectedMajorOptionState}
            />
          </InplaceContent>
        </Inplace>
      </fieldset>

      {[...filterCount].map((_, index) => (
        <Inplace unstyled="true" key={index}>
          <InplaceDisplay>
            <StyledAddGroupButton
              type="button"
              label="Add group"
              outlined
              severity="info"
              icon="pi pi-plus"
              onClick={handleAddFilter}
            />
          </InplaceDisplay>
          <InplaceContent>
            <fieldset>
              <GroupedByFilter
                dimensionsNodes={dimensionsNodes}
                selectedMajorOptionState={selectedMajorOptionState}
                onSetSelectedMajorOptionState={setSelectedMajorOptionState}
              />
            </fieldset>
          </InplaceContent>
        </Inplace>
      ))}
      */
