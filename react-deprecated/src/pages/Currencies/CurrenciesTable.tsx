import { Table } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { useGetColumns } from "./useGetColumns";

export default () => {
  const { currencyList } = useAppContext();
  const columns = useGetColumns();

  return (
    <Table
      dataSource={currencyList.currencies.map((t) => ({ ...t, key: t.name }))}
      columns={columns}
    />
  );
};
