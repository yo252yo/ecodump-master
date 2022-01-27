import React, { useState } from "react";
import { Button, Popover, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";

type PropTypes = {
  children: React.ReactNode;
  popupTitle: string;
  buttonText: string | React.ReactNode;
  buttonTooltip: string;
};

export default ({
  children,
  popupTitle,
  buttonText,
  buttonTooltip,
}: PropTypes) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      onVisibleChange={(vis) => setVisible(vis)}
      visible={visible}
      placement="bottom"
      content={visible && children}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{popupTitle}</h3>
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
      <Tooltip title={buttonTooltip}>
        <Button type="link" className="nopadding">
          {buttonText}
        </Button>
      </Tooltip>
    </Popover>
  );
};
