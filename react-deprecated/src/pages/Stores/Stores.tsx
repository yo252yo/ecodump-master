import React from "react";
import { PageHeader } from "antd";
import StoresTable from "./StoresTable";

export default () => (
  <>
    <PageHeader
      title="Stores"
      subTitle="Here you can view all stores in the game and their buy / sell orders."
    />
    <StoresTable />
  </>
);
