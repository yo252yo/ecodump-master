import classNames from "classnames";
import { createEffect, createMemo, For } from "solid-js";
import Accordion from "../../../components/Accordion/Accordion";
import Button from "../../../components/Button";
import PersonalPrice from "../../../components/PersonalPrice";
import Tooltip from "../../../components/Tooltip";
import { useMainContext } from "../../../hooks/MainContext";
import { getFlatRecipeIngredients, joinPath } from "../../../utils/recipeHelper";
import { useCalcContext } from "../context/CalcContext";
import RecipePicker from "./RecipePicker";
import RecipeTreeCheckboxes from "./RecipeTreeCheckboxes";

export default () => {
  const { allCraftableProducts, tagsResource, mainState } = useMainContext();
  const { priceCalcStore } = useCalcContext();
  const flatRecipeIngredients = createMemo(() =>
    getFlatRecipeIngredients(
      allCraftableProducts() ?? [],
      priceCalcStore.selectedRecipes(),
      tagsResource() ?? {},
      priceCalcStore.selectedProduct() ?? ""
    )
  );
  const pathJoined = createMemo(() => joinPath(priceCalcStore.state.focusedProdPath));
  return (
    <Accordion
      notCollapsible
      startsOpen
      headerText={
        <span>
          Recipe tree for product{" "}
          <span class="font-bold">{priceCalcStore.selectedProduct()}</span>
        </span>
      }
      class="mt-4"
    >
      <div class="relative">
        <For each={flatRecipeIngredients()}>
          {(recipe) => (
            <div
              class="mt-1 flex items-center"
              style={{ "margin-left": `${recipe.level * 30}px` }}
            >
              {recipe.recipeVariants.length > 0 && (
                <Tooltip noStyle text="Click to calculate price">
                  <Button
                  class={classNames("inline-block py-1 px-4", {
                    "bg-gray-300": joinPath(recipe.path) === pathJoined(),
                  })}
                    onClick={() =>
                      priceCalcStore.update.replaceFocusedProductPath(recipe.path)
                    }
                  >
                      {recipe.productName}
                  </Button>
                </Tooltip>
              )}
              {recipe.recipeVariants.length === 0 && (
                <div class="inline-block py-1 px-4">
                  {recipe.productName}
                </div>
              )}
              {((priceCalcStore.state.showRecipes &&
                recipe.recipeVariants?.length) ??
                0) > 0 && <span class="ml-2">with recipe</span>}
              {priceCalcStore.state.showRecipes && (
                <RecipePicker
                  selectedValue={recipe.selectedVariant?.Variant.Key ?? ""}
                  recipeVariants={recipe.recipeVariants}
                  setSelected={(selected: string) =>
                    priceCalcStore.setSelectedRecipes((prev) => ({
                      ...prev,
                      [recipe.ingredientId]: selected,
                    }))
                  }
                />
              )}
              {priceCalcStore.state.showRecipes &&
                !!recipe.selectedVariant?.Variant.Key && (
                  <>
                    at table
                    <span class="border rounded px-2 py-1 ml-2 font-normal">
                      {
                        recipe.recipeVariants.find(
                          (t) =>
                            t.Variant.Key ===
                              recipe.selectedVariant?.Variant.Key ?? ""
                        )?.Recipe.CraftStation[0]
                      }
                    </span>
                  </>
                )}
              {priceCalcStore.state.showPersonalPrices && (
                <>
                  <span class="ml-2">for</span>
                  <PersonalPrice
                    class="mx-2"
                    personalPriceId={recipe.ingredientId}
                  />
                  {mainState.currency}
                </>
              )}
            </div>
          )}
        </For>
        <RecipeTreeCheckboxes />
      </div>
    </Accordion>
  );
};
