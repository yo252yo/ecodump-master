import craftingRecipes from "../gameData/craftingRecipes";
import itemData from "../gameData/itemData";
import { ItemTypes } from "./constants";
import { filterUnique } from "./helpers";
export type Recipe = {
  key: string;
  untranslated: string;
  baseCraftTime: number;
  baseLaborCost: number;
  baseXPGain: number;
  craftStation?: string;
  defaultVariant: string;
  numberOfVariants: number;
  skillNeeds: { skill: string; level: number }[];
  variants: RecipeVariant[];
};
export type RecipeVariant = {
  key: string;
  name: string;
  ingredients: {
    tag: ItemTypes;
    name: string;
    ammount: number;
    isStatic: boolean;
    ammountM1: number;
    ammountM2: number;
    ammountM3: number;
    ammountM4: number;
    ammountM5: number;
  }[];
  products: {
    name: string;
    ammount: number;
  }[];
};
export type Item = {
  key: string;
  ingredientInRecipes: Recipe[];
  productInRecipes: Recipe[];
};
export type Items = { [key: string]: Item };
export type Recipes = { [key: string]: Recipe };

const newItem = (key: string) => ({
  key,
  ingredientInRecipes: [],
  productInRecipes: [],
});
export const formatNumber = (num: number) => +num.toFixed(2);
const multipliers = [1, 0.9, 0.75, 0.6, 0.55, 0.5];
const getMultiplierValue = (locked: boolean, value: number, index: number) =>
  formatNumber(value * (locked ? 1 : multipliers[index]));
const newRecipeIngredients = (
  tag: string,
  name: string,
  ammount: number,
  locked: boolean
) => ({
  tag,
  name,
  ammount,
  locked,
  ammountM1: getMultiplierValue(locked, ammount, 1),
  ammountM2: getMultiplierValue(locked, ammount, 2),
  ammountM3: getMultiplierValue(locked, ammount, 3),
  ammountM4: getMultiplierValue(locked, ammount, 4),
  ammountM5: getMultiplierValue(locked, ammount, 5),
});
const newRecipe = (key: string, value: any): Recipe => ({
  key,
  untranslated: value.untranslated,
  baseCraftTime: Number(value.baseCraftTime),
  baseLaborCost: Number(value.baseLaborCost),
  baseXPGain: Number(value.baseXPGain),
  craftStation: value.craftStn.length ? value.craftStn[0] : undefined,
  defaultVariant: value.defaultVariantUntranslated,
  numberOfVariants: Number(value.numberOfVariants),
  skillNeeds: value.skillNeeds.map((t: any) => ({
    skill: t[0],
    level: Number(t[1]),
  })),
  variants: Object.entries(value.variants).map(
    ([key, t]: [string, any], index) => ({
      // Fix to some key's being empty
      key: key.length > 0 ? key : `${t.products[0][0]}_${index}`,
      name: t.untranslated,
      ingredients: t.ingredients.map((ingredient: any) =>
        newRecipeIngredients(
          ingredient[0],
          ingredient[1],
          ingredient[2],
          ingredient[3] === "True"
        )
      ),
      products: t.products.map((product: any) => ({
        name: product[0],
        ammount: Number(product[1]),
      })),
    })
  ),
});

export const allItems = Object.keys(craftingRecipes.items).reduce(
  (prev, key) => ({ ...prev, [key]: newItem(key) }),
  {}
) as Items;

export const allRecipes = Object.entries(craftingRecipes.recipes).reduce(
  (prev, [key, value]: [string, any]) => ({
    ...prev,
    [key]: newRecipe(key, value),
  }),
  {}
) as Recipes;

const itemInRecipeIngredients = (recipe: Recipe, item: Item) =>
  recipe.variants.some((variant) =>
    variant.ingredients.some((ingredient) => ingredient.name === item.key)
  );
const itemInRecipeProducts = (recipe: Recipe, item: Item) =>
  recipe.variants.some((variant) =>
    variant.products.some((product) => product.name === item.key)
  );

Object.values(allItems).forEach((item: Item) => {
  item.ingredientInRecipes = Object.values(allRecipes).filter((recipe) =>
    itemInRecipeIngredients(recipe, item)
  );
  item.productInRecipes = Object.values(allRecipes).filter((recipe) =>
    itemInRecipeProducts(recipe, item)
  );
});

export const allProfessions = Object.values(allRecipes)
  .map((t) => t.skillNeeds.map((t) => t.skill))
  .flat()
  .filter(filterUnique)
  .sort();

export const allCraftStations = Object.values(allRecipes)
  .map((t) => t.craftStation ?? "")
  .filter((t) => t.length > 0)
  .filter(filterUnique)
  .sort();

export const allTags = itemData?.tags as Record<string, string[]>;
