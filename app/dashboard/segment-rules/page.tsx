"use client";
import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";

const { Option } = Select;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();  
  const handleSubmit = async (values: any) => {
    console.log("Form Values:", values);
    setLoading(true);


    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segmentRules/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("googleIdToken")}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data.success) {
        message.success("Segment rule created successfully!");
        form.resetFields();
      } else {
        message.error("Failed to create segment rule.");
      }
    } catch (error) {
      console.error("Error creating segment rule:", error);
      message.error("An error occurred while creating the segment rule.");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col px-10 mt-10 text-xl">
      <h1 className="text-5xl font-bold">Create Segment Rule</h1>
      <div className="mt-5">
        <Form
        form={form}
         layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Logic Type"
            name="logicType"
            rules={[{ required: true, message: "Please select a logic type" }]}
          >
            <Select placeholder="Select logic type">
              <Option value="AND">AND</Option>
              <Option value="OR">OR</Option>
            </Select>
          </Form.Item>

          <Form.List name="conditions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-4 ">
                    <Form.Item
                      {...restField}
                      name={[name, "field"]}
            
                      rules={[{ required: true, message: "Please enter a field" }]}
                    >
                      <Input placeholder="Field (e.g., spend, visits)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "op"]}
            
                      rules={[{ required: true, message: "Please enter an operator" }]}
                    >
                      <Input placeholder="Operator (e.g., >, <, =)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
           
                      rules={[{ required: true, message: "Please enter a value" }]}
                    >
                      <Input placeholder="Value (e.g., 10000, 3)" />
                    </Form.Item>
                    <Button  type="primary" onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button className="" type="dashed" onClick={() => add()}>
                  Add Condition
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Segment Rule
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Page;