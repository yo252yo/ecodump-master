import React, { useState } from "react";
import { Button, Modal, message, Input, Form, Select } from "antd";
import { useAppContext } from "../../AppContext";
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default () => {
  const [form] = Form.useForm();
  const { currencyList, addNewCurrency } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      addNewCurrency(values.name, values.symbol, values.currency);

      setIsModalVisible(false);
      message.success({
        content: `New currency ${values.name} created.`,
      });
    });
  };

  return (
    <div style={{ textAlign: "right", padding: "1rem" }}>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        New currency
      </Button>
      <Modal
        title="Add a new currency"
        visible={isModalVisible}
        okText="Create"
        cancelText="Cancel"
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Form {...layout} form={form} name="basic">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the currency name!",
                max: 50,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Symbol"
            name="symbol"
            rules={[
              {
                required: true,
                message:
                  "Please input a symbol. Should identify currency in 1 or 2 characters",
                max: 2,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Duplicate prices from" name="currency">
            <Select>
              {currencyList.currencies.map((currency) => (
                <Option key={currency.name} value={currency.name}>
                  {currency.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
