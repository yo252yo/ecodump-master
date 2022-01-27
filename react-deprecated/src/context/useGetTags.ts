import { getTags } from "../sdk/restDbSdk";
import { useQuery } from "react-query";
import { tagsKey } from "../utils/queryKeys";
import { min30 } from "../utils/constants";
import { allTags } from "../utils/typedData";

export default () => {
  const tagsDbResponse = useQuery(tagsKey, getTags, {
    staleTime: min30,
    cacheTime: min30,
  });

  const tagsData = tagsDbResponse?.data?.data?.data;
  if (tagsData != null && Object.keys(tagsData).length > 0) {
    return tagsData;
  }

  return allTags;
};
