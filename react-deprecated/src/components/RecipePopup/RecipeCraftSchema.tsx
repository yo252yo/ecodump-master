import { Radio } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";
import { RecipeCraftSchemaEnum } from "../../utils/constants";

export default () => {
  const { recipeCraftSchema, setRecipeCraftSchema } = useAppContext();

  return (
    <Radio.Group
      value={`${recipeCraftSchema}`}
      onChange={(e) =>
        setRecipeCraftSchema(e.target.value as number as RecipeCraftSchemaEnum)
      }
    >
      <Radio.Button value={`${RecipeCraftSchemaEnum.SIMPLE}`}>
        Simple
      </Radio.Button>
      <Radio.Button value={`${RecipeCraftSchemaEnum.EXPANDED}`}>
        Expanded
      </Radio.Button>
    </Radio.Group>
  );
};
