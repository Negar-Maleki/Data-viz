const BASE_URL = "https://arkansas-api.datausa.io/cubes";

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

async function getCutsData(grouping) {
  const cubeName = grouping.data.cubeName;
  const dimensionName = grouping.data.dimensionName;
  const hierarchyName = grouping.data.hierarchyName;
  const levelName = grouping.data.level;

  async function getCutsDataApi() {
    try {
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

async function getFilteredData(groupings, filters, selectedMeasure) {
  const cubeName = groupings[0].drillDown.data.cubeName;
  const cuts = [];
  const drilldowns = [];
  const filter = [];
  const measure = `${selectedMeasure.label}`;
  const order = `[Measures].${[measure]}`;
  const order_desc = true;
  const nonempty = true;
  const parents = true;
  const sparse = true;

  groupings.forEach((grouping) => {
    for (const cutKey in grouping.selectedCuts) {
      if (grouping.selectedCuts.hasOwnProperty(cutKey)) {
        cuts.push(
          `[${grouping.drillDown.data.dimensionName}].[${grouping.drillDown.label}].&[${cutKey}]`
        );
      }
    }
    if (grouping.drillDown.selectable) {
      if (grouping.active)
        drilldowns.push(
          `[${grouping.drillDown.data.dimensionName}].[${grouping.drillDown.label}]`
        );
    }
  });
  filters.forEach((f) => {
    if (f.active) {
      filter.push({
        name: f.name,
        value: f.inputValue,
        operation: f.operation,
      });
    }
  });

  const params = new URLSearchParams();
  cuts.forEach((cut) => params.append("cut[]", cut));
  params.append("drilldown[]", "drilldown[]=[Year].[Year]");
  drilldowns.forEach((drilldown) => params.append("drilldown[]", drilldown));
  params.append("measures[]", measure);
  params.append("order", order);
  filter.forEach((f) => {
    const filter = `${f.name.name}+${f.operation}+${f.value}`;

    params.append("filter[]", filter);
  });
  params.append("order_desc", order_desc);
  params.append("nonempty", nonempty);
  params.append("parents", parents);
  params.append("sparse", sparse);

  const apiUrl = `${BASE_URL}/${cubeName}?${params.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      mode: "cors", // Ensure CORS is enabled
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

export { getCubes, getCutsData, getFilteredData };
