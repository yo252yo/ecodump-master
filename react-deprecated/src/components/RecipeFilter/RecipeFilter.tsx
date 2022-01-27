import React from "react";
import { Radio } from "antd";
import { useAppContext } from "../../AppContext";

export default () => {
  const { filterWithRecipe, setFilterWithRecipe } = useAppContext();
  return (
    <Radio.Group
      options={[
        { label: "Without recipe", value: `${false}` },
        { label: "With recipe", value: `${true}` },
      ]}
      onChange={(e) => setFilterWithRecipe(e.target.value === `${true}`)}
      value={`${filterWithRecipe}`}
      optionType="button"
      buttonStyle="solid"
    />
  );
};
