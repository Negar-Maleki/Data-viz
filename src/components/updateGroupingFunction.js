import { useFilter } from "../contexts/FilterContext";
import { getCutsData } from "../service/data/client";

export const useUpdateGrouping = () => {
  const { dispatch } = useFilter();

  const updateGroupingFunction = async (oldKey, grouping) => {
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
  };

  return { updateGroupingFunction };
};
