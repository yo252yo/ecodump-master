import React, { useMemo } from "react";
import { Table } from "antd";
import { Item } from "../../utils/typedData";
import { useAppContext } from "../../AppContext";
import { filterByText, filterByIncludesAny } from "../../utils/helpers";
import { useGetColumns } from "./useGetColumns";

const getProfessionAndCraftStations = (item: Item) => {
  const variants = item.productInRecipes
    .map((recipe) => recipe.variants)
    .flat();

  if (variants.length === 0) {
    return "NA";
  }
  const professionsAndCraftStations = item.productInRecipes.map(
    ({ skillNeeds, craftStation }) =>
      `${
        skillNeeds?.length === 0
          ? "No profession"
          : `${skillNeeds?.[0].skill} lvl${skillNeeds?.[0].level}`
      } @ ${craftStation ?? "No craft station"}`
  );

  return professionsAndCraftStations.length === 0
    ? "No recipes"
    : professionsAndCraftStations.join(", ");
};

export default () => {
  const {
    filterProfessions,
    filterCraftStations,
    filterName,
    filterWithRecipe,
    allItems,
  } = useAppContext();
  const columns = useGetColumns();

  const items = useMemo(
    () =>
      Object.values(allItems).map((item) => ({
        ...item,
        profAndCraftStations: getProfessionAndCraftStations(item),
      })),
    [allItems]
  );

  const datasource = useMemo(
    () =>
      items.filter((item: Item) => {
        const skillNeeds = item.productInRecipes
          .map((recipe) =>
            recipe.skillNeeds.map((skillNeeds) => skillNeeds.skill)
          )
          .flat();
        const craftingTables = item.productInRecipes.map(
          (recipe) => recipe.craftStation ?? "none"
        );

        const variants = item.productInRecipes
          .map((recipe) => recipe.variants)
          .flat();

        return filterWithRecipe
          ? filterByText(filterName, item.key) &&
              variants.length > 0 &&
              filterByIncludesAny(filterProfessions, skillNeeds) &&
              filterByIncludesAny(filterCraftStations, craftingTables)
          : filterByText(filterName, item.key) && variants.length === 0;
      }),
    [
      items,
      filterCraftStations,
      filterName,
      filterProfessions,
      filterWithRecipe,
    ]
  );
  return <Table dataSource={datasource} columns={columns} />;
};
