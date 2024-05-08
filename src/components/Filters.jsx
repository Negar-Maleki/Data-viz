import React, { Children, useState } from "react";
import styled from "styled-components";

import { Button } from "primereact/button";
import { TreeSelect } from "primereact/treeselect";
import { ProgressSpinner } from "primereact/progressspinner";

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

function Filters({ nodes, onSelectedLabel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);
  const [filter, setFilter] = useState(null);
  const [groupKeys, setGroupkeys] = useState(null);
  const [applyFilter, setApplyFilter] = useState(false);

  const handleSelectNode = (e) => {
    onSelectedLabel(e.node);

    const cubeName = e.node.data.cubeName;
    const dimensionName = e.node.data.dimensionName;
    const hierarchyName = e.node.data.hierarchyName;
    const levelName = e.node.label;

    async function getGroupsFilters() {
      setIsLoading(true);

      const res = await fetch(
        `https://zircon-api.datausa.io/cubes/${cubeName}/dimensions/${dimensionName}/hierarchies/${hierarchyName}/levels/${levelName}/members?children=false`
      );
      const data = await res.json();
      setFilter(data);

      setIsLoading(false);
    }
    getGroupsFilters();
  };

  const groupedByNodes = filter?.members.map((member, i) => ({
    label: member.name,
    key: member.key,
  }));
  const filtersFullname = filter?.full_name
    .split(".")
    .map((item) => item.replace(/\[|\]/g, ""));

  const handleApplyFilter = () => {
    if (filter ?? !groupedByNodes) setApplyFilter(filtersFullname);
    else if (filter && groupedByNodes) setApplyFilter(groupKeys);
  };

  const handleDeleteFilter = () => {
    setApplyFilter(null);
    setGroupkeys(null);
    setSelectedNodeKeys(null);
    onSelectedLabel(null);
  };

  return (
    <StyledFilters>
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <>
          <TreeSelect
            options={nodes}
            onChange={(e) => setSelectedNodeKeys(e.value)}
            value={selectedNodeKeys}
            metaKeySelection={false}
            placeholder="Select Item"
            onNodeSelect={handleSelectNode}
            filter
          />

          <div className="p-inputgroup">
            <TreeSelect
              options={groupedByNodes}
              onChange={(e) => setGroupkeys(e.value)}
              value={groupKeys}
              metaKeySelection={false}
              display="chip"
              selectionMode="checkbox"
              filter
              multiple
            />
          </div>
          <StyledButton>
            <Button
              label="Delete"
              severity="danger"
              outlined
              onClick={handleDeleteFilter}
            />
            <Button label="Apply" severity="info" onClick={handleApplyFilter} />
          </StyledButton>
        </>
      )}
    </StyledFilters>
  );
}

export default Filters;
