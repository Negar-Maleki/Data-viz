import { useFilter } from "../contexts/FilterContext";
import { getCutsData } from "../service/data/apiCallers";

async function updateGroupingFunction(oldKey, grouping) {
  const { dispatch } = useFilter();
  const groupCuts = await getCutsData(grouping);
  dispatch({
    type: "updateGrouping",
    payload: {
      oldKey: oldKey,
      newGrouping: {
        drillDown: grouping,
        selectedCuts: [],
        active: false,
        cutsOptions: groupCuts.members.map((member) => ({
          label: member.name,
          key: member.key,
        })),
      },
    },
  });
}

export default updateGroupingFunction;
