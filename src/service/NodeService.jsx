const labels = { "0-0-0": [1, 2, 3], "0-": ["a", "b", "c"] };

export const NodeService = {
  getTreeNodesData() {
    return [
      {
        key: "0",
        label: "Documents",
        data: "Documents Folder",
        icon: "pi pi-fw pi-inbox",
        selectable: false,
        children: [
          {
            key: "0-0",
            label: "Work",
            data: "Work Folder",
            icon: "pi pi-fw pi-cog",
            selectable: false,
            children: [
              {
                key: "0-0-0",
                label: "Expenses.doc",
                icon: "pi pi-fw pi-file",
                data: ["Work Folder", "Work Folder 2"],
              },
              {
                key: "0-0-1",
                label: "Resume.doc",
                icon: "pi pi-fw pi-file",
                data: ["Resume Document", "Resume Document 2"],
              },
            ],
          },
          {
            key: "0-1",
            label: "Home",
            data: "Home Folder",
            icon: "pi pi-fw pi-home",
            selectable: false,
            children: [
              {
                key: "0-1-0",
                label: "Invoices.txt",
                icon: "pi pi-fw pi-file",
                data: ["Invoices for this month", "Invoices for next month"],
              },
            ],
          },
        ],
      },
      {
        key: "1",
        label: "Events",
        data: "Events Folder",
        icon: "pi pi-fw pi-calendar",
        selectable: false,
        children: [
          {
            key: "1-0",
            label: "Meeting",
            icon: "pi pi-fw pi-calendar-plus",
            data: ["Meeting", "Meeting 2"],
          },
          {
            key: "1-1",
            label: "Product Launch",
            icon: "pi pi-fw pi-calendar-plus",
            data: ["Product Launch", "Product Launch 2"],
          },
          {
            key: "1-2",
            label: "Report Review",
            icon: "pi pi-fw pi-calendar-plus",
            data: ["Report Review", "Report Review 2"],
          },
        ],
      },
      {
        key: "2",
        label: "Movies",
        data: "Movies Folder",
        icon: "pi pi-fw pi-star-fill",
        selectable: false,
        children: [
          {
            key: "2-0",
            icon: "pi pi-fw pi-star-fill",
            label: "Al Pacino",
            data: "Pacino Movies",
            selectable: false,
            children: [
              {
                key: "2-0-0",
                label: "Scarface",
                icon: "pi pi-fw pi-video",
                data: ["Scarface Movie", "Scarface Movie 2"],
              },
              {
                key: "2-0-1",
                label: "Serpico",
                icon: "pi pi-fw pi-video",
                data: ["Serpico Movie", "Serpico Movie 2", "Serpico Movie 3"],
              },
            ],
          },
          {
            key: "2-1",
            label: "Robert De Niro",
            icon: "pi pi-fw pi-star-fill",
            data: [
              "De Niro Movies",
              "De Niro Movies 2",
              "De Niro Movies 3",
              "De Niro Movies 4",
            ],
            selectable: false,
            children: [
              {
                key: "2-1-0",
                label: "Goodfellas",
                icon: "pi pi-fw pi-video",
                data: [
                  "Goodfellas Movie",
                  "Goodfellas Movie 2",
                  "Goodfellas Movie 3",
                  "Goodfellas Movie 4",
                ],
              },
              {
                key: "2-1-1",
                label: "Untouchables",
                icon: "pi pi-fw pi-video",
                data: [
                  "Untouchables Movie",
                  "Untouchables Movie 2",
                  "Untouchables Movie 3",
                  "Untouchables Movie 4",
                  "Untouchables Movie 5",
                ],
              },
            ],
          },
        ],
      },
    ];
  },

  getTreeNodes() {
    return Promise.resolve(this.getTreeNodesData());
  },
};
