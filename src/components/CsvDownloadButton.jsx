import React from "react";
import { Button } from "primereact/button";
import Papa from "papaparse";
import { useFilter } from "../contexts/FilterContext";
import styled from "styled-components";
const StyledTableDiv = styled.div`
  margin-top: 3em;
`;
const StyledButton = styled(Button)`
  margin-top: 1em;
`;

// CSC downloader
function CsvDownloadButton({ children, products }) {
  const { selectedMeasure, groupings } = useFilter();

  // Download CSV
  const handleDownloadCSV = () => {
    // Get table data in a format suitable for Papa.parse
    const tableData = products.map((product) => {
      return {
        // Include column data based on your table structure
        [groupings[0].caption]: product[groupings[0].caption],
        Year: product.Year,
        [selectedMeasure.label]: product[selectedMeasure.label],
      };
    });

    // Convert data to CSV string using Papa.parse
    const csv = Papa.unparse(tableData, {
      header: true, // Include headers in the CSV
    });

    // Create a Blob object for the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a temporary URL for the CSV download
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `table.csv`);

    // Simulate a click event to initiate the download
    link.click();

    // Release the temporary URL after download
    URL.revokeObjectURL(url);
  };

  return (
    <StyledTableDiv>
      {children}
      <StyledButton
        onClick={handleDownloadCSV}
        severity="secondary"
        outlined
        icon="pi pi-download"
        tooltip="Download table as CSV"
      />
    </StyledTableDiv>
  );
}

export default CsvDownloadButton;
