import { Slider, InputNumber, Tooltip, Radio } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { InfoCircleOutlined } from "@ant-design/icons";

type PropTypes = {
  recipeName: string;
};
export default ({ recipeName }: PropTypes) => {
  const { getRecipeMargin, updateRecipeMargin } = useAppContext();

  const recipeMargin = getRecipeMargin(recipeName);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>Recipe margin: </span>&nbsp;
      <InputNumber
        min={0}
        max={50}
        value={recipeMargin}
        onChange={(value) => updateRecipeMargin(recipeName, Number(value))}
        style={{ width: "60px" }}
      />
      &nbsp;%
      <div style={{ width: "40px" }}></div>
      <Radio.Group
        value={recipeMargin.toFixed(0)}
        onChange={(e) => updateRecipeMargin(recipeName, Number(e.target.value))}
      >
        <Radio.Button value="5">5%</Radio.Button>
        <Radio.Button value="10">10%</Radio.Button>
        <Radio.Button value="15">15%</Radio.Button>
        <Radio.Button value="20">20%</Radio.Button>
        <Radio.Button value="25">25%</Radio.Button>
      </Radio.Group>
      <div style={{ width: "20px" }}></div>
      <Slider
        min={0}
        max={50}
        value={getRecipeMargin(recipeName)}
        onChange={(value: number) => updateRecipeMargin(recipeName, value)}
        style={{ width: "200px", marginLeft: "20px" }}
      />
      <Tooltip title="Use this to add a profit margin to your prices. It's recomended you use lower margins like 5% on items that are sold a lot (ex: food, iron bars, building mats, etc) and higher margins like 20% on one time purchases (ex: cars, craft tables, etc).">
        <InfoCircleOutlined />
      </Tooltip>
    </div>
  );
};
