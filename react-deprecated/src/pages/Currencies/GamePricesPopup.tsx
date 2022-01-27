import React, { useState } from "react";
import { Button, Popover, Table, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Currency, GamePrice } from "../../types";
import { getColumn } from "../../utils/helpers";

type PropTypes = {
  isBuy?: boolean;
  popupTitle: string;
  gamePrices: GamePrice[];
  currency: Currency;
};
export default ({ isBuy, popupTitle, gamePrices, currency }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const prices = (gamePrices ?? [])
    .filter((t) => t.Buying === (isBuy ?? false))
    .map((t) => ({
      ...t,
      key: t.ItemName,
    }))
    .sort((a, b) => a.ItemName.localeCompare(b.ItemName));
  return (
    <>
      <Popover
        onVisibleChange={(vis) => setVisible(vis)}
        visible={visible}
        placement="bottom"
        content={
          <Table
            dataSource={prices}
            columns={[
              getColumn("ItemName", "Item"),
              getColumn("store"),
              getColumn("storeOwner", "Store owner"),
              getColumn("Price"),
              getColumn("Quantity"),
            ]}
          />
        }
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>
              {popupTitle} {currency.name}
            </h3>
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
          title={`List all the ${
            isBuy ? "buy" : "sell"
          } orders fetched from game`}
        >
          <Button type="link">{prices?.length ?? 0}</Button>
        </Tooltip>
      </Popover>
      game prices
    </>
  );
};
