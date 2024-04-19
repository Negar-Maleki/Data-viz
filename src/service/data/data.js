export async function getData() {
  const res = await fetch("https://zircon-api.datausa.io/cubes");

  if (!res.ok) throw new Error("Failed getting data");

  const data = await res.json();

  return data.cubes;
}
