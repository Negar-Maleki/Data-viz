import styled from "styled-components";

import { Button } from "primereact/button";
import { Fragment, useState } from "react";

import { useFilter } from "../contexts/FilterContext";

import ChildGrouping from "./ChildGrouping";
import { ProgressSpinner } from "primereact/progressspinner";

const StyledFilters = styled.div`
  label {
    padding: 0.5em 0;
  }
`;

const StyledAddGroupButton = styled(Button)`
  width: 100%;
  display: inline;
  margin-top: 1em;
`;
//MasterGrouping component is responsible for displaying the selected dimensions in the sidebar. It also has the functionality to add a new group to the groupings array. The user can add a new group by clicking on the add group button.
function MasterGrouping({ updateGroupingFunction }) {
  //use costum hooks to get the redux state and dispatch
  const { selectedMeasure, dimensionNodes, groupings } = useFilter();
  //count the number of times the user clicked on the add group button
  const [addgroupClickCount, setAddgroupClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  //get the number of dimensions that the user can group by
  const maxAddGroup = dimensionNodes?.length > 2 ? 2 : dimensionNodes?.length;

  async function handleAddGrouping() {
    //flatten the dimensions array to get the next grouping based on selectability of the nodes.
    const flattenDimensions = dimensionNodes
      ?.map((node) => (node.selectable === true ? node : node.children))
      .flat(1);

    //Filter the dimensions that are already in the groupings array that selected by user and display the next grouping when the user click on the add new grouping button and will not displayed the same dimension again.
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
                {
                  //display the selected dimension and level in the sidebar
                  groupings.length > 0
                    ? `${grouping.drillDown.data.dimensionName} > ${grouping.drillDown.data.level}`
                    : "select item"
                }
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
        severity="primary"
        icon="pi pi-plus"
        onClick={handleAddGrouping}
        //The user can add a new group until the number of groups is equal to the number of dimensions that the user can group by.
        disabled={groupings.length >= maxAddGroup || !selectedMeasure}
      />
    </>
  );
}

export default MasterGrouping;
