import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import Groupings from "./Groupings";
import FilterBy from "./FilterBy";

import { TreeSelect } from "primereact/treeselect";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { useFilter } from "../contexts/FilterContext";
import { DataContext } from "../service/provider/DataProvider";

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

    nodesArray?.forEach((node, i) => {
      node.key = i.toString();
      node.children.forEach((nodeChild, j) => {
        nodeChild.key = `${i}-${j}`;
        nodeChild?.children?.forEach((nodeChildChild, k) => {
          nodeChildChild.key = `${i}-${j}-${k}`;
        });
      });
      if (node.children.length === 1) {
        node.children = node.children[0].children;
      }
    });

    dispatch({ type: "setNodes", payload: nodesArray });
  }, [data]);

  const setSelectedMeasure = (e) => {
    let dimensionsNodes = e.node.data.dimensions
      .filter((dim) => dim.dimensionName !== "Year")
      .map((dim, i) => {
        if (dim.hierarchies.length === 1) {
          if (dim.hierarchies[0].levels.length <= 2) {
            return {
              label: dim.dimensionName,
              selectable: true,
              key: `${i}`,
              data: {
                dimensionName: dim.dimensionName,
                hierarchyName: dim.hierarchies[0].name,
                cubeName: dim.cubeName,
                level: dim.hierarchies[0].levels[1].name,
              },
            };
          } else {
            return {
              label: dim.dimensionName,
              selectable: false,
              key: `${i}`,
              children: dim.hierarchies[0].levels
                .filter((level) => level.name !== "(All)")
                .map((level, j) => ({
                  label: level.name,
                  key: `${i}-${j}`,
                  selectable: true,
                  data: {
                    dimensionName: dim.dimensionName,
                    hierarchyName: dim.hierarchies[0].name,
                    cubeName: dim.cubeName,
                    level: level.name,
                  },
                })),
            };
          }
        } else {
          return {
            label: dim.dimensionName,
            selectable: false,
            key: `${i}`,
            children: dim.hierarchies.map((hier, j) => ({
              label: hier.name,
              key: `${i}-${j}`,
              selectable: hier.levels.length > 2 ? false : true,
              data: {
                dimensionName: dim.dimensionName,
                hierarchyName: hier.name,
                cubeName: dim.cubeName,
                level: hier.name,
              },
              children: hier.levels
                .filter(
                  (level) => level.name !== "(All)" && level.name !== hier.name
                )
                .map((level, k) => ({
                  label: level.name,
                  data: {
                    dimensionName: dim.dimensionName,
                    hierarchyName: hier.name,
                    cubeName: dim.cubeName,
                    level: level.name,
                  },
                  key: `${i}-${j}-${k}`,
                })),
            })),
          };
        }
      });
    dimensionsNodes?.forEach((node) => {
      if (node?.children?.length === 1) {
        node.children = node?.children[0]?.children;
      }
    });
    dispatch({ type: "setMeasure", payload: e.node });
    dispatch({ type: "setDimensionNodes", payload: dimensionsNodes });

    const firstGrouping = dimensionsNodes[0]?.children[0];
    dispatch({
      type: "addGroupings",
      payload: { drillDown: firstGrouping, cuts: [], active: false },
    });
  };

  if (!measureNodes || measureNodes.length === 0)
    return (
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    );

  const labels = selectedMeasure?.data ? selectedMeasure.data.dimensions : null;

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

      <Groupings />
      <FilterBy />
    </>
  );
}

export default SidebarDisplay;
