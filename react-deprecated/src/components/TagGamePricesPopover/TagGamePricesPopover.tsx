import { Button, Popover, Tooltip, Table } from "antd";
import React, { useState } from "react";
import { formatNumber } from "../../utils/typedData";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { getColumn } from "../../utils/helpers";
import { useAppContext } from "../../AppContext";
import ItemGamePricesPopover from "../ItemGamePricesPopup/ItemGamePricesPopover";

type PropTypes = {
  tag: string;
};
export default ({ tag }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const { updatePrice, gamePrices, allTags } = useAppContext();
  const itemsInTag = allTags[tag];

  if (!itemsInTag || itemsInTag.length === 0) {
    return <>{itemsInTag}</>;
  }

  const pricesOfItemsInTag = itemsInTag.map((itemKey: string) => {
    const itemGamePrices = gamePrices[itemKey] ?? [];
    const meanValueCalc = itemGamePrices
      .filter((t) => !t.Buying)
      .reduce(
        (agg1, next1) => ({
          sum: agg1.sum + next1.Price * next1.Quantity,
          count: agg1.count + next1.Quantity,
        }),
        { sum: 0, count: 0 } as { sum: number; count: number }
      );
    return {
      name: itemKey,
      itemGamePrices,
      meanPrice:
        meanValueCalc.count > 0
          ? formatNumber(meanValueCalc.sum / meanValueCalc.count)
          : undefined,
    };
  });

  if (
    !pricesOfItemsInTag ||
    pricesOfItemsInTag?.length === 0 ||
    pricesOfItemsInTag.reduce(
      (prev, t) => prev + t.itemGamePrices.length,
      0
    ) === 0
  ) {
    return <>NA</>;
  }

  const meanPrices = pricesOfItemsInTag
    .map((t) => t.meanPrice)
    .filter((t) => t !== undefined) as number[];
  const minMeanPrice =
    meanPrices.length > 0 ? Math.min.apply(null, meanPrices) : undefined;

  const columns = [
    getColumn("name"),
    {
      ...getColumn("meanPrice"),
      render: (meanPrice: number | undefined) => {
        if (meanPrice) {
          return (
            <Tooltip
              title={`Fix this calculated value as your price for tag ${tag}`}
            >
              <Button
                type="primary"
                onClick={() => updatePrice(tag, meanPrice)}
              >
                {meanPrice}
              </Button>
            </Tooltip>
          );
        }
        return <>?</>;
      },
    },
    {
      ...getColumn("name", "game prices"),
      render: (itemKey: string) => (
        <ItemGamePricesPopover itemKey={itemKey} tagName={tag} />
      ),
    },
  ];

  const content = (
    <Table
      dataSource={pricesOfItemsInTag}
      columns={columns}
      pagination={false}
    />
  );

  if (itemsInTag && itemsInTag.length === 1) {
    return content;
  }
  return (
    <>
      {minMeanPrice !== undefined && minMeanPrice >= 0 ? (
        <Tooltip
          title={`Fix this calculated value as your price for tag ${tag}`}
        >
          <Button type="primary" onClick={() => updatePrice(tag, minMeanPrice)}>
            {minMeanPrice}
          </Button>
        </Tooltip>
      ) : (
        "?"
      )}
      <Popover
        onVisibleChange={(vis) => setVisible(vis)}
        visible={visible}
        placement="bottom"
        content={content}
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Prices for items in tag {tag}</h3>
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
        <Tooltip
          title={`This is the smallest of the calculated mean prices for items in tag ${tag} (only sell orders are taken into account). Click to drill down into all available items in this tag. `}
        >
          <Button type="link">
            <QuestionCircleOutlined />
          </Button>
        </Tooltip>
      </Popover>
    </>
  );
};
