import React from "react";
import { getColumn } from "../../utils/helpers";
import StorePricesPopup from "./StorePricesPopup";

const filterMap = (t: string) => ({
  text: t,
  value: t,
});

const compareProtected = (a: string, b: string) =>
  !a ? 1 : !b ? -1 : a.localeCompare(b || "");

export const useGetColumns = (currencyNames: string[], owners: string[]) => {
  return [
    {
      ...getColumn("Name"),
      sorter: (a: StoresV1, b: StoresV1) => compareProtected(a.Name, b.Name),
    },
    {
      ...getColumn("Owner"),
      sorter: (a: StoresV1, b: StoresV1) => compareProtected(a.Owner, b.Owner),
      filters: owners.map(filterMap),
      onFilter: (value: string | number | boolean, record: StoresV1) =>
        record.Owner.includes(value as string),
    },
    {
      ...getColumn("CurrencyName", "Currency name"),
      filters: currencyNames.map(filterMap),
      onFilter: (value: string | number | boolean, record: StoresV1) =>
        record.CurrencyName.includes(value as string),
    },
    getColumn("Balance"),
    {
      ...getColumn("AllOffers", "Buy & Sell orders"),
      render: (allOffers: OffersV1[], store: StoresV1) => (
        <StorePricesPopup
          allOffers={allOffers}
          popupTitle={`Orders for store ${store.Name}`}
        />
      ),
    },
  ];
};
