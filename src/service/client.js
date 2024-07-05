// to prevent CORS error, using a proxy server to fetch data from the API. The Proxy defined in package.json
const BASE_URL = "/cubes";

//API call to get the list of cubes
const getCubes = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed getting data");

    const data = await res.json();

    return data.cubes;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

//API call to get the list of cuts for a specific grouping
async function getCutsData(grouping) {
  // Extract the cube, dimension, hierarchy, and level names from the grouping object
  const cubeName = grouping.data.cubeName;
  const dimensionName = grouping.data.dimensionName;
  const hierarchyName = grouping.data.hierarchyName;
  const levelName = grouping.data.level;

  async function getCutsDataApi() {
    try {
      // Fetch the data from the API based on the cube, dimension, hierarchy, and level names
      const res = await fetch(
        `${BASE_URL}/${cubeName}/dimensions/${dimensionName}/hierarchies/${hierarchyName}/levels/${levelName}/members?children=false`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();

      return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return null;
    }
  }
  if (cubeName && dimensionName && hierarchyName && levelName) {
    return await getCutsDataApi();
  }
  return null;
}

//API call to get the filtered data for the visualization based on the options selected by the user.
async function getFilteredData(groupings, filters, selectedMeasure) {
  // Extract the cube name, cuts, drilldowns, filters,and measure from the groupings, filters, and selectedMeasure objects. order, order_desc, nonempty, parents, and sparse are set to default values.
  const cubeName = groupings[0].drillDown.data.cubeName;
  const cuts = [];
  const drilldowns = [];
  const filter = [];
  const measure = selectedMeasure.label;
  const order = `[Measures].[${measure}]`;
  const order_desc = true;
  const nonempty = true;
  const parents = true;
  const sparse = true;

  // Loop through the groupings arrays to extract the cuts and  drilldowns to create the URL parameters based on the selected groupings by considering the active status of the groupings and filters.
  groupings.forEach((grouping) => {
    const currentCuts = [];
    for (const cutKey in grouping.selectedCuts) {
      if (grouping.selectedCuts.hasOwnProperty(cutKey)) {
        currentCuts.push(
          `[${grouping.drillDown.data.dimensionName}].[${grouping.drillDown.data.level}].&[${cutKey}]`
        );
      }
    }
    // If the currentCuts array has more than one element, the cuts array will push the cuts in the format of[{cut1,cut2,...}].
    if (currentCuts.length > 0) {
      cuts.push(`{${currentCuts.join(",")}}`);
    }
    // If the currentCuts array has only one element, the cuts array will push the cuts in the format of[cut].
    if (grouping.active) {
      drilldowns.push(`${grouping.drillDown.data.fullName}`);
    }
  });

  // Loop through the filters array to extract the filters to create the URL parameters based on the selected filters by considering the active status of the filters.
  filters.forEach((f) => {
    if (f.active) {
      filter.push({
        name: f.name,
        value: f.inputValue,
        operation: f.operation,
      });
    }
  });

  // URLSearchParams object is used to create the URL parameters for the API call. The parameters include the cuts, drilldowns, filters, measure, order, order_desc, nonempty, parents, and sparse.
  const params = new URLSearchParams();
  cuts.forEach((cut) => params.append("cut[]", cut));
  params.append("drilldown[]", "[Year].[Year]");
  drilldowns.forEach((drilldown) => params.append("drilldown[]", drilldown));
  filter.forEach((f) => {
    const filter = `${f.name.name} ${f.operation} ${f.value}`;
    params.append("filter[]", filter);
  });
  params.append("measures[]", measure);
  params.append("order", order);
  params.append("order_desc", order_desc);
  params.append("nonempty", nonempty);
  params.append("parents", parents);
  params.append("sparse", sparse);

  const apiUrl = `${BASE_URL}/${cubeName}/aggregate.jsonrecords?${params.toString()}`;

  // Fetch the data from the API based on the URL parameters created.
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export { getCubes, getCutsData, getFilteredData };
