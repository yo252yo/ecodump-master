import { Form, PageHeader, Select, Tooltip } from "antd";
import React from "react";
import { useAppContext } from "../../AppContext";

const { Option } = Select;

type PropTypes = {
  title: string;
  subTitle: string;
};

export default ({ title, subTitle }: PropTypes) => {
  const { currencyList, setSelectedCurrency } = useAppContext();

  return (
    <PageHeader
      title={title}
      subTitle={subTitle}
      style={{ verticalAlign: "top" }}
      extra={
        <Form layout="vertical">
          <Form.Item
            key="selectedCurrency"
            label="Selected Currency"
            name="currency"
          >
            <Tooltip title="Selected currency is used to calculate prices on all items tab">
              <Select
                value={currencyList.selectedCurrency}
                placeholder="Selected currency"
                style={{ width: 120 }}
                onChange={setSelectedCurrency}
              >
                {currencyList.currencies.map((currency) => (
                  <Option key={currency.name} value={currency.name}>
                    {currency.name}
                  </Option>
                ))}
              </Select>
            </Tooltip>
          </Form.Item>
        </Form>
      }
    />
  );
};
