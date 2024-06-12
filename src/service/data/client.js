const BASE_URL = "/cubes";

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
  const measure = selectedMeasure.label;
  const order = `[Measures].[${measure}]`;
  const order_desc = true;
  const nonempty = true;
  const parents = true;
  const sparse = true;

  groupings.forEach((grouping) => {
    const currentCuts = [];
    for (const cutKey in grouping.selectedCuts) {
      if (grouping.selectedCuts.hasOwnProperty(cutKey)) {
        currentCuts.push(
          `[${grouping.drillDown.data.dimensionName}].[${grouping.drillDown.data.level}].&[${cutKey}]`
        );
      }
    }
    if (currentCuts.length > 1) {
      cuts.push(`{${currentCuts.join(",")}}`);
    }

    if (grouping.active) {
      drilldowns.push(`${grouping.drillDown.data.fullName}`);
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
  params.append("drilldown[]", "[Year].[Year]");
  drilldowns.forEach((drilldown) => params.append("drilldown[]", drilldown));
  filter.forEach((f) => {
    console.log(f);
    const filter = `${f.name.name} ${f.operation} ${f.value}`;
    console.log(filter);
    params.append("filter[]", filter);
  });
  params.append("measures[]", measure);
  params.append("order", order);
  params.append("order_desc", order_desc);
  params.append("nonempty", nonempty);
  params.append("parents", parents);
  params.append("sparse", sparse);

  const apiUrl = `${BASE_URL}/${cubeName}/aggregate.jsonrecords?${params.toString()}`;
  console.log(apiUrl);
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
