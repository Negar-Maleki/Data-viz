import React, { useEffect } from "react";

import { useFilter } from "../contexts/FilterContext";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

//Tables component
function Tables({ chartData, products, onSetProducts }) {
  //Get the selected measure and groupings from the FilterContext
  const { selectedMeasure, groupings } = useFilter();

  //Update the products state when the chartData changes. Remove the total row from the chartData before setting the products state to avoid displaying the total row in the table.
  useEffect(() => {
    const removeTotal = chartData.filter((c) => c[levelName] !== "Total");
    onSetProducts(removeTotal);
  }, [chartData]);

  //Check if groupings and chartData are defined and not empty
  if (!Array.isArray(groupings) || groupings.length === 0) {
    console.error("groupings is not defined or empty");
    return;
  }

  //Check if groupings and chartData are defined and not empty
  if (!Array.isArray(chartData) || chartData.length === 0) {
    console.error("data is not defined or empty");
    return;
  }

  //The level name is the dimension name that user selected from the grouped by menu which will be used as the column header and field in the table.
  const levelName = groupings.map(
    (grouping) => grouping.drillDown?.data?.level
  );

  if (!levelName.every(Boolean)) {
    console.error("One or more groupings do not have a valid dimensionName");
    return;
  }

  return (
    <div className="card">
      <DataTable
        value={products}
        header={selectedMeasure.label}
        tableStyle={{ minWidth: "20rem" }}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column field="Year" header="Year"></Column>
        {groupings
          .filter((grouping) => grouping.active === true)
          .map((group, i) => (
            <Column
              field={group.caption}
              header={group.caption}
              key={i}
            ></Column>
          ))}
        <Column
          field={selectedMeasure.label}
          header={selectedMeasure.label}
        ></Column>
      </DataTable>
    </div>
  );
}

export default Tables;
