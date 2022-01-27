import React from "react";
import { Select } from "antd";
import { useAppContext } from "../../AppContext";

const { Option } = Select;

export default () => {
  const {
    filterWithRecipe,
    filterCraftStations,
    setFilterCraftStations,
    allCraftStations,
  } = useAppContext();
  return (
    <Select
      value={filterCraftStations}
      onChange={setFilterCraftStations}
      mode="multiple"
      allowClear
      placeholder="Filter by crafting station"
      style={{ width: "80%" }}
      disabled={!filterWithRecipe}
    >
      {allCraftStations.map((craftStation: string) => (
        <Option key={craftStation} value={craftStation}>
          {craftStation}
        </Option>
      ))}
    </Select>
  );
};
