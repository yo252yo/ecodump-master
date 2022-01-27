import { InputNumber, Tooltip } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { getColumn } from "../../utils/helpers";
import ItemRecipesPopover from "../ItemRecipesPopover";
import TagItemsPopover from "../TagItemsPopover";
import ItemGamePricesPopup from "../ItemGamePricesPopup";
import TagGamePricesPopover from "../TagGamePricesPopover";
import { ItemTypes, RecipeCraftSchemaEnum } from "../../utils/constants";

export type Ing = {
  name: string;
  perModule: {
    [moduleLevel: number]: {
      ammount: number;
      price: number;
    };
  };
  tag: ItemTypes;
};
const renderPrice = (
  moduleLevel: number,
  itemName: string,
  currencySymbol: string,
  ammount?: number,
  price?: number
) => {
  const module =
    moduleLevel === 0 ? "no module" : `a module level ${moduleLevel}`;
  if (!ammount) {
    // This is for the cost row
    return (
      <Tooltip
        title={`Sum of all the item costs for this recipe using ${module}`}
      >
        {price} {currencySymbol}
      </Tooltip>
    );
  }
  return (
    <Tooltip
      title={`Using ${module} you will need ${ammount} ${itemName}. ${
        !price
          ? ""
          : `At current price that will cost you ${price} ${currencySymbol}`
      }`}
    >
      {ammount} {price ? `(${price}${currencySymbol})` : ""}
    </Tooltip>
  );
};

export default (recipeKey: string) => {
  const {
    updatePrice,
    currencySymbol,
    recipeCraftSchema,
    getRecipeCraftModule,
  } = useAppContext();

  const commonColumns = [
    {
      ...getColumn("name"),
      render: (name: string, item: Ing) => {
        switch (item.tag) {
          case ItemTypes.TAG:
            return <TagItemsPopover tag={name} />;
          case ItemTypes.ITEM:
            return <ItemRecipesPopover itemName={name} />;
          default:
            return <>{name}</>;
        }
      },
    },
    {
      ...getColumn("gamePrices", "Game prices"),
      render: (_: unknown, item: Ing) => {
        switch (item.tag) {
          case ItemTypes.TAG:
            return <TagGamePricesPopover tag={item.name} />;
          case ItemTypes.ITEM:
            return <ItemGamePricesPopup itemKey={item.name} />;
          default:
            return null;
        }
      },
    },
    {
      ...getColumn("price"),
      render: (price: number | undefined, item: Ing) => {
        if (item.tag === ItemTypes.COST) return;
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

  // eslint-disable-next-line eqeqeq
  if (recipeCraftSchema == RecipeCraftSchemaEnum.SIMPLE) {
    const module = getRecipeCraftModule(recipeKey);

    return [
      ...commonColumns,
      {
        ...getColumn("Item ammount"),
        render: (_: any, item: Ing) => item.perModule[module]?.ammount,
      },
      {
        ...getColumn("Price"),
        render: (_: any, item: Ing) => item.perModule[module]?.price,
      },
    ];
  }

  return [
    ...commonColumns,
    {
      ...getColumn("M0"),
      render: (_: any, item: Ing) =>
        renderPrice(
          0,
          item.name,
          currencySymbol,
          item.perModule[0].ammount,
          item.perModule[0].price
        ),
    },
    {
      ...getColumn("M1"),
      render: (_: any, item: Ing) =>
        renderPrice(
          1,
          item.name,
          currencySymbol,
          item.perModule[1].ammount,
          item.perModule[1].price
        ),
    },
    {
      ...getColumn("M2"),
      render: (_: any, item: Ing) =>
        renderPrice(
          2,
          item.name,
          currencySymbol,
          item.perModule[2].ammount,
          item.perModule[2].price
        ),
    },
    {
      ...getColumn("M3"),
      render: (_: any, item: Ing) =>
        renderPrice(
          3,
          item.name,
          currencySymbol,
          item.perModule[3].ammount,
          item.perModule[3].price
        ),
    },
    {
      ...getColumn("M4"),
      render: (_: any, item: Ing) =>
        renderPrice(
          4,
          item.name,
          currencySymbol,
          item.perModule[4].ammount,
          item.perModule[4].price
        ),
    },
    {
      ...getColumn("M5"),
      render: (_: any, item: Ing) =>
        renderPrice(
          5,
          item.name,
          currencySymbol,
          item.perModule[5].ammount,
          item.perModule[5].price
        ),
    },
  ];
};
