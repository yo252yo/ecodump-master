import React, { useEffect, useMemo, useState } from "react";
import { Recipe, RecipesFile } from "../types";
import { filterByIncludes, filterUnique, filterByText } from "../utils/helpers";
import useRestDb, { DbContent } from "./useRestDb";

export interface HeaderFilters {
  professions: string[];
  setProfessions: React.Dispatch<React.SetStateAction<string[]>>;
  filterProfession: string[];
  setFilterProfession: React.Dispatch<React.SetStateAction<string[]>>;
  craftStations: string[];
  setCraftStations: React.Dispatch<React.SetStateAction<string[]>>;
  filterCraftStations: string[];
  setFilterCraftStations: React.Dispatch<React.SetStateAction<string[]>>;
  filterName: string;
  setFilterName: React.Dispatch<React.SetStateAction<string>>;
  filteredRecipes: Recipe[];
}

const getRecipes = (file: DbContent<unknown>): Recipe[] => {
  if (!file.isReady) return [];

  const recipesFile = file?.result as RecipesFile;
  return Object.values(recipesFile.recipes).map((t) => ({
    key: t.defaultVariant,
    name: t.defaultVariant,
    profession: t.skillNeeds?.[0]?.[0],
    numberOfProfessions: t.skillNeeds.length,
    craftStation: t.craftStn[0],
    numberOfCraftStations: t.craftStn.length,
    numberOfVariants: Number(t.numberOfVariants),
    variants: t.variants,
  }));
};

export default (): HeaderFilters => {
  const [professions, setProfessions] = useState<string[]>([]);
  const [filterProfession, setFilterProfession] = useState<string[]>([]);
  const [craftStations, setCraftStations] = useState<string[]>([]);
  const [filterCraftStations, setFilterCraftStations] = useState<string[]>([]);
  const [filterName, setFilterName] = useState<string>("");

  // Import all recipes from file
  const { jsonFiles } = useRestDb();
  const jsonRecipes = jsonFiles["crafting recipes"];
  const recipes = useMemo(() => getRecipes(jsonRecipes), [jsonRecipes]);

  // Update lists of professions and craft stations from recipes file
  useEffect(() => {
    setProfessions(
      recipes
        .map((t) => t.profession)
        .filter(filterUnique)
        .sort()
    );
    setCraftStations(
      recipes
        .map((t) => t.craftStation)
        .filter(filterUnique)
        .sort()
    );
  }, [recipes]);

  // Apply selected filters on list of recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(
      (t) =>
        filterByText(filterName, t.name) &&
        filterByIncludes(filterProfession, t.profession) &&
        filterByIncludes(filterCraftStations, t.craftStation)
    );
  }, [recipes, filterName, filterProfession, filterCraftStations]);

  return {
    professions,
    setProfessions,
    filterProfession,
    setFilterProfession,
    craftStations,
    setCraftStations,
    filterCraftStations,
    setFilterCraftStations,
    filterName,
    setFilterName,
    filteredRecipes,
  };
};
