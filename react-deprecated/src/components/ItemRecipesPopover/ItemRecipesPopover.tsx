import { Button, Popover, Tooltip } from "antd";
import React, { useState } from "react";
import { Item } from "../../utils/typedData";
import RecipePopup from "../RecipePopup";
import { CloseOutlined, CaretDownOutlined } from "@ant-design/icons";
import PopupWrapper from "../PopupWrapper";
import { useAppContext } from "../../AppContext";
type PropTypes = {
  itemName: string;
};
export default ({ itemName }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const { allItems } = useAppContext();
  const variants =
    (
      Object.values(allItems)
        .find((item: Item) => item.key === itemName)
        ?.productInRecipes?.map((recipe) =>
          recipe.variants.map((variant) => ({
            ...variant,
            craftStation: recipe.craftStation,
            skillNeeds: recipe.skillNeeds,
          }))
        ) ?? []
    ).flat() ?? [];

  if (!variants || variants.length === 0) {
    return <>{itemName}</>;
  }

  const hasSingleVariant = variants && variants.length === 1;
  const content = (
    <>
      {variants.map((recipeVariant, index) => {
        const requirements = `${
          recipeVariant.skillNeeds?.length === 0
            ? "None"
            : `Required ${recipeVariant.skillNeeds?.[0].skill} lvl ${recipeVariant.skillNeeds?.[0].level}`
        } @ ${recipeVariant.craftStation ?? "None"}`;
        return (
          <div key={recipeVariant.key}>
            <PopupWrapper
              popupTitle={`Recipe ${recipeVariant.name}`}
              buttonText={!hasSingleVariant ? recipeVariant.name : itemName}
              buttonTooltip={`Click to calculate the item price using the recipe ${recipeVariant.name} in a popover`}
            >
              <RecipePopup description={requirements} recipe={recipeVariant} />
            </PopupWrapper>

            {!hasSingleVariant && `(${requirements})`}
          </div>
        );
      })}
    </>
  );
  if (variants && variants.length === 1) {
    return content;
  }
  return (
    <Popover
      onVisibleChange={(vis) => setVisible(vis)}
      visible={visible}
      placement="bottom"
      content={content}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Recipes</h3>
          <Button
            onClick={() => setVisible(false)}
            type="link"
            icon={<CloseOutlined />}
          />
        </div>
      }
      style={{ cursor: "pointer" }}
      trigger="click"
    >
      <Tooltip title="Show recipes for this item">
        <Button type="link" className="nopadding">
          {itemName}
          <CaretDownOutlined />
        </Button>
      </Tooltip>
    </Popover>
  );
};
