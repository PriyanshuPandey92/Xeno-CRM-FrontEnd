"use client";
import React, { useEffect, useState } from "react";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload, Table, Spin, Modal, Form, Input } from "antd";

const Page = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
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
      getAllOrders();
    }
  }, [authToken]);

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/getAllOrders`,
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
        setOrders(data.response.orders);
      } else {
        console.error("Error fetching orders:", data.message);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const props: UploadProps = {
    name: "file",
    action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploads/orders`,
    headers: {
      authorization: `Bearer ${authToken}`,
    },
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        getAllOrders();
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // Open modal
  const handleEdit = (order: any) => {
    setEditingOrder(order);
    form.setFieldsValue(order);   
    setIsModalOpen(true);
  };

  // Save updated order
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/updateOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ id: editingOrder._id, ...values }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Update failed");

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === editingOrder._id ? { ...o, ...values } : o
        )
      );

      alert("Order updated successfully!");  
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update order.");  
    }
  };

  const columns = [
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items: string[] | string) => {
        if (Array.isArray(items)) {
          return items.join(", ");
        }
        return items || "-";
      },
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: any) => {
        if (amount == null || amount === "") return "-";
        const num = Number(amount);
        return isNaN(num) ? "-" : `₹${num.toFixed(2)}`;
      },
    },
    {
      title: "External ID",
      dataIndex: "externalId",
      key: "externalId",
      render: (text?: string) => text || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
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
      <h1 className="text-5xl font-bold">Orders</h1>
      <div className="mt-5">
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Table columns={columns} dataSource={orders} rowKey="_id" />
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Order"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="items" label="Items">
            <Input />
          </Form.Item>
          <Form.Item name="orderDate" label="Order Date">
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount">
            <Input type="number" />
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
