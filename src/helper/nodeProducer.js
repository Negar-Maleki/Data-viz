// Desc: This file contains the helper functions to build the nodes array for the tree component

//build the nodes array for the tree select component to display in the showing menu. The nodeArray structure is what the tree select component requires to display the data in the tree select component.
function buildNodesArray(data) {
  //create the nodes array for the tree select component
  const nodesArray = [];

  //loop through the data and create the nodes array as required for the tree select component
  data?.forEach((item) => {
    //for the future api call we won't need the cube name that end with _1.
    if (item.name.endsWith("_1")) return null;
    //get the annotations, measures and dimensions from the data
    const annotation = item.annotations;
    const cubeMeasures = item.measures;
    const cubeDimensions = item.dimensions;

    //create the child data object. This object will be passed to the measure nodes as data to store the dimension, hierarchy and level information which will be used for the future api call
    const childData = {
      dimensions: cubeDimensions.map((dimension) => ({
        dimensionName: dimension.name,
        cubeName: item.name,
        hierarchies: dimension.hierarchies.map((hierarchy) => ({
          name: hierarchy.name,
          levels: hierarchy.levels.map((level) => ({
            name: level.name,
            fullName: level.full_name,
            caption: level.caption,
          })),
        })),
      })),
    };

    // Create the measure array which are the measure of each cube and filter out the measures that have MOE, RCA and Moe in their name. These measures are the options that will be displayed on showing menu in the tree select component for the user to select.
    let measureChildren = cubeMeasures.map((m) => ({
      name: item.name,
      label: m.name,
      data: childData,

      // Aggregation method is the method used to aggregate the measure data that store in measureChildren. If the aggregation method is not NONE, then the aggregation method will be store in measureChildren else the aggregator will be store in there.

      aggregationMethod:
        m.annotations.aggregation_method &&
        m.annotations.aggregation_method !== "NONE"
          ? m.annotations.aggregation_method
          : m.aggregator,
      // preAggregationMethod is the method used to pre-aggregate the measure data that store in measureChildren.
      preAggregationMethod: m.annotations.pre_aggregation_method,
      more: [],
    }));
    measureChildren = measureChildren.filter((child) => {
      return (
        !child.label.includes("MOE") &&
        !child.label.includes("RCA") &&
        !child.label.includes("Moe")
      );
    });

    //create the measureChildrenLabels array which will be used to store the labels of the measureChildren array. This array will be used to display in the filter by dropdown menu.
    const measureChildrenLabels = measureChildren.map((obj) => obj.label);
    measureChildren.forEach((obj) => {
      obj.more = measureChildrenLabels;
    });

    //find the index of the repeated cubes annotations topics in the nodesArray
    const repeatedArrayIndex = nodesArray.findIndex(
      (node) => node.label === annotation.topic
    );

    //sort the nodesArray by label to display on the tree select component menu in alphabetical order
    nodesArray.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    //in the operation below, the repeated topics, subtopics and measures will be checked to prevent the duplication of the topics, subtopics and measures in the nodesArray.
    //if the repeatedArrayIndex is -1 (the topic is not found in the nodesArray), then push the new node to the nodesArray.
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
      // Else, find the index of the repeated subtopic in the nodesArray and if the subtopic index is -1, then push the new subtopic to the nodesArray.
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
        //Else, find the index of the repeated measure in the nodesArray and if the measure index is -1, then push the new measure to the nodesArray.
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

  //loop through the nodesArray and assign the key to each node and its children node as keys are required for the tree select component
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

//build the measure nodes for the tree select component to display grouped by options.The dimensionsNodes structure is what the tree select component requires to display the data in the tree select component.
function buildMeasreNodes(e) {
  //get the dimensions from the data as the dimensions will be used to build the grouped by options
  // the dimensionsNodes store any data from the cubes dimensions that will be used for the future api call, display in the grouped by options in the tree select component, and in the graph.
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
              caption: hier.levels[1].caption,
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

  //Loop over the dimensionsNodes and if the node has only one child, then assign the child to the node. It is required for the tree select component to prevent the duplication of the nodes.
  dimensionsNodes?.forEach((node) => {
    if (node?.children?.length === 1) {
      node.children = node?.children[0]?.children;
    }
  });

  return dimensionsNodes;
}

export { buildNodesArray, buildMeasreNodes };
