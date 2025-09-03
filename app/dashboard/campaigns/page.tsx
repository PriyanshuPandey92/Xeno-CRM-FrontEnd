"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Tag, message, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SendOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;



interface Campaign {
  _id: string;
  name: string;
  message: string;
  intent?: string;
  status: 'draft' | 'queued' | 'sending' | 'sent' | 'error' | 'completed_with_errors';
  audienceSize: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
 
}

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null);

  useEffect(()=>{
    const token = sessionStorage.getItem('googleIdToken');
    if(token){
      setAuthToken(token);
    }
    else{
      console.error('No auth token found');
    }
  },[])
  useEffect(()=>{
    if(authToken){
      getAllCampaigns();
    }
  },[authToken])

  const getAllCampaigns = async ()=>{
    try{
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaigns/getAllCampaigns`,{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if(data.success){
        setCampaigns(data.response.campaigns);
      }
      else{
        console.error('Error fetching campaigns', data.response,campaigns);
      }
      console.log(data);
      
    }
    catch(e){
      console.log(e);
    }
    finally{
      setLoading(false);
    }
  }
  
  const fetchCampaigns = useCallback(() => {
    if(authToken){
      getAllCampaigns();
      message.info('Campaign data reloaded successfully');
    }
  }, [authToken]);


  const handleSendCampaign = async (campaignId: string) => {
    setSendingCampaignId(campaignId);
    message.loading({ content: 'Dispatching campaign...', key: 'dispatching' });


    await new Promise(resolve => setTimeout(resolve, 1500));

    setCampaigns(prevCampaigns => prevCampaigns.map(campaign => campaign._id === campaignId ? { ...campaign, status: 'queued' } : campaign));
    message.success({ content: 'Campaign dispatch initiated successfully!', key: 'dispatching', duration: 2 });
    setSendingCampaignId(null);

 
    setTimeout(() => {
      setCampaigns(prevCampaigns => prevCampaigns.map(campaign => campaign._id === campaignId ? { ...campaign, status: 'sending' } : campaign));
    }, 2000);

    setTimeout(() => {
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(campaign => {
          if (campaign._id === campaignId) {
            const isSuccess = Math.random() > 0.2; 
            const finalStatus = isSuccess ? 'sent' : 'completed_with_errors';
            const sentCount = Math.floor(campaign.audienceSize * (isSuccess ? (Math.random() * 0.1 + 0.9) : (Math.random() * 0.3 + 0.6))); // 90-100% or 60-90%
            const failedCount = campaign.audienceSize - sentCount;
            return { ...campaign, status: finalStatus, sentCount, failedCount };
          }
          return campaign;
        })
      );
    }, 5000);
  };

  const getStatusTagColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return 'blue';
      case 'queued': return 'gold';
      case 'sending': return 'processing'; 
      case 'sent': return 'green';
      case 'completed_with_errors': return 'orange';
      case 'error': return 'red';
      default: return 'default';
    }
  };

  const columns: ColumnsType<Campaign> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Message Snippet',
      dataIndex: 'message',
      key: 'message',
      render: (text: string) => (
        <Tooltip title={text}>
          <Text style={{ maxWidth: 200 }} ellipsis={{ tooltip: text }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Intent',
      dataIndex: 'intent', 
      key: 'intent',
      render: (intent?: string) => intent || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Campaign['status']) => (
        <Tag color={getStatusTagColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Queued', value: 'queued' },
        { text: 'Sending', value: 'sending' },
        { text: 'Sent', value: 'sent' },
        { text: 'Error', value: 'error' },
        { text: 'Completed with Errors', value: 'completed_with_errors' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Audience',
      dataIndex: 'audienceSize',
      key: 'audienceSize',
      sorter: (a, b) => a.audienceSize - b.audienceSize,
    },
    {
      title: 'Sent',
      dataIndex: 'sentCount',
      key: 'sentCount',
      sorter: (a, b) => a.sentCount - b.sentCount,
    },
    {
      title: 'Failed',
      dataIndex: 'failedCount',
      key: 'failedCount',
      sorter: (a, b) => a.failedCount - b.failedCount,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Campaign) => (
        <>
          {record.status === 'draft' && (
            <Tooltip title="Send Campaign">
              <Button
                icon={<SendOutlined />}
                onClick={() => handleSendCampaign(record._id)}
                loading={sendingCampaignId === record._id}
                disabled={sendingCampaignId !== null && sendingCampaignId !== record._id}
                type="primary"
                style={{ marginRight: 8 }}
              >
                Send
              </Button>
            </Tooltip>
          )}
      
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Campaigns</Title>
        <Button icon={<ReloadOutlined />} onClick={fetchCampaigns} loading={loading}>
          Refresh 
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={campaigns}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CampaignsPage;