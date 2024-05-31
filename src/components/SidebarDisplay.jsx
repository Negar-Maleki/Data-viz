import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import MasterGrouping from "./MasterGrouping";
import FilterBy from "./FilterBy";

import { TreeSelect } from "primereact/treeselect";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";

import { useFilter } from "../contexts/FilterContext";
import { DataContext } from "../service/provider/DataProvider";
import { getCutsData } from "../service/data/client";
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
  const { selectedMeasure, measureNodes, dispatch } = useFilter();
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);

  const data = useContext(DataContext);

  useEffect(() => {
    const nodesArray = buildNodesArray(data);
    dispatch({ type: "setNodes", payload: nodesArray });
  }, [data]);

  async function updateGroupingFunction(oldKey, grouping) {
    const groupCuts = await getCutsData(grouping);
    dispatch({
      type: "updateGrouping",
      payload: {
        oldKey: oldKey,
        newGrouping: {
          drillDown: grouping,
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

  const setSelectedMeasure = async (e) => {
    const dimensionsNodes = buildMeasreNodes(e);
    dispatch({ type: "setMeasure", payload: e.node });
    dispatch({ type: "setDimensionNodes", payload: dimensionsNodes });

    const firstGrouping =
      dimensionsNodes[0]?.children !== undefined
        ? dimensionsNodes[0].children[0]
        : dimensionsNodes[0];
    updateGroupingFunction(null, firstGrouping);
  };

  const labels = selectedMeasure?.data ? selectedMeasure.data.dimensions : null;

  if (!measureNodes || measureNodes.length === 0)
    return (
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    );

  return (
    <>
      <StyledFilters>
        <label htmlFor="treeSelect">Showing </label>

        <TreeSelect
          value={selectedNodeKey}
          onChange={(e) => setSelectedNodeKey(e.value)}
          options={measureNodes}
          filter
          placeholder="Select Item"
          showClear
          inputId="treeSelect"
          onNodeSelect={setSelectedMeasure}
        />

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
