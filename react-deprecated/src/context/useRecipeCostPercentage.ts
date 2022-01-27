import { useCallback } from "react";
import { RecipeCostPercentage, RecipeCostProdPercentage } from "../types";
import { recipeCostPercentagesKey } from "../utils/queryKeys";
import useLocalStorage from "./useLocalStorage";
import { RecipeVariant } from "../utils/typedData";

// Fixes percentages so that the sum is 100%
const fixPercentages = (
  prodName: string,
  newPercentage: number,
  percentages: RecipeCostProdPercentage[]
) => {
  let sum = newPercentage;
  return percentages.map((t, index) => {
    let percentage = t.productName === prodName ? newPercentage : t.percentage;
    if (t.productName !== prodName) {
      if (sum + percentage > 100) {
        percentage = 100 - sum;
      }
      sum += percentage;
    }
    if (index === percentages.length - 1) {
      percentage += 100 - sum;
    }
    return {
      ...t,
      percentage,
    };
  });
};

// When user hasn't picked cost percentages yet, we divide those percentages even
const getRecipeEvenPercentages = (recipe: RecipeVariant) => {
  const evenPercent = 100 / recipe.products.length;
  return {
    recipeKey: recipe.key,
    percentages: recipe.products.map((prod, index) => ({
      productName: prod.name,
      percentage:
        index !== recipe.products.length - 1
          ? evenPercent
          : 100 - (recipe.products.length - 1) * evenPercent,
    })),
  };
};

export default () => {
  const [recipeCostPercentages, setRecipeCostPercentages] = useLocalStorage<
    RecipeCostPercentage[]
  >(recipeCostPercentagesKey, []);

  const getRecipeCostPercentage = useCallback(
    (recipe: RecipeVariant) => {
      const currentRecipeCostPercentages = recipeCostPercentages.find(
        (t) => t.recipeKey === recipe.key
      );

      return currentRecipeCostPercentages || getRecipeEvenPercentages(recipe);
    },
    [recipeCostPercentages]
  );

  const updateRecipeCostPercentage = useCallback(
    (recipe: RecipeVariant, prodName: string, newPercentage: number) => {
      setRecipeCostPercentages((prevRecipeCostPercentages) => {
        const recipeCostPercentageIndex = prevRecipeCostPercentages.findIndex(
          (t) => t.recipeKey === recipe.key
        );

        const recipeCostPercentages =
          prevRecipeCostPercentages[recipeCostPercentageIndex] ||
          getRecipeEvenPercentages(recipe);

        const newItemPercentages = {
          ...recipeCostPercentages,
          percentages: fixPercentages(
            prodName,
            newPercentage,
            recipeCostPercentages.percentages
          ),
        };

        return [
          ...prevRecipeCostPercentages.slice(0, recipeCostPercentageIndex),
          newItemPercentages,
          ...prevRecipeCostPercentages.slice(recipeCostPercentageIndex + 1),
        ];
      });
    },
    [setRecipeCostPercentages]
  );

  return {
    getRecipeCostPercentage,
    updateRecipeCostPercentage,
  };
};
