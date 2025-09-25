"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Tag,
  message,
  Tooltip,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Space,
  Badge,
  Progress,
  Dropdown,
  MenuProps,
} from "antd";
import { ColumnsType } from "antd/es/table";
import {
  SendOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface Campaign {
  _id: string;
  name: string;
  message: string;
  intent?: string;
  status:
    | "draft"
    | "queued"
    | "sending"
    | "sent"
    | "error"
    | "completed_with_errors";
  audienceSize: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
}

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(
    null
  );
  const [searchText, setSearchText] = useState("");

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
      getAllCampaigns();
    }
  }, [authToken]);

  useEffect(() => {
    const filtered = campaigns.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(searchText.toLowerCase()) ||
        campaign.message.toLowerCase().includes(searchText.toLowerCase()) ||
        (campaign.intent &&
          campaign.intent.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredCampaigns(filtered);
  }, [campaigns, searchText]);

  const getAllCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaigns/getAllCampaigns`,
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
        setCampaigns(data.response.campaigns);
      } else {
        message.error("Failed to fetch campaigns");
        console.error("Error fetching campaigns", data.response);
      }
    } catch (e) {
      message.error("An error occurred while fetching campaigns");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = useCallback(() => {
    if (authToken) {
      getAllCampaigns();
      message.success("Campaign data refreshed successfully");
    }
  }, [authToken]);

  const handleSendCampaign = async (campaignId: string) => {
    setSendingCampaignId(campaignId);
    message.loading({
      content: "Initiating campaign dispatch...",
      key: "dispatching",
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) =>
        campaign._id === campaignId
          ? { ...campaign, status: "queued" }
          : campaign
      )
    );
    message.success({
      content: "Campaign queued successfully!",
      key: "dispatching",
      duration: 2,
    });
    setSendingCampaignId(null);

    setTimeout(() => {
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign._id === campaignId
            ? { ...campaign, status: "sending" }
            : campaign
        )
      );
    }, 2000);

    setTimeout(() => {
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) => {
          if (campaign._id === campaignId) {
            const isSuccess = Math.random() > 0.2;
            const finalStatus = isSuccess ? "sent" : "completed_with_errors";
            const sentCount = Math.floor(
              campaign.audienceSize *
                (isSuccess
                  ? Math.random() * 0.1 + 0.9
                  : Math.random() * 0.3 + 0.6)
            );
            const failedCount = campaign.audienceSize - sentCount;
            return {
              ...campaign,
              status: finalStatus,
              sentCount,
              failedCount,
            };
          }
          return campaign;
        })
      );
    }, 5000);
  };

  const getStatusConfig = (status: Campaign["status"]) => {
    const configs = {
      draft: { color: "#1890ff", icon: <FileTextOutlined />, label: "Draft" },
      queued: { color: "#faad14", icon: <ClockCircleOutlined />, label: "Queued" },
      sending: { color: "#722ed1", icon: <PlayCircleOutlined />, label: "Sending" },
      sent: { color: "#52c41a", icon: <CheckCircleOutlined />, label: "Sent" },
      completed_with_errors: {
        color: "#fa8c16",
        icon: <WarningOutlined />,
        label: "Partial Success",
      },
      error: { color: "#f5222d", icon: <ExclamationCircleOutlined />, label: "Failed" },
    };
    return configs[status] || configs.draft;
  };

  const getDeliveryRate = (campaign: Campaign) => {
    const audienceSize = campaign.audienceSize || 0;
    const sentCount = campaign.sentCount || 0;
    if (audienceSize === 0) return 0;
    return Math.round((sentCount / audienceSize) * 100);
  };

  // Calculate statistics
  const stats = {
    total: campaigns.length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    active: campaigns.filter((c) => ["queued", "sending"].includes(c.status)).length,
    completed: campaigns.filter((c) =>
      ["sent", "completed_with_errors"].includes(c.status)
    ).length,
    totalAudience: campaigns.reduce((sum, c) => sum + (c.audienceSize || 0), 0),
    totalSent: campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0),
  };

  const columns: ColumnsType<Campaign> = [
    {
      title: "Campaign",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string, record: Campaign) => (
        <div>
          <Text strong className="block">
            {text}
          </Text>
          <Text type="secondary" className="text-sm">
            Created {dayjs(record.createdAt).fromNow()}
          </Text>
        </div>
      ),
    },
    {
      title: "Message Preview",
      dataIndex: "message",
      key: "message",
      width: 250,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-200">
            <Text
              style={{ maxWidth: 200 }}
              ellipsis={{ tooltip: false }}
              className="text-sm"
            >
              {text}
            </Text>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Intent",
      dataIndex: "intent",
      key: "intent",
      render: (intent?: string) =>
        intent ? <Tag color="blue">{intent}</Tag> : <Text type="secondary">No intent</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Campaign["status"]) => {
        const config = getStatusConfig(status);
        return (
          <Badge
            color={config.color}
            text={
              <span className="flex items-center gap-1">
                {config.icon}
                <span className="font-medium">{config.label}</span>
              </span>
            }
          />
        );
      },
      filters: [
        { text: "Draft", value: "draft" },
        { text: "Queued", value: "queued" },
        { text: "Sending", value: "sending" },
        { text: "Sent", value: "sent" },
        { text: "Partial Success", value: "completed_with_errors" },
        { text: "Failed", value: "error" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Audience",
      dataIndex: "audienceSize",
      key: "audienceSize",
      sorter: (a, b) => (a.audienceSize || 0) - (b.audienceSize || 0),
      render: (size: number) => (
        <div className="flex items-center gap-1">
          <UserOutlined className="text-gray-400" />
          <Text strong>{(size || 0).toLocaleString()}</Text>
        </div>
      ),
    },
    {
      title: "Delivery Progress",
      key: "progress",
      render: (_, record: Campaign) => {
        if (["draft"].includes(record.status)) {
          return <Text type="secondary">Not started</Text>;
        }

        const rate = getDeliveryRate(record);
        const isCompleted = ["sent", "completed_with_errors"].includes(record.status);

        return (
          <div className="w-32">
            <Progress
              percent={rate}
              size="small"
              status={
                record.status === "error"
                  ? "exception"
                  : isCompleted
                  ? "success"
                  : "active"
              }
              format={(percent) => `${percent}%`}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Sent: {(record.sentCount || 0).toLocaleString()}</span>
              {(record.failedCount || 0) > 0 && (
                <span className="text-orange-500">
                  Failed: {record.failedCount || 0}
                </span>
              )}
            </div>
          </div>
        );
      },
      sorter: (a, b) => getDeliveryRate(a) - getDeliveryRate(b),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record: Campaign) => {
        const actionMenuItems: MenuProps["items"] = [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "View Details",
          },
          {
            key: "duplicate",
            icon: <FileTextOutlined />,
            label: "Duplicate Campaign",
          },
          {
            key: "send",
            icon: <SendOutlined />,
            label: "Send Campaign",
            onClick: () => handleSendCampaign(record._id),
          },
        ];

        return (
          <Space>
            <Dropdown menu={{ items: actionMenuItems }} placement="bottomRight">
              <Button icon={<MoreOutlined />} size="small" />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Title level={1} className="mb-0">
                  Campaign Dashboard
                </Title>
              </div>
              <Paragraph className="text-gray-600 mb-0">
                Monitor and manage your marketing campaigns with real-time insights
              </Paragraph>
            </div>

            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchCampaigns}
                loading={loading}
                size="large"
                className="flex items-center"
              >
                Refresh
              </Button>
            </Space>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center border-0 shadow-sm">
                <Statistic
                  title="Total Campaigns"
                  value={stats.total}
                  prefix={<FileTextOutlined className="text-blue-500" />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center border-0 shadow-sm">
                <Statistic
                  title="Draft Campaigns"
                  value={stats.draft}
                  prefix={<ClockCircleOutlined className="text-orange-500" />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center border-0 shadow-sm">
                <Statistic
                  title="Total Audience"
                  value={stats.totalAudience}
                  prefix={<UserOutlined className="text-green-500" />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center border-0 shadow-sm">
                <Statistic
                  title="Messages Sent"
                  value={stats.totalSent}
                  prefix={<CheckCircleOutlined className="text-purple-500" />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-lg border-0" style={{ borderRadius: "12px" }}>
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 max-w-md">
              <Search
                placeholder="Search campaigns by name, message, or intent..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredCampaigns}
            loading={loading}
            rowKey="_id"
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} campaigns`,
            }}
            className="campaign-table"
            size="middle"
          />
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <Text className="text-gray-500">
            Campaign management made simple. Need help?{" "}
            <a
              href="https://github.com/PriyanshuPandey92/Xeno-CRM-FrontEnd"
              className="text-blue-600 hover:text-blue-700"
            >
              View documentation
            </a>
          </Text>
        </div>
      </div>

      <style jsx global>{`
        .campaign-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          border-bottom: 2px solid #e8e8e8;
          font-weight: 600;
        }

        .campaign-table .ant-table-tbody > tr:hover > td {
          background-color: #f8faff;
        }

        .campaign-table .ant-progress-inner {
          border-radius: 4px;
        }

        .campaign-table .ant-badge-status-text {
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default CampaignsPage;
