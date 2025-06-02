"use client"
import React, { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { Table, Spin } from 'antd';

const Page = () => {
        const [orders, setOrders] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

    
        const [authToken, setAuthToken] = useState<string | null>(null);
        useEffect(() =>{
            const token = sessionStorage.getItem('googleIdToken');
            if (token) {
                setAuthToken(token);
            } else {
                console.error('No auth token found');
            }
        }, [])
        useEffect(() => {
                if (authToken) {
                    getAllOrders();
                }
            }, [authToken]);
        const getAllOrders = async ()=>{
            try{
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/getAllOrders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`}
                })

                const data = await response.json();
                if (data.success) {
                    setOrders(data.response.orders);
                }
                else {
                    console.error('Error fetching orders:', data.message);
                }
                console.log(data.response.orders);
                setLoading(false);
            }
            catch(e){
                console.log(e);
            }
        }
        const props: UploadProps = {
            name: 'file',
                action:  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploads/orders`,
            headers: {
              authorization: `Bearer ${authToken}`,
            },
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                getAllOrders();
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
          };
  
          const columns = [
            {
              title: "Items",
              dataIndex: "items",
              key: "items",
              render: (items: string[] | string) => {
                if (Array.isArray(items)) {
                  return items.join(', ');
                }
                return items || "-"; 
              },
            },
            {
              title: "Order Date",
              dataIndex: "orderDate",
              key: "orderDate",
              render: (date: string) => date ? new Date(date).toLocaleDateString() : "-",
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
              render: (amount: number) => amount != null ? `₹${amount.toFixed(2)}` : "-", 
            },
            {
              title: "External ID",
              dataIndex: "externalId",
              key: "externalId",
              render: (text?: string) => text || "-", 
            },
            {
                title : "Actions",
                key : "actions",
                render: (_: any, record: any) =>{
                    return (
                        <Button type='primary' onClick={() => {
                            console.log("View/Edit order:", record);
                            
                        }} >View/Edit</Button>
                    )
                }
            }
          ];

  return (
    <div className='h-screen flex flex-col px-10 mt-10 text-xl '>
    <h1 className='text-5xl font-bold' >Orders</h1>
    <div className='mt-5'>
            <Upload {...props}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>


      {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id" 

          />
        )}
      
            </div>
</div>
  )
}

export default Page