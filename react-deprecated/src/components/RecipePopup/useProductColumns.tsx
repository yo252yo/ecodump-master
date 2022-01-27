import { Button, InputNumber, Tooltip } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { RecipeCraftSchemaEnum } from "../../utils/constants";
import { getColumn } from "../../utils/helpers";
import { RecipeVariant } from "../../utils/typedData";

export type Prod = {
  name: string;
  ammount: number;
  costPercent: number;
  perModule: {
    [lvl: number]: { costWithMargin: number; costWithoutMargin: number };
  };
};

export default (recipe: RecipeVariant) => {
  const {
    updatePrice,
    updateRecipeCostPercentage,
    recipeCraftSchema,
    getRecipeCraftModule,
  } = useAppContext();

  const commonColumns = [
    getColumn("name"),
    getColumn("ammount"),
    {
      ...getColumn("costPercent", "Cost Percentage"),
      render: (costPercent: number, item: Prod) => {
        return (
          <Tooltip title="Cost percentage is used to distribute the cost of the recipe by the output products to help you calculate how much you should charge for each product.">
            <InputNumber
              value={costPercent}
              width="20"
              onChange={(value) =>
                updateRecipeCostPercentage(recipe, item.name, Number(value))
              }
            />
          </Tooltip>
        );
      },
    },
  ];

  // eslint-disable-next-line eqeqeq
  if (recipeCraftSchema == RecipeCraftSchemaEnum.SIMPLE) {
    const module = getRecipeCraftModule(recipe.key);

    return [
      ...commonColumns,
      {
        ...getColumn("Production Cost"),
        render: (_: any, item: Prod) => (
          <Tooltip
            title={`Calculated production cost for this product (sum of ingredients price without margin)`}
          >
            {item.perModule[module].costWithoutMargin}
          </Tooltip>
        ),
      },
      {
        ...getColumn("Calculated Price"),
        render: (_: any, item: Prod) => (
          <Tooltip
            title={`Calculated price for this product (cost of ingredients plus profit margin)`}
          >
            <Button
              onClick={() =>
                updatePrice(item.name, item.perModule[module].costWithMargin)
              }
              type="primary"
            >
              {item.perModule[module].costWithMargin}
            </Button>
          </Tooltip>
        ),
      },
    ];
  }

  return [
    ...commonColumns,
    {
      ...getColumn("priceM0", "M0"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using no module. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price}
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM1", "M1"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 1. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM2", "M2"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 2. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM3", "M3"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 3. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM4", "M4"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 4. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("priceM5", "M5"),
      render: (price: number, item: { name: string }) => (
        <Tooltip
          title={`Calculated value for this product if item was produced using a module level 5. Click to fix this value as the price for ${item.name}`}
        >
          <Button onClick={() => updatePrice(item.name, price)} type="primary">
            {price} $
          </Button>
        </Tooltip>
      ),
    },
    {
      ...getColumn("price"),
      render: (price: number | undefined, item: { name: string }) => {
        return (
          <Tooltip title="Update your fixed price for this item">
            <InputNumber
              value={price}
              width="20"
              onChange={(newPrice) => updatePrice(item.name, Number(newPrice))}
            />
          </Tooltip>
        );
      },
    },
  ];
};
