import React from "react";
import { Radio } from "antd";
import { useAppContext } from "../../AppContext";

export default () => {
  const { filterCredits, setFilterCredits } = useAppContext();
  return (
    <Radio.Group
      options={[
        { label: "Hide personal credits", value: `${true}` },
        { label: "Show personal credits", value: `${false}` },
      ]}
      onChange={(e) => setFilterCredits(e.target.value === `${true}`)}
      value={`${filterCredits}`}
      optionType="button"
      buttonStyle="solid"
    />
  );
};
