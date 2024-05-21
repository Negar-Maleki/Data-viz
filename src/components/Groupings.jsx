import styled from "styled-components";

import { Button } from "primereact/button";
import { Fragment, useState } from "react";
import { useFilter } from "../contexts/FilterContext";

import Grouping from "./Grouping";

const StyledFilters = styled.div`
  display: grid;
  min-height: 3.5em;
  /* background-color: #fff;
  padding: 1em;
  border: 0.5px solid #33333318;
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

function Groupings() {
  const { selectedMeasure, dimensionNodes, groupings, dispatch } = useFilter();
  const [selectedMajorOption, setSelectedMajorOption] = useState(null);
  const [addgroupClickCount, setAddgroupClickCount] = useState(0);

  const maxAddGroup = dimensionNodes?.length;

  const handleAddFilter = () => {
    const flattenDimensions = dimensionNodes
      .map((node) => (node.selectable === true ? node : node.children))
      .flat(1);

    const nextGrouping = flattenDimensions.filter((node) => {
      return !groupings.some(
        (grouping) =>
          grouping.drillDown.key.split("-")[0] === node.key.split("-")[0]
      );
    });
    if (addgroupClickCount < maxAddGroup) {
      setAddgroupClickCount(addgroupClickCount + 1);
    }
    dispatch({
      type: "addGroupings",
      payload: { drillDown: nextGrouping[0], cuts: [], active: false },
    });
  };

  return (
    <>
      <label>Grouped by </label>
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
            <Grouping
              grouping={grouping}
              selectedMajorOption={selectedMajorOption}
              onSetSelectedMajorOption={setSelectedMajorOption}
            />
          </Fragment>
        ))}
      </StyledFilters>
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

export default Groupings;

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
