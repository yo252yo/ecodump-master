import React from "react";
import { Button, Tooltip } from "antd";
import { useAppContext } from "../../AppContext";
import { formatNumber } from "../../utils/typedData";
import ItemGamePricesPopover from "./ItemGamePricesPopover";

type PropTypes = {
  itemKey: string;
};
export default ({ itemKey }: PropTypes) => {
  const { updatePrice, gamePrices } = useAppContext();
  const itemGamePrices = gamePrices[itemKey] ?? [];

  if (!itemGamePrices) {
    return <></>;
  }

  if (itemGamePrices?.length === 0) {
    return <>NA</>;
  }

  const meanValueCalc = itemGamePrices
    .filter((t) => !t.Buying)
    .reduce(
      (agg, next) => ({
        sum: agg.sum + next.Price * next.Quantity,
        count: agg.count + next.Quantity,
      }),
      { sum: 0, count: 0 } as { sum: number; count: number }
    );
  const calculatedPrice =
    meanValueCalc.count > 0
      ? formatNumber(meanValueCalc.sum / meanValueCalc.count)
      : undefined;

  return (
    <div style={{ display: "flex", flexWrap: "nowrap" }}>
      {calculatedPrice !== undefined ? (
        <Tooltip
          title={`Fix this calculated value as your price for ${itemKey}`}
        >
          <Button
            type="primary"
            onClick={() => updatePrice(itemKey, calculatedPrice)}
          >
            {calculatedPrice}
          </Button>
        </Tooltip>
      ) : (
        "?"
      )}

      <ItemGamePricesPopover itemKey={itemKey} />
    </div>
  );
};
