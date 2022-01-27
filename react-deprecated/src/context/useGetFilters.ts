import useLocalStorage from "./useLocalStorage";

export default () => {
  const [filterName, setFilterName] = useLocalStorage<string>("filter", "");

  const [filterWithRecipe, setFilterWithRecipe] = useLocalStorage<boolean>(
    "filterRecipe",
    true
  );

  const [filterProfessions, setFilterProfessions] = useLocalStorage<string[]>(
    "filterProfessions",
    []
  );

  const [filterCraftStations, setFilterCraftStations] = useLocalStorage<
    string[]
  >("filterCraftStations", []);

  const [filterCredits, setFilterCredits] = useLocalStorage<boolean>(
    "filterCredits",
    true
  );

  return {
    filterName,
    setFilterName,

    filterWithRecipe,
    setFilterWithRecipe,

    filterProfessions,
    setFilterProfessions,

    filterCraftStations,
    setFilterCraftStations,

    filterCredits,
    setFilterCredits,
  };
};
