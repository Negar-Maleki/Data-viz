import styled from "styled-components";
import React, { useState } from "react";

import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

const StyledResponsiveMenu = styled.div`
  grid-column: 1;
  padding-left: 1em;
  display: grid;

  @media screen and (min-width: 775px) {
    display: none;
  }
`;

function ResponsiveMenu() {
  const [visible, setVisible] = useState(false);

  const items = [
    {
      label: "Home",
      icon: "pi  pi-home",
      url: "/unstyled",
    },
    {
      label: "Reports",
      icon: "pi pi-file",
    },
    {
      label: "Maps",
      icon: "pi pi-map",
      url: "https://react.dev/",
    },
    {
      label: "About",
      icon: "pi pi-link",
      url: "https://react.dev/",
    },
  ];

  return (
    <StyledResponsiveMenu>
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <Menu model={items} />
      </Sidebar>
      <Button
        icon="pi pi-align-justify"
        onClick={() => setVisible(true)}
        outlined
        severity="info"
        size="small"
        rounded
        text
      />
    </StyledResponsiveMenu>
  );
}

export default ResponsiveMenu;
