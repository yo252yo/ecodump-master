import { Select } from "antd";
import React from "react";
const { Option } = Select;

export default ({
  value,
  setValue,
  moduleName,
}: {
  value: number;
  setValue: (val: number) => void;
  moduleName: string;
}) => {
  return (
    <Select value={value} style={{ width: 200 }} onChange={setValue}>
      <Option value={0}>No module - 0%</Option>
      <Option value={1}>{moduleName} 1 - 10%</Option>
      <Option value={2}>{moduleName} 2 - 25%</Option>
      <Option value={3}>{moduleName} 3 - 40%</Option>
      <Option value={4}>{moduleName} 4 - 45%</Option>
      <Option value={5}>{moduleName} 5 - 50%</Option>
    </Select>
  );
};
