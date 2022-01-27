import React, { useState } from "react";
import { Button, Popover, Table, Tooltip } from "antd";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { GamePrice } from "../../types";
import { getColumn } from "../../utils/helpers";
import { useAppContext } from "../../AppContext";

type PropTypes = {
  itemKey: string;
  tagName?: string;
};
export default ({ itemKey, tagName }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const { updatePrice, gamePrices } = useAppContext();
  const itemGamePrices = gamePrices[itemKey] ?? [];

  if (!itemGamePrices) {
    return <></>;
  }

  if (itemGamePrices?.length === 0) {
    return <>NA</>;
  }

  const dataSource = (itemGamePrices ?? [])
    .sort((a, b) => {
      if (a.Buying === b.Buying) {
        return a.Quantity > b.Quantity ? -1 : 1;
      }
      return !a.Buying ? -1 : 1;
    })
    .map((t) => ({
      ...t,
      key: `${t.ItemName}-${t.store}-${t.Buying}-${t.Price}`,
    }));

  return (
    <Popover
      onVisibleChange={(vis) => setVisible(vis)}
      visible={visible}
      placement="bottom"
      content={
        <Table
          dataSource={dataSource}
          columns={[
            getColumn("store"),
            getColumn("storeOwner", "Store owner"),
            {
              ...getColumn("Price"),
              render: (price: number | undefined, gamePrice: GamePrice) => {
                return price === undefined ? (
                  <></>
                ) : (
                  <Tooltip
                    title={`Fix this value as the price for ${
                      tagName ?? gamePrice.ItemName
                    }`}
                  >
                    <Button
                      type="primary"
                      onClick={() =>
                        updatePrice(tagName ?? gamePrice.ItemName, price)
                      }
                    >
                      {price}
                    </Button>
                  </Tooltip>
                );
              },
            },
            getColumn("Quantity"),
            {
              ...getColumn("Buying"),
              render: (buying: boolean) =>
                buying ? "buy order" : "sell order",
            },
          ]}
        />
      }
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Game prices for {itemGamePrices?.[0].ItemName}</h3>
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
        title={`This is a calculated mean price for ${itemGamePrices?.[0].ItemName} (only sell orders are taken into account). Click to check all available prices fetched from ingame. `}
      >
        <Button type="link">
          <QuestionCircleOutlined />
        </Button>
      </Tooltip>
    </Popover>
  );
};
