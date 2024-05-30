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

export { getCubes, getCutsData };
