import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { TreeSelect } from "primereact/treeselect";
import { Tag } from "primereact/tag";
import { DataContext } from "../service/provider/DataProvider";
import { ProgressSpinner } from "primereact/progressspinner";

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

  const data = useContext(DataContext);

  useEffect(() => {
    const nodesArray = [];
    data.forEach((item) => {
      const annotation = item.annotations;
      const measure = item.measures;
      const dimension = item.dimensions;

      let measureChildren = measure.map((m) => ({
        label: m.name,
        data: dimension.map((dim) => dim.name),
      }));
      measureChildren = measureChildren.filter((child, i) => {
        return !child.label.includes("Moe");
      });
      const repeatedArrayIndex = nodesArray.findIndex(
        (node) => node.label === annotation.topic
      );
      if (repeatedArrayIndex === -1) {
        nodesArray.push({
          label: annotation.topic,
          selectable: false,
          children: [
            {
              label: annotation.subtopic,
              selectable: false,
              children: measureChildren,
            },
          ],
        });
      } else {
        const suptopicIndex = nodesArray[repeatedArrayIndex].children.findIndex(
          (childNode) => childNode.label === annotation.subtopic
        );
        if (suptopicIndex === -1) {
          nodesArray[repeatedArrayIndex].children.push({
            label: annotation.subtopic,
            selectable: false,
            children: measureChildren,
          });
        } else {
          measureChildren.forEach((measureChild) => {
            const measureIndex = nodesArray[repeatedArrayIndex].children[
              suptopicIndex
            ].children.findIndex(
              (childNode) => childNode.label === measureChild.label
            );
            if (measureIndex === -1) {
              nodesArray[repeatedArrayIndex].children[
                suptopicIndex
              ].children.push(measureChild);
            }
          });
        }
      }
    });

    nodesArray.forEach((node, i) => {
      node.key = i.toString();
      node.children.forEach((nodeChild, j) => {
        nodeChild.key = `${i}-${j}`;
        nodeChild.children.forEach((nodeChildChild, k) => {
          nodeChildChild.key = `${i}-${j}-${k}`;
        });
      });
      if (node.children.length === 1) {
        node.children = node.children[0].children;
      }
    });

    setNodes(nodesArray);
  }, [data]);

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

  if (!nodes || nodes.length === 0)
    return (
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      >
        Loading...
      </ProgressSpinner>
    );

  return (
    <>
      <StyledFilters>
        <label htmlFor="treeSelect">Showing </label>

        <TreeSelect
          value={selectedNodeKey}
          onChange={handleNodeSelect}
          options={nodes}
          filter
          placeholder="Select Item"
          showClear
          inputId="treeSelect"
        />

        <span>
          {labels ? (
            labels.length <= 5 ? (
              labels.map((label, i) => (
                <Tag key={i} severity="warning" value={label} />
              ))
            ) : (
              <>
                {labels.slice(0, 5).map((label, i) => (
                  <Tag key={i} severity="warning" value={label} />
                ))}
                <Tag severity="warning" value={`+${labels.length - 6}`} />
              </>
            )
          ) : null}
        </span>
      </StyledFilters>
    </>
  );
}

export default FilterShowing;
