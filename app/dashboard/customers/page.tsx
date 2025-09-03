"use client";
import React, { useEffect, useState } from "react";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { notification } from "antd";
import { Button, message, Upload, Table, Spin, Modal, Form, Input } from "antd";

const Page = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Modal & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = sessionStorage.getItem("googleIdToken");
    if (token) {
      setAuthToken(token);
    } else {
      console.error("No auth token found");
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      getAllCustomers();
    }
  }, [authToken]);

  const getAllCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/getAllCustomers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setCustomers(data.response.customers);
      } else {
        console.error("Error fetching customers:", data.response.message);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // File upload props
  const props: UploadProps = {
    name: "file",
    action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploads/customers`,
    headers: {
      authorization: `Bearer ${authToken}`,
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} uploaded successfully`);
        getAllCustomers();
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
  };

  // Open modal
  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer); // pre-fill form
    setIsModalOpen(true);
  };

  // Save updated customer
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/updateCustomer`,{
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ id: editingCustomer._id, ...values }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Update failed");

      // Update local state
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === editingCustomer._id ? { ...c, ...values } : c
        )
      );
      console.log("Customer details updated successfully")
      alert("Customer updated successfully!")
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert("Customer details couldn't be updated!")
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (t: string) => t || "-",
    },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "External ID", dataIndex: "externalId", key: "externalId" },
    {
      title: "Edit",
      key: "edit",
      render: (_: string, record: any) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="h-screen flex flex-col px-10 mt-10 text-xl">
      <h1 className="text-5xl font-bold">Customers</h1>

      {/* Upload */}
      <div className="mt-5">
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </div>

      {/* Table */}
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
          />
        )}
      </div>

      <Modal
        title="Edit Customer"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="externalId" label="External ID">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Page;
