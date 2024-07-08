import { useFilter } from "../contexts/FilterContext";
import { getCutsData } from "../service/client";

//useUpdateGrouping is a custom hook that is used to update the grouping in the FilterContext when the user selects a new grouping from the grouped by menu. The custom hook takes the oldKey and grouping as arguments and dispatches an action to update the grouping in the FilterContext. this function frequently used in different components to update the grouping in the FilterContext.
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
