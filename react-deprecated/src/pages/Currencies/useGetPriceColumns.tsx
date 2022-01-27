import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, InputNumber, Popconfirm, Tooltip } from "antd";
import { useAppContext } from "../../AppContext";
import { Currency, ItemPrice } from "../../types";
import { getColumn } from "../../utils/helpers";

export const useGetPriceColumns = () => {
  const { updatePrice } = useAppContext();

  return (currency: Currency) => [
    getColumn("itemName", "item"),
    {
      ...getColumn("price"),
      render: (price: number, itemPrice: ItemPrice) => {
        return (
          <InputNumber
            value={price}
            onChange={(value) => updatePrice(itemPrice.itemName, Number(value))}
          />
        );
      },
    },
    {
      ...getColumn("Actions"),
      render: (_: unknown, itemPrice: ItemPrice) => {
        return (
          <Tooltip title="Remove your fixed price for this item">
            <Popconfirm
              title="Are you sure to delete your fixed price?"
              onConfirm={() =>
                updatePrice(itemPrice.itemName, undefined, currency.name)
              }
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        );
      },
    },
  ];
};
