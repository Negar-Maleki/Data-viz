import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { NodeService } from "../service/NodeService";
import { TreeSelect } from "primereact/treeselect";
import { Tag } from "primereact/tag";

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

function FilterShowing() {
  const [nodes, setNodes] = useState(null);
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const [selectedNodeLabel, setSelectedNodeLabel] = useState(null);

  useEffect(() => {
    NodeService.getTreeNodes().then((data) => {
      setNodes(data);
    });
  }, []);

  function findLabelsByKey(nodes, key, labels = []) {
    if (!nodes || !Array.isArray(nodes)) {
      return undefined;
    }
    for (let node of nodes) {
      if (node.key === key) {
        labels.push(...node.data);
      }
      if (node.children) {
        findLabelsByKey(node.children, key, labels);
      }
    }

    return labels;
  }

  const labels = findLabelsByKey(nodes, selectedNodeKey);

  const handleNodeSelect = (e) => {
    const selectedKey = e.value;
    setSelectedNodeKey(selectedKey);
    setSelectedNodeLabel(labels);
  };

  return (
    <>
      <StyledFilters>
        <label htmlFor="treeSelect">Showing </label>

        <TreeSelect
          value={selectedNodeKey}
          onChange={handleNodeSelect}
          options={nodes}
          filter
          className="md:w-20rem w-full"
          placeholder="Select Item"
          showClear
          inputId="treeSelect"
        />

        <span>
          {labels &&
            labels.length > 0 &&
            labels.map((label, i) => (
              <Tag
                key={i}
                severity="warning"
                value={label}
                className="p-mr-2 p-mb-2"
              />
            ))}
        </span>
      </StyledFilters>
    </>
  );
}

export default FilterShowing;
