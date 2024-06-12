function buildNodesArray(data) {
  const nodesArray = [];

  data?.forEach((item) => {
    const annotation = item.annotations;
    const cubeMeasures = item.measures;
    const cubeDimensions = item.dimensions;
    const childData = {
      dimensions: cubeDimensions.map((dimension) => ({
        dimensionName: dimension.name,
        cubeName: item.name,
        hierarchies: dimension.hierarchies.map((hierarchy) => ({
          name: hierarchy.name,
          levels: hierarchy.levels.map((level) => ({
            name: level.name,
            fullName: level.full_name,
          })),
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

  return nodesArray;
}

function buildMeasreNodes(e) {
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
              fullName: dim.hierarchies[0].levels[1].fullName,
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
                  fullName: level.fullName,
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
              fullName: hier.levels[1].fullName,
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
                  fullName: level.fullName,
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

  dimensionsNodes.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
  return dimensionsNodes;
}

export { buildNodesArray, buildMeasreNodes };
