"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Card,
  Typography,
  Divider,
  Space,
} from "antd";
import { BsStars } from "react-icons/bs";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import useAuthStore from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";

const { Option } = Select;
const { Title, Text } = Typography;


const Page = () => {
  const [segmentRules, setSegmentRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [form] = useForm();

  // Fetch segment rules
  useEffect(() => {
    const fetchSegmentRules = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segmentRules/getAllSegmentRules`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("googleIdToken")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setSegmentRules(data.response.segmentRules);
        } else {
          message.error("Failed to fetch segment rules.");
        }
      } catch (error) {
        console.error("Error fetching segment rules:", error);
        message.error("An error occurred while fetching segment rules.");
      }
    };

    fetchSegmentRules();
  }, []);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/getAllCustomers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("googleIdToken")}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setCustomers(data.response.customers);
        } else {
          message.error("Failed to fetch customers.");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        message.error("An error occurred while fetching customers.");
      }
    };

    fetchCustomers();
  }, []);

  // Generate AI message
  const generateGeminiMessage = async () => {
    console.log("Generating message...");
    const { name, ruleId } = form.getFieldsValue();
    const rule = segmentRules.find((rule) => rule._id === ruleId);

    const sanitizedRule = rule?.conditions
      .map((condition: any) => {
        return condition.field + " " + condition.op + " " + condition.value;
      })
      .join(" " + rule.logicType + " ");

    console.log("Sanitized Rule: ", sanitizedRule);

    const response = await fetch(`/api/generateGeminiMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        rule: sanitizedRule,
      }),
    });

    const data = await response.json();
    if (data.success) {
      const aiMessage = String(data.message);
      form.setFieldsValue({ message: aiMessage });
      message.success("✅ Message generated successfully!");
    } else {
      message.error("❌ Failed to generate message.");
    }
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    console.log("Submitting form with values:", values);
    setLoading(true);
    if (!isLoggedIn) {
      alert("You have to Login before using any feature");
      router.push('/');
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaigns/create`,
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
        message.success("✅ Campaign created successfully!");
        alert("Campaign created successfully!"); // ✅ only on success
        form.resetFields();
      } else {
        message.error("❌ Failed to create campaign.");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      message.error("⚠️ An error occurred while creating the campaign.");
    }
    setLoading(false);
  };
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  return (
    <div className="h-screen flex justify-center items-start p-10 bg-gray-50">
      <Card
        title={<Title level={2}>Create Campaign</Title>}
        bordered
        style={{ width: "100%", maxWidth: 800 }}
      >
        <Text type="secondary">
          Define your campaign details, select your audience, and personalize
          your message.
        </Text>
        <Divider />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Campaign Name */}
          <Form.Item
            label="Campaign Name"
            name="name"
            rules={[
              { required: true, message: "Please enter a campaign name" },
            ]}
          >
            <Input placeholder="Enter campaign name" />
          </Form.Item>

          {/* Segment Rule */}
          <Form.Item
            label="Select Segment Rule"
            name="ruleId"
            rules={[
              { required: true, message: "Please select a segment rule" },
            ]}
          >
            <Select placeholder="Select a segment rule">
              {segmentRules?.map((rule) => (
                <Option key={rule._id} value={rule._id}>
                  {rule.logicType} -{" "}
                  {rule.conditions
                    .map((c: any) => `${c.field} ${c.op} ${c.value}`)
                    .join(", ")}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Customers */}
          <Form.Item
            label="Select Customers"
            name="customerIds"
            rules={[
              { required: true, message: "Please select at least one customer" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select customers"
              optionFilterProp="children"
            >
              {customers?.map((customer) => (
                <Option key={customer._id} value={customer._id}>
                  {customer.name} ({customer.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Message */}
          <Form.Item
            label="Message Content"
            name="message"
            rules={[{ required: true, message: "Please enter a message" }]}
          >
            <Input.TextArea
              rows={4}
              value={form.getFieldValue("message")}
              onChange={(e) =>
                form.setFieldsValue({ message: e.target.value })
              }
              placeholder="Enter personalized message"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="dashed"
              onClick={generateGeminiMessage}
              block
              icon={<BsStars />}
            >
              Generate By AI
            </Button>
          </Form.Item>

          {/* Intent */}
          <Form.Item label="Intent (Optional)" name="intent">
            <Input placeholder="Enter campaign intent (e.g., promotion, win-back)" />
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              icon={<PlusOutlined />}
            >
              Create Campaign
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
