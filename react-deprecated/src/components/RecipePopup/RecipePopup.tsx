import React, { useMemo } from "react";
import { formatNumber, RecipeVariant } from "../../utils/typedData";
import { Table, Divider } from "antd";
import useIngredientColumns, { Ing } from "./useIngredientColumns";
import useProductColumns, { Prod } from "./useProductColumns";
import { useAppContext } from "../../AppContext";
import RecipeCraftAmmount from "./RecipeCraftAmmount";
import RecipeMargin from "./RecipeMargin";
import { convertToMultiplier } from "../../utils/helpers";
import { ItemTypes } from "../../utils/constants";
import RecipeCraftSchema from "./RecipeCraftSchema";
import RecipeCraftModule from "./RecipeCraftModule";
import { RecipeCraftSchemaEnum } from "../../utils/constants";

const calcAmmount = (ammount: number, craftAmmout: number) => {
  return Math.ceil(ammount * craftAmmout) / craftAmmout;
};
const calcPrice = (ammount: number, price?: number) =>
  !price ? 0 : formatNumber(ammount * price);

type PropTypes = {
  description: string;
  recipe: RecipeVariant;
};

export default ({ recipe, description }: PropTypes) => {
  const {
    personalPrices,
    getRecipeCostPercentage,
    getRecipeCraftAmmount,
    getRecipeMargin,
    recipeCraftSchema,
  } = useAppContext();
  const ingredientColumns = useIngredientColumns(recipe.key);
  const productColumns = useProductColumns(recipe);
  const craftAmmount = getRecipeCraftAmmount(recipe.key);
  const marginMultiplier = convertToMultiplier(getRecipeMargin(recipe.key));

  // Finds unit price for each item and then calculate price of recipe ingredients based on module used
  const ingredients: Ing[] = useMemo(
    () =>
      recipe.ingredients
        .map((ing) => ({
          ...ing,
          price: personalPrices.find((price) => price.itemName === ing.name)
            ?.price,
        }))
        .map((ing) => ({
          ...ing,
          perModule: [
            Number(ing.ammount),
            ing.ammountM1,
            ing.ammountM2,
            ing.ammountM3,
            ing.ammountM4,
            ing.ammountM5,
          ].reduce((prev, baseAmmount, moduleLvl) => {
            const ammount = calcAmmount(baseAmmount, craftAmmount);
            const price = calcPrice(ammount, ing.price);
            return { ...prev, [moduleLvl]: { ammount, price } };
          }, {} as { [level: string]: { ammount: number; price: number } }),
        })),
    [craftAmmount, personalPrices, recipe.ingredients]
  );

  const totalIngredientCostsPerModule = useMemo(
    () =>
      ingredients.reduce(
        (prev, ing) =>
          Array.from(new Array(6)).reduce(
            (prev, next, i) => ({
              ...prev,
              [i]: prev[i] + ing.perModule[i].price,
            }),
            prev
          ),
        Array.from(new Array(6)).reduce(
          (prev, next, i) => ({
            ...prev,
            [i]: 0,
          }),
          {} as { [lvl: number]: number }
        )
      ),
    [ingredients]
  ) as { [lvl: number]: number };

  // Creates the final datasource for ingredients using the ingredients and adding a new row for the totals
  const datasourceIngredients = useMemo(
    () =>
      [
        ...ingredients,
        {
          tag: ItemTypes.COST,
          name: "TotalCost",
          perModule: Array.from(new Array(6)).reduce(
            (prev, next, i) => ({
              ...prev,
              [i]: {
                ammount: undefined,
                price: formatNumber(totalIngredientCostsPerModule[i]),
              },
            }),
            {} as { [lvl: number]: { ammount: number; price: number } }
          ),
        },
      ].map((t) => ({ ...t, key: t.name })),
    [ingredients, totalIngredientCostsPerModule]
  ) as Ing[];

  const recipeCostPercentage = useMemo(
    () => getRecipeCostPercentage(recipe),
    [getRecipeCostPercentage, recipe]
  );

  // Adds cost percentage and predicts price of products based on percentage
  const products = useMemo(
    () =>
      recipe.products.map((prod) => {
        const costPercent =
          recipeCostPercentage?.percentages?.find(
            (t) => t.productName === prod.name
          )?.percentage ?? 0;

        return {
          ...prod,
          key: prod.name,
          costPercent,
          perModule: Array.from(new Array(6)).reduce((prev, _, i) => {
            const costWithoutMargin =
              ((totalIngredientCostsPerModule[i] / prod.ammount) *
                costPercent) /
              100;
            return {
              ...prev,
              [i]: {
                costWithoutMargin: formatNumber(costWithoutMargin),
                costWithMargin: formatNumber(
                  costWithoutMargin * marginMultiplier
                ),
              },
            };
          }, {} as { [lvl: number]: { costWithMargin: number; costWithoutMargin: number } }),
          priceM0: formatNumber(
            (((totalIngredientCostsPerModule[0] / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM1: formatNumber(
            (((totalIngredientCostsPerModule[1] / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM2: formatNumber(
            (((totalIngredientCostsPerModule[2] / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM3: formatNumber(
            (((totalIngredientCostsPerModule[3] / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM4: formatNumber(
            (((totalIngredientCostsPerModule[4] / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          priceM5: formatNumber(
            (((totalIngredientCostsPerModule[5] / prod.ammount) * costPercent) /
              100) *
              marginMultiplier
          ),
          price: personalPrices.find((price) => price.itemName === prod.name)
            ?.price,
        };
      }),
    [
      marginMultiplier,
      personalPrices,
      recipe.products,
      recipeCostPercentage,
      totalIngredientCostsPerModule,
    ]
  ) as Prod[];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {description}
        <RecipeCraftSchema />
      </div>
      <Divider style={{ margin: "12px 0" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <RecipeCraftAmmount recipeName={recipe.key} />
        <div style={{ width: "40px" }}></div>
        {/* eslint-disable-next-line eqeqeq*/}
        {recipeCraftSchema == RecipeCraftSchemaEnum.SIMPLE && (
          <RecipeCraftModule recipeName={recipe.key} />
        )}
      </div>

      <Divider style={{ margin: "12px 0" }} />
      <RecipeMargin recipeName={recipe.key} />
      <Divider style={{ margin: "12px 0" }} />
      <h3>Ingredients</h3>
      <Table
        dataSource={datasourceIngredients}
        columns={ingredientColumns}
        pagination={false}
      />
      <div style={{ height: "40px" }}></div>
      <h3>Products</h3>
      <Table
        dataSource={products}
        columns={productColumns}
        pagination={false}
      />
    </div>
  );
};
