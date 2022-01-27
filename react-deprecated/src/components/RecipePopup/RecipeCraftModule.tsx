import { Radio, Tooltip } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { InfoCircleOutlined } from "@ant-design/icons";

type PropTypes = {
  recipeName: string;
};
export default ({ recipeName }: PropTypes) => {
  const { getRecipeCraftModule, updateRecipeCraftModule } = useAppContext();

  return (
    <div>
      <span>Upgrade module:</span> &nbsp;
      <Radio.Group
        value={getRecipeCraftModule(recipeName).toFixed(0)}
        onChange={(e) =>
          updateRecipeCraftModule(recipeName, Number(e.target.value))
        }
      >
        <Radio.Button value="0">M0</Radio.Button>
        <Radio.Button value="1">M1</Radio.Button>
        <Radio.Button value="2">M2</Radio.Button>
        <Radio.Button value="3">M3</Radio.Button>
        <Radio.Button value="4">M4</Radio.Button>
        <Radio.Button value="5">M5</Radio.Button>
      </Radio.Group>
      &nbsp;&nbsp;
      <Tooltip title="The upgrade module level you are using for this recipe. This is used to properly calculate the cost reductions. M0 = no module, M1 = module lvl 1, and so on.">
        <InfoCircleOutlined />
      </Tooltip>
    </div>
  );
};
