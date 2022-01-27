import React from "react";
import { Button, Popconfirm, Select, Tooltip } from "antd";
import {
  SelectOutlined,
  DeleteOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { Currency, GamePrice, ItemPrice } from "../../types";
import { getColumn } from "../../utils/helpers";
import { useAppContext } from "../../AppContext";
import GamePricesPopup from "./GamePricesPopup";
import ItemPricesPopup from "./ItemPricesPopup";

export const { Option } = Select;

export const useGetColumns = () => {
  const {
    currencyList,
    setSelectedCurrency,
    deleteCurrency,
    resetCurrency,
  } = useAppContext();
  return [
    getColumn("name"),
    getColumn("symbol"),
    {
      ...getColumn("gamePrices", "Game buy orders"),
      render: (gamePrices: GamePrice[], currency: Currency) => (
        <GamePricesPopup
          isBuy
          popupTitle="Buy orders on currency"
          gamePrices={gamePrices}
          currency={currency}
        />
      ),
    },
    {
      ...getColumn("gamePrices", "Game sell orders"),
      render: (gamePrices: GamePrice[], currency: Currency) => (
        <GamePricesPopup
          popupTitle="Sell orders on currency"
          gamePrices={gamePrices}
          currency={currency}
        />
      ),
    },
    {
      ...getColumn("itemPrices", "My Prices"),
      render: (itemPrices: ItemPrice[], currency: Currency) => {
        return <ItemPricesPopup itemPrices={itemPrices} currency={currency} />;
      },
    },
    {
      ...getColumn("Selected"),
      render: (_: unknown, currency: Currency) =>
        currency.name === currencyList.selectedCurrency && "Selected",
    },
    {
      ...getColumn("Actions"),
      render: (_: unknown, currency: Currency) => {
        return (
          <>
            {currency.name !== currencyList.selectedCurrency && (
              <Tooltip title="Select currency">
                <Button
                  icon={<SelectOutlined />}
                  onClick={() => setSelectedCurrency(currency.name)}
                />
              </Tooltip>
            )}
            {
              <Popconfirm
                title={`Are you sure to reset your prices for currency ${currency.name} with ${currency.itemPrices.length} prices?`}
                onConfirm={() => resetCurrency(currency.name)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Clear all prices">
                  <Button icon={<ClearOutlined />} />
                </Tooltip>
              </Popconfirm>
            }
            {currency.name !== currencyList.selectedCurrency && (
              <Popconfirm
                title={`Are you sure to delete currency with ${
                  currency.itemPrices?.length ?? 0
                } prices?`}
                onConfirm={() => deleteCurrency(currency.name)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>
            )}
          </>
        );
      },
    },
  ];
};
