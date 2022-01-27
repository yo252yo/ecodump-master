import React, { useState } from "react";
import { Button, Popover, Table, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { getColumn } from "../../utils/helpers";

type PropTypes = {
  popupTitle: string;
  allOffers: OffersV1[];
};

const sellColumns = [
  getColumn("ItemName", "For sale"),
  getColumn("Price"),
  getColumn("Quantity"),
];

const buyColumns = [
  getColumn("ItemName", "Purchasing"),
  getColumn("Price"),
  getColumn("MaxNumWanted", "Max wanted"),
];
export default ({ popupTitle, allOffers }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const offers = allOffers.map((t) => ({
    ...t,
    key: t.ItemName,
  }));
  const buyOffers = offers.filter((t) => t.Buying);
  const sellOffers = offers.filter((t) => !t.Buying);
  return (
    <>
      <Popover
        onVisibleChange={(vis) => setVisible(vis)}
        visible={visible}
        placement="bottom"
        content={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <Table dataSource={sellOffers} columns={sellColumns} />
            <div style={{ width: "20px" }}></div>
            <Table dataSource={buyOffers} columns={buyColumns} />
          </div>
        }
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{popupTitle}</h3>
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
          title={`List all the shop buy and sell orders fetched from game`}
        >
          <Button type="link">{offers.length}</Button>
        </Tooltip>
      </Popover>
      offers
    </>
  );
};
