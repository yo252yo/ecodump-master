import { Button, Popover, Tooltip } from "antd";
import React, { useState } from "react";
import { CloseOutlined, TagOutlined } from "@ant-design/icons";
import ItemRecipesPopover from "../ItemRecipesPopover";
import { useAppContext } from "../../AppContext";

type PropTypes = {
  tag: string;
};
export default ({ tag }: PropTypes) => {
  const [visible, setVisible] = useState(false);
  const { allTags } = useAppContext();
  const itemsInTag = allTags[tag];

  if (!itemsInTag || itemsInTag.length === 0) {
    return <>{itemsInTag}</>;
  }

  const content = (
    <>
      {itemsInTag.map((itemKey) => {
        return (
          <div key={itemKey}>
            <ItemRecipesPopover itemName={itemKey} />
          </div>
        );
      })}
    </>
  );
  if (itemsInTag && itemsInTag.length === 1) {
    return content;
  }
  return (
    <Popover
      onVisibleChange={(vis) => setVisible(vis)}
      visible={visible}
      placement="bottom"
      content={content}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Items in tag</h3>
          <Button
            onClick={() => setVisible(false)}
            type="link"
            icon={<CloseOutlined />}
          />
        </div>
      }
      style={{ cursor: "pointer" }}
      trigger="click"
    >
      <Tooltip title="Show items in this tag">
        <Button type="link" className="nopadding">
          {tag}
          <TagOutlined />
        </Button>
      </Tooltip>
    </Popover>
  );
};
