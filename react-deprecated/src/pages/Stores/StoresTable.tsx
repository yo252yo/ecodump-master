import { Table } from "antd";
import React, { useMemo } from "react";
import { useAppContext } from "../../AppContext";
import { filterUnique } from "../../utils/helpers";
import { useGetColumns } from "./useGetColumns";

export default () => {
  const { storesDb } = useAppContext();
  // Unique currency names for the filter
  const currencyNames = useMemo(
    () => [
      ...storesDb.Stores.map((t) => t.CurrencyName)
        .filter(filterUnique)
        .filter((t) => t.indexOf("Credit") <= 0),
      "Credit",
    ],
    [storesDb.Stores]
  );
  // Unique owner names for the filter
  const ownerNames = useMemo(
    () =>
      storesDb.Stores.map((t) => t.Owner)
        .filter(filterUnique)
        .filter((t) => !!t),
    [storesDb.Stores]
  );

  const columns = useGetColumns(currencyNames, ownerNames);
  return (
    <>
      {storesDb && storesDb.ExportedAt && (
        <p>
          Last exported on <b>{storesDb.ExportedAt.StringRepresentation}</b> GMT
        </p>
      )}
      <br />
      <Table
        dataSource={storesDb.Stores.sort((a, b) =>
          a.Balance > b.Balance ? -1 : 1
        ).map((t, i) => ({
          ...t,
          key: `${t.Name}_${i}`,
        }))}
        columns={columns}
      />
    </>
  );
};
