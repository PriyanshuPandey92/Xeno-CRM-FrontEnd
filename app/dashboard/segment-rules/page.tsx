"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Card,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Tag,
  Alert,
  Tooltip,
} from "antd";
import { 
  PlusOutlined, 
  MinusCircleOutlined, 
  InfoCircleOutlined,
  SettingOutlined,
  CheckCircleOutlined 
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Predefined field options for better UX
  const fieldOptions = [
    { value: "spend", label: "Total Spend", description: "Customer's total spending amount" },
    { value: "visits", label: "Visit Count", description: "Number of store/website visits" },
    { value: "orders", label: "Order Count", description: "Total number of orders placed" },
    { value: "lastVisit", label: "Days Since Last Visit", description: "Days since customer's last interaction" },
    { value: "avgOrderValue", label: "Average Order Value", description: "Average value per order" },
    { value: "loyaltyPoints", label: "Loyalty Points", description: "Current loyalty program points" },
  ];

  const operatorOptions = [
    { value: ">", label: "Greater than (>)" },
    { value: "<", label: "Less than (<)" },
    { value: ">=", label: "Greater than or equal (≥)" },
    { value: "<=", label: "Less than or equal (≤)" },
    { value: "=", label: "Equal to (=)" },
    { value: "!=", label: "Not equal to (≠)" },
  ];

  const handleSubmit = async (values: any) => {
    console.log("Form Values:", values);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segmentRules/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("googleIdToken")}`,
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      if (data.success) {
        message.success("Segment rule created successfully!");
        form.resetFields();
      } else {
        message.error("Failed to create segment rule. Please try again.");
      }
    } catch (error) {
      console.error("Error creating segment rule:", error);
      message.error("An error occurred while creating the segment rule.");
    }
    setLoading(false);
  };

  const getLogicTypeDescription = (type: string) => {
    return type === "AND" 
      ? "All conditions must be met for a customer to match this segment"
      : "At least one condition must be met for a customer to match this segment";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <SettingOutlined className="text-2xl text-blue-600" />
          </div>
          <Title level={1} className="mb-2">Create Segment Rule</Title>
          <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
            Define intelligent customer segmentation rules to better target your audience 
            and improve campaign effectiveness.
          </Paragraph>
        </div>

        <Card
          className="shadow-lg border-0"
          style={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
            
            {/* Logic Type Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Title level={4} className="mb-0">Logic Configuration</Title>
                <Tooltip title="Choose how conditions should be evaluated">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              
              <Form.Item
                name="logicType"
                rules={[{ required: true, message: "Please select a logic type" }]}
              >
                <Select
                  placeholder="Select logic type"
                  className="w-full"
                  optionLabelProp="label"
                >
                  <Option value="AND" label={<><Tag color="blue">AND</Tag> All conditions</>}>
                    <div className="py-2">
                      <div className="font-medium">AND Logic</div>
                      <div className="text-sm text-gray-500">
                        All conditions must be satisfied
                      </div>
                    </div>
                  </Option>
                  <Option value="OR" label={<><Tag color="green">OR</Tag> Any condition</>}>
                    <div className="py-2">
                      <div className="font-medium">OR Logic</div>
                      <div className="text-sm text-gray-500">
                        At least one condition must be satisfied
                      </div>
                    </div>
                  </Option>
                </Select>
              </Form.Item>
            </div>

            <Divider />

            {/* Conditions Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Title level={4} className="mb-0">Segmentation Conditions</Title>
                <Tooltip title="Add conditions to define your customer segment">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              
              <Alert
                message="Pro Tip"
                description="Start with broader conditions and add more specific ones to fine-tune your segment."
                type="info"
                showIcon
                className="mb-6"
                style={{ borderRadius: '8px' }}
              />

              <Form.List name="conditions">
                {(fields, { add, remove }) => (
                  <>
                    {fields.length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <SettingOutlined className="text-4xl text-gray-300 mb-4" />
                        <Text className="text-gray-500">No conditions added yet</Text>
                        <br />
                        <Text className="text-sm text-gray-400">Click "Add Condition" to get started</Text>
                      </div>
                    )}

                    {fields.map(({ key, name, ...restField }, index) => (
                      <Card
                        key={key}
                        size="small"
                        className="mb-4 border border-gray-200 hover:border-blue-300 transition-colors"
                        style={{ borderRadius: '8px' }}
                        title={
                          <div className="flex items-center gap-2">
                            <CheckCircleOutlined className="text-blue-500" />
                            <Text strong>Condition {index + 1}</Text>
                          </div>
                        }
                        extra={
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            className="hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        }
                      >
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "field"]}
                              label="Customer Field"
                              rules={[{ required: true, message: "Please select a field" }]}
                              className="mb-0"
                            >
                              <Select
                                placeholder="Select field"
                                optionLabelProp="label"
                              >
                                {fieldOptions.map(option => (
                                  <Option key={option.value} value={option.value} label={option.label}>
                                    <div>
                                      <div className="font-medium">{option.label}</div>
                                      <div className="text-sm text-gray-500">{option.description}</div>
                                    </div>
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "op"]}
                              label="Operator"
                              rules={[{ required: true, message: "Please select an operator" }]}
                              className="mb-0"
                            >
                              <Select
                                placeholder="Select operator"
                                optionLabelProp="label"
                              >
                                {operatorOptions.map(option => (
                                  <Option key={option.value} value={option.value} label={option.label}>
                                    {option.label}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col xs={24} sm={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "value"]}
                              label="Value"
                              rules={[{ required: true, message: "Please enter a value" }]}
                              className="mb-0"
                            >
                              <Input
                                placeholder="Enter value"
                                type="number"
                                style={{ borderRadius: '6px' }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}

                    <Form.Item className="mb-6">
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        size="large"
                        className="border-2 border-dashed border-blue-200 text-blue-600 hover:border-blue-400 hover:text-blue-700"
                        style={{ borderRadius: '8px', height: '60px' }}
                      >
                        Add New Condition
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>

            <Divider />

            {/* Submit Section */}
            <Form.Item className="mb-0">
              <Space className="w-full justify-center">
                <Button
                  size="large"
                  onClick={() => form.resetFields()}
                  className="min-w-32"
                >
                  Reset Form
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="min-w-48 bg-gradient-to-r from-blue-500 to-blue-600 border-0"
                  style={{ borderRadius: '6px', height: '44px' }}
                  icon={!loading && <CheckCircleOutlined />}
                >
                  {loading ? "Creating Rule..." : "Create Segment Rule"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <Text className="text-gray-500">
            Need help? Check our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              documentation
            </a>{" "}
            or{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              contact support
            </a>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Page;