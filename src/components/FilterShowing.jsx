import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import GroupedByFilter from "./GroupedByFilter";
import FilterBy from "./FilterBy";

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
  const [selectedLabels, setSelectedLabels] = useState(null);

  const nodesArray = [];

  const data = useContext(DataContext);

  useEffect(() => {
    data.forEach((item) => {
      const annotation = item.annotations;
      const cubeMeasures = item.measures;
      const cubeDimensions = item.dimensions;
      const childData = {
        dimensions: cubeDimensions.map((dimension) => ({
          dimensionName: dimension.name,
          cubeName: item.name,
          hierarchies: dimension.hierarchies.map((hierarchy) => ({
            name: hierarchy.name,
            levels: hierarchy.levels.map((level) => ({ name: level.name })),
          })),
        })),
      };

      let measureChildren = cubeMeasures.map((m) => ({
        name: item.name,
        label: m.name,
        data: childData,
        more: [],
      }));
      measureChildren = measureChildren.filter((child) => {
        return (
          !child.label.includes("MOE") &&
          !child.label.includes("RCA") &&
          !child.label.includes("Moe")
        );
      });
      const measureChildrenLabels = measureChildren.map((obj) => obj.label);
      measureChildren.forEach((obj) => {
        obj.more = measureChildrenLabels;
      });

      const repeatedArrayIndex = nodesArray.findIndex(
        (node) => node.label === annotation.topic
      );

      nodesArray.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });

      if (repeatedArrayIndex === -1) {
        nodesArray.push({
          name: item.name,
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

  if (!nodes || nodes.length === 0)
    return (
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    );
  const labels = selectedLabels?.data ? selectedLabels.data.dimensions : null;

  return (
    <>
      <StyledFilters>
        <label htmlFor="treeSelect">Showing </label>

        <TreeSelect
          value={selectedNodeKey}
          onChange={(e) => setSelectedNodeKey(e.value)}
          options={nodes}
          filter
          placeholder="Select Item"
          showClear
          inputId="treeSelect"
          onNodeSelect={(e) => setSelectedLabels(e.node)}
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

      <GroupedByFilter selectedLabels={selectedLabels} />
      <FilterBy selectedLabels={selectedLabels} />
    </>
  );
}

export default FilterShowing;
