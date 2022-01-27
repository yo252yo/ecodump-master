import React from "react";
import { Input } from "antd";
import { useAppContext } from "../../AppContext";

export default () => {
  const { filterName, setFilterName } = useAppContext();
  return (
    <Input
      value={filterName}
      onChange={(evt) => setFilterName(evt.target.value)}
      placeholder="Filter by name"
      style={{ width: "80%", textAlign: "center" }}
    />
  );
};
