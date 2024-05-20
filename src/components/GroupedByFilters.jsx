import styled from "styled-components";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { useFilter } from "../contexts/FilterContext";

import GroupedByFilter from "./GroupedByFilter";

const StyledFilters = styled.div`
  display: grid;
  min-height: 3.5em;

  label {
    padding: 0.5em 0;
  }
  fieldset {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 1em;
  }
`;

const StyledAddGroupButton = styled(Button)`
  width: 100%;
  display: inline;
`;

function GroupedByFilters() {
  const { groupedBy, selectedLabels, dispatch } = useFilter();
  const [filterCount, setFilterCount] = useState([1]);
  const [selectedMajorOptionState, setSelectedMajorOptionState] =
    useState(null);
  const [addGroupedByFilters, setAddGroupedByFilters] = useState(null);

  const handleAddGroupedByFilters = () => {
    dispatch({
      type: "setGroupedBy",
      payload: addGroupedByFilters,
    });
  };
  const handleAddFilter = () => {
    if (filterCount.length < dimensionsNodes.length)
      setFilterCount(filterCount + 1);
  };

  let dimensionsNodes = selectedLabels?.data.dimensions
    .filter((dim) => dim.dimensionName !== "Year")
    .map((dim, i) => {
      if (dim.hierarchies.length === 1)
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
      else {
        return {
          label: dim.dimensionName,
          selectable: false,
          key: `${i}`,
          children: dim.hierarchies.map((hier, j) => ({
            label: hier.name,
            key: `${i}-${j}`,
            selectable: false,
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
  const filteredNodes = dimensionsNodes?.filter(
    (nodes) => !Object.values(nodes).includes(selectedMajorOptionState?.label)
  );

  const handleGroupedByFilters = () => {
    // dispatch({
    //   type: "setGroupedBy",
    //   payload: ,
    // });
  };
  console.log(groupedBy);
  return (
    <StyledFilters>
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
    </StyledFilters>
  );
}

export default GroupedByFilters;
