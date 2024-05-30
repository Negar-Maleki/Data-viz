import styled from "styled-components";

import { Button } from "primereact/button";
import { Fragment, useCallback, useEffect, useState } from "react";

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

  const getCutsData = useCallback(async (grouping) => {
    const cubeName = grouping.data.cubeName;
    const dimensionName = grouping.data.dimensionName;
    const hierarchyName = grouping.data.hierarchyName;
    const levelName = grouping.data.level;

    async function getCutsDataApi() {
      setIsLoading(true);

      try {
        const res = await fetch(
          `https://arkansas-api.datausa.io/cubes/${cubeName}/dimensions/${dimensionName}/hierarchies/${hierarchyName}/levels/${levelName}/members?children=false`
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
    if (cubeName && dimensionName && hierarchyName && levelName) {
      return await getCutsDataApi();
    }
    return null;
  });

  const maxAddGroup = selectedMeasure?.data.dimensions.length;

  const handleAddGrouping = useCallback(async () => {
    const flattenDimensions = dimensionNodes
      .map((node) => (node.selectable === true ? node : node.children))
      .flat(1);
    const nextGrouping = flattenDimensions.filter(
      (node) =>
        !groupings.find(
          (grouping) =>
            grouping.drillDown.key.split("-")[0] === node.key.split("-")[0]
        )
    );
    if (addgroupClickCount < maxAddGroup) {
      setAddgroupClickCount(addgroupClickCount + 1);
    }
    const groupCuts = await getCutsData(nextGrouping[0]);

    dispatch({
      type: "addGroupings",
      payload: {
        drillDown: nextGrouping[0],
        selectedCuts: [],
        active: false,
        cutsOptions: groupCuts.members.map((member) => ({
          label: member.name,
          key: member.key,
        })),
      },
    });
  });

  return (
    <>
      <label>Grouped by </label>
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <StyledFilters>
          {groupings.map((grouping, i) => (
            <Fragment key={grouping.drillDown.key}>
              <p>
                {groupings.length > 0
                  ? `${grouping.drillDown.data.dimensionName} > ${grouping.drillDown.data.level}`
                  : "select item"}
              </p>

              <ChildGrouping
                grouping={grouping}
                selectedMajorOption={selectedMajorOption}
                onSetSelectedMajorOption={setSelectedMajorOption}
                getCutsData={getCutsData}
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
        onClick={handleAddGrouping}
        disabled={addgroupClickCount >= maxAddGroup - 1 || !selectedMeasure}
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
