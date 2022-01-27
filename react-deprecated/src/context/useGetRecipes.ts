import { useMemo } from "react";
import { getRecipes } from "../sdk/restDbSdk";
import { useQuery } from "react-query";
import { recipesKey } from "../utils/queryKeys";
import { ItemTypes, min30 } from "../utils/constants";
import {
  Recipes,
  Recipe,
  Items,
  Item,
  allItems as staticAllItems,
  allProfessions as staticAllProfessions,
  allCraftStations as staticAllCraftStations,
} from "../utils/typedData";
import { filterUnique } from "../utils/helpers";

export const formatNumber = (num: number) => +num.toFixed(2);
const multipliers = [1, 0.9, 0.75, 0.6, 0.55, 0.5];
const getMultiplierValue = (isStatic: boolean, value: number, index: number) =>
  formatNumber(value * (isStatic ? 1 : multipliers[index]));
const newRecipeIngredients = (ingredient: RecipeV1Ingredient) => ({
  tag: ingredient.Tag == null ? ItemTypes.ITEM : ItemTypes.TAG,
  name: ingredient.Tag == null ? ingredient.Name : ingredient.Tag,
  ammount: ingredient.Ammount,
  isStatic: ingredient.IsStatic,
  ammountM1: getMultiplierValue(ingredient.IsStatic, ingredient.Ammount, 1),
  ammountM2: getMultiplierValue(ingredient.IsStatic, ingredient.Ammount, 2),
  ammountM3: getMultiplierValue(ingredient.IsStatic, ingredient.Ammount, 3),
  ammountM4: getMultiplierValue(ingredient.IsStatic, ingredient.Ammount, 4),
  ammountM5: getMultiplierValue(ingredient.IsStatic, ingredient.Ammount, 5),
});
const newRecipe = (recipe: RecipeV1): Recipe => ({
  key: recipe.Key,
  untranslated: recipe.Untranslated,
  baseCraftTime: recipe.BaseCraftTime,
  baseLaborCost: recipe.BaseLaborCost,
  baseXPGain: recipe.BaseXPGain,
  craftStation: recipe.CraftStation.length ? recipe.CraftStation[0] : undefined,
  defaultVariant: recipe.DefaultVariant,
  numberOfVariants: recipe.NumberOfVariants,
  skillNeeds: recipe.SkillNeeds.map((t) => ({
    skill: t.Skill,
    level: t.Level,
  })),
  variants: recipe.Variants.map((t, index) => ({
    // Fix to some key's being empty
    key: t.Key.length > 0 ? t.Key : `${t.Products?.[0].Name}_${index}`,
    name: t.Name,
    ingredients: t.Ingredients.map(newRecipeIngredients),
    products: t.Products.map((product) => ({
      name: product.Name,
      ammount: product.Ammount,
    })),
  })),
});
const newItem = (key: string): Item => ({
  key,
  ingredientInRecipes: [],
  productInRecipes: [],
});
const addRecipeToIngredient = (
  allRecipesByItem: Items,
  itemKey: string,
  recipe: Recipe
) => {
  const item = allRecipesByItem[itemKey] ?? newItem(itemKey);
  item.ingredientInRecipes = [...item.ingredientInRecipes, recipe];
  return { ...allRecipesByItem, [itemKey]: item };
};
const addRecipeToProduct = (
  allRecipesByItem: Items,
  itemKey: string,
  recipe: Recipe
) => {
  const item = allRecipesByItem[itemKey] ?? newItem(itemKey);
  item.productInRecipes = [...item.productInRecipes, recipe];
  return { ...allRecipesByItem, [itemKey]: item };
};
const addRecipeToAllItems = (
  allRecipesByItem: Items,
  recipe: Recipe
): Items => {
  let clone = { ...allRecipesByItem };
  recipe.variants.forEach((variant) => {
    variant.ingredients.forEach((ingredient) => {
      clone = addRecipeToIngredient(clone, ingredient.name, recipe);
    });
    variant.products.forEach((product) => {
      clone = addRecipeToProduct(clone, product.name, recipe);
    });
  });
  return clone;
};

export default () => {
  const recipesDbResponse = useQuery(recipesKey, getRecipes, {
    staleTime: min30,
    cacheTime: min30,
  });

  const recipesData = recipesDbResponse?.data?.data?.data;

  const { allItems, allProfessions, allCraftStations } = useMemo(() => {
    const allRecipes = (recipesData?.reduce(
      (prev, recipe) => ({
        ...prev,
        [recipe.Key]: newRecipe(recipe),
      }),
      {}
    ) ?? {}) as Recipes;

    let allRecipesByItem = {} as Items;

    Object.values(allRecipes).forEach((recipe) => {
      allRecipesByItem = addRecipeToAllItems(allRecipesByItem, recipe);
    });

    const allProfessions = Object.values(allRecipes)
      .map((t) => t.skillNeeds.map((t) => t.skill))
      .flat()
      .filter(filterUnique)
      .sort();

    const allCraftStations = Object.values(allRecipes)
      .map((t) => t.craftStation ?? "")
      .filter((t) => t.length > 0)
      .filter(filterUnique)
      .sort();

    return { allItems: allRecipesByItem, allProfessions, allCraftStations };
  }, [recipesData]);

  if (recipesData === undefined) {
    return {
      allItems: staticAllItems,
      allProfessions: staticAllProfessions,
      allCraftStations: staticAllCraftStations,
    };
  }

  return {
    allItems,
    allProfessions,
    allCraftStations,
  };
};
