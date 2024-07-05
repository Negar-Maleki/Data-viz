import React, { useEffect, useState } from "react";
import styled from "styled-components";

import MasterGrouping from "./MasterGrouping";
import FilterBy from "./FilterBy";

import { TreeSelect } from "primereact/treeselect";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";

import { useFilter } from "../contexts/FilterContext";
import { getCutsData } from "../service/client";
import { getCubes } from "../service/client";
import { buildMeasreNodes, buildNodesArray } from "../helper/nodeProducer";

const StyledFilters = styled.div`
  padding-bottom: 0.5em;
  display: grid;
  min-height: 3.5em;

  label {
    padding: 0.5em 0;
  }
  span {
    margin: 0.1em;
  }
`;

function SidebarDisplay() {
  //use costum hooks to get the redux state and dispatch
  const { selectedMeasure, measureNodes, dispatch } = useFilter();
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const [data, setData] = useState([]);

  // const data = useContext(DataContext);

  useEffect(() => {
    const getData = async () => {
      try {
        const cubesData = await getCubes();
        setData(cubesData);

        //if data is available, build the nodes array and set it to the state to display in the tree select
        if (cubesData) {
          const nodesArray = buildNodesArray(cubesData);

          dispatch({ type: "setNodes", payload: nodesArray });
        }
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  //function to update the grouping after the user selects a new grouping from the dropdown
  async function updateGroupingFunction(oldKey, grouping) {
    const groupCuts = await getCutsData(grouping);

    //update the grouping with the new grouping. If the old key is available, the new grouping will replace the old grouping. If not, the new grouping will be added to the groupings array(this happens in the reducer function in the context file).
    //active is set to false by default. This is to show if the user clicked on the apply button and triggerd the API call to get the data for the visualization
    //cutsOptions are the options that the user can select from the dropdown in the grouped by component after the user selects a measure and a grouping. These cuts are available from the API call
    //caption is the name of the groups hierarchy that the user selected which will be use in the visualization
    dispatch({
      type: "updateGrouping",
      payload: {
        oldKey: oldKey,
        newGrouping: {
          drillDown: grouping,
          caption: groupCuts.caption,
          selectedCuts: [],
          active: false,
          cutsOptions: groupCuts.members.map((member) => ({
            label: member.name,
            key: member.key,
          })),
        },
      },
    });
  }

  //function to set the selected measure after user selects a measure from the tree select
  const updateSelectedMeasure = async (e) => {
    const dimensionsNodes = buildMeasreNodes(e);

    dispatch({ type: "setMeasure", payload: e.node });
    dispatch({ type: "setDimensionNodes", payload: dimensionsNodes });

    //update the grouping to the first grouping of the selected measure. This is to show the first grouping by default when a measure is selected
    const firstGrouping =
      dimensionsNodes[0]?.children !== undefined
        ? dimensionsNodes[0].children[0]
        : dimensionsNodes[0];
    updateGroupingFunction(null, firstGrouping);
  };

  //get the labels of the selected measure to display in the tags
  const labels = selectedMeasure?.data ? selectedMeasure.data.dimensions : null;

  //show a spinner if the measure nodes are not available or loading
  if (!measureNodes || measureNodes.length === 0)
    return (
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    );

  //return the sidebar display component. The MasterGrouping component is used to display the groupings in the sidebar.
  return (
    <>
      <StyledFilters>
        <label htmlFor="treeSelect">Showing </label>
        {/* The TreeSelect component is used to display the measures in a tree structure. */}
        <TreeSelect
          value={selectedNodeKey}
          onChange={(e) => setSelectedNodeKey(e.value)}
          options={measureNodes}
          filter
          placeholder="Select Item"
          showClear
          inputId="treeSelect"
          onNodeSelect={updateSelectedMeasure}
        />

        {/* labels are the dimensions of the selected measure that are displayed in the tags */}
        <span>
          {labels ? (
            labels.length <= 5 ? (
              labels.map((label, i) => (
                <Tag key={i} severity="warning" value={label.dimensionName} />
              ))
            ) : (
              <>
                {labels.slice(0, 5).map((label, i) => (
                  <Tag key={i} severity="warning" value={label.dimensionName} />
                ))}
                <Tag severity="warning" value={`+${labels.length - 6}`} />
              </>
            )
          ) : null}
        </span>
      </StyledFilters>
      <MasterGrouping updateGroupingFunction={updateGroupingFunction} />
      <FilterBy />
    </>
  );
}

export default SidebarDisplay;
