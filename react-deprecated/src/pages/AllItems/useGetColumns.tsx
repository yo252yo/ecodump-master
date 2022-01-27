import { Select } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { getColumn } from "../../utils/helpers";
import { Item } from "../../utils/typedData";
import { InputNumber, Popconfirm, Tooltip, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ItemGamePricesPopup from "../../components/ItemGamePricesPopup";
import ItemRecipesPopover from "../../components/ItemRecipesPopover";

export const { Option } = Select;

export const useGetColumns = () => {
  const { personalPrices, updatePrice } = useAppContext();
  return [
    {
      ...getColumn("key", "Name"),
      render: (name: string) => <ItemRecipesPopover itemName={name} />,
    },
    getColumn("profAndCraftStations", "Profession/Craft station"),
    {
      ...getColumn("gamePrices", "Game prices"),
      render: (_: unknown, item: Item) => {
        return <ItemGamePricesPopup itemKey={item.key} />;
      },
    },
    {
      ...getColumn("price", "Fixed price"),
      render: (price: number, item: Item) => {
        return (
          <div style={{ display: "flex", flexWrap: "nowrap" }}>
            <InputNumber
              value={personalPrices.find((t) => t.itemName === item.key)?.price}
              width="20"
              onChange={(newPrice) => updatePrice(item.key, Number(newPrice))}
            />
            <Tooltip title="Reset price">
              <Popconfirm
                title="Are you sure to delete price?"
                onConfirm={() => updatePrice(item.key, undefined)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
