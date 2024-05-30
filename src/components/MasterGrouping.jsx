import styled from "styled-components";

import { Button } from "primereact/button";
import { Fragment, useState } from "react";

import { useFilter } from "../contexts/FilterContext";

import ChildGrouping from "./ChildGrouping";
import { ProgressSpinner } from "primereact/progressspinner";
import { getCutsData } from "../service/data/apiCallers";

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

function MasterGrouping({ updateGroupingFunction }) {
  const { selectedMeasure, dimensionNodes, groupings, dispatch } = useFilter();
  const [addgroupClickCount, setAddgroupClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const maxAddGroup = selectedMeasure?.data.dimensions.length;

  async function handleAddGrouping() {
    const flattenDimensions = dimensionNodes
      ?.map((node) => (node.selectable === true ? node : node.children))
      .flat(1);
    const nextGrouping = flattenDimensions?.filter(
      (node) =>
        !groupings.find(
          (grouping) =>
            grouping.drillDown.key.split("-")[0] === node.key.split("-")[0]
        )
    );
    if (addgroupClickCount < maxAddGroup) {
      setAddgroupClickCount(addgroupClickCount + 1);
    }
    if (nextGrouping) {
      setIsLoading(true);

      updateGroupingFunction(null, nextGrouping[0]);
    }
    setIsLoading(false);
  }

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
                index={i}
                updateGroupingFunction={updateGroupingFunction}
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
   
        <Inplace unstyled="true">
          <InplaceDisplay>
            <Button
              label="Edit"
              severity="info"
              onClick={handleGroupedByFilters}
            />
          </InplaceDisplay>
         
      */
