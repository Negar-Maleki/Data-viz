import styled from "styled-components";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { Button } from "primereact/button";
import { useState } from "react";
import { TreeSelect } from "primereact/treeselect";
import Filters from "./Filters";

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

const StyledTreeSelect = styled(TreeSelect)`
  width: 100%;
`;
const StyledAddGroupButton = styled(Button)`
  width: 100%;
  display: inline;
`;

function GroupedByFilter({ selectedLabels }) {
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [filterCount, setFilterCount] = useState([1]);

  const handleAddFilter = () => {
    // if (selectedLabels.data.dimensions.length > filterCount.length)
    setFilterCount(filterCount + 1);
  };

  let nodes = selectedLabels?.data.dimensions
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
              .filter(
                (level) =>
                  level.name !== "(All)" &&
                  level.name !== dim.hierarchies[0].name
              )
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

  nodes?.forEach((node) => {
    if (node?.children?.length === 1) {
      node.children = node?.children[0]?.children;
    }
  });
  console.log(selectedLabels);
  return (
    <StyledFilters>
      <label>Grouped by </label>
      <fieldset>
        <p>
          {selectedLabels
            ? selectedLabel
              ? `${selectedLabel.data.dimensionName} > ${selectedLabel.data.level}`
              : `${selectedLabels.data.dimensions[0].dimensionName} > ${selectedLabels.data.dimensions[0].hierarchies[0].levels[1].name}`
            : "select item"}
        </p>
        <Inplace unstyled="true">
          <InplaceDisplay>
            <Button label="Edit" severity="info" />
          </InplaceDisplay>
          <InplaceContent>
            <Filters nodes={nodes} onSelectedLabel={setSelectedLabel} />
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
              <Filters nodes={nodes} onSelectedLabel={setSelectedLabel} />
            </fieldset>
          </InplaceContent>
        </Inplace>
      ))}
    </StyledFilters>
  );
}

export default GroupedByFilter;
