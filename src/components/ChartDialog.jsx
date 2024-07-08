import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { toPng } from "html-to-image";

import download from "downloadjs";
import styled from "styled-components";
import { Dialog } from "primereact/dialog";

const StyledButton = styled.div`
  width: 12%;
  display: grid;
  grid-template-columns: auto auto;
  gap: 1em;
`;

function ChartDialog({ children }) {
  //state to store the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  //ref to the chart component to be used to convert the chart to an image
  const ref = useRef();

  //function to handle the click event on the chart to display it full screen.
  const handleChartClick = () => {
    setShowModal(true);
  };

  const handleCapture = () => {
    //toPng is from the html-to-image library. it is used to convert the chart component to a png image. it takes the ref of the chart component as an argument. it returns a promise that resolves to a dataUrl. this dataUrl is then passed to the download function to download the image. if there is an error, it will be caught and logged to the console.
    toPng(ref.current)
      .then((dataUrl) => {
        download(dataUrl, "chart.png");
      })
      .catch((err) => {
        console.error("oops, something went wrong!", err);
      });
  };

  //function to handle the double click event on the chart to display it full screen.
  const handleChartDoubleClick = () => {
    setShowModal(true);
  };
  return (
    <>
      <Dialog
        visible={showModal}
        style={{ width: "100vw", height: "100vh" }}
        onHide={() => {
          if (!showModal) return;
          setShowModal(false);
        }}
        dismissableMask={true}
      >
        <Button
          onClick={handleCapture}
          severity="secondary"
          outlined
          tooltip="Download chart"
          icon="pi pi-download"
          raised
          style={{ position: "absolute", top: "1em", lef: "1em" }}
        />
        {children}
      </Dialog>
      {/* double click and full screen on the elemane that specified by ref*/}
      <div
        onDoubleClick={handleChartDoubleClick}
        style={{ width: "100%", height: "30em" }}
        ref={ref}
      >
        {children}
      </div>

      <StyledButton>
        {/* download and full screen buttons */}
        <Button
          onClick={handleCapture}
          severity="secondary"
          outlined
          tooltip="Download chart"
          icon="pi pi-download"
          raised
        />

        <Button
          icon="pi pi-search-plus"
          onClick={handleChartClick}
          raised
          outlined
          severity="secondary"
          tooltip="Click to enlarge chart"
        />
      </StyledButton>
    </>
  );
}

export default ChartDialog;
