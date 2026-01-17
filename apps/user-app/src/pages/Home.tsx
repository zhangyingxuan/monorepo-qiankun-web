import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Avatar,
  message,
  Divider,
  Progress,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatar: string;
  createTime: string;
}

const Home = () => {
  const [users] = useState<User[]>([
    {
      id: 1,
      username: "admin",
      nickname: "管理员",
      email: "admin@example.com",
      phone: "13800138000",
      role: "超级管理员",
      status: "正常",
      avatar: "",
      createTime: "2024-01-01 10:00:00",
    },
    {
      id: 2,
      username: "zhangsan",
      nickname: "张三",
      email: "zhangsan@example.com",
      phone: "13800138001",
      role: "管理员",
      status: "正常",
      avatar: "",
      createTime: "2024-01-02 10:00:00",
    },
    {
      id: 3,
      username: "lisi",
      nickname: "李四",
      email: "lisi@example.com",
      phone: "13800138002",
      role: "普通用户",
      status: "正常",
      avatar: "",
      createTime: "2024-01-03 10:00:00",
    },
    {
      id: 4,
      username: "wangwu",
      nickname: "王五",
      email: "wangwu@example.com",
      phone: "13800138003",
      role: "普通用户",
      status: "禁用",
      avatar: "",
      createTime: "2024-01-04 10:00:00",
    },
    {
      id: 5,
      username: "zhaoliu",
      nickname: "赵六",
      email: "zhaoliu@example.com",
      phone: "13800138004",
      role: "访客",
      status: "正常",
      avatar: "",
      createTime: "2024-01-05 10:00:00",
    },
  ]);

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "用户",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: "bold" }}>{record.nickname}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "超级管理员"
              ? "gold"
              : role === "管理员"
              ? "blue"
              : "default"
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "正常" ? "success" : "error"}>{status}</Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const goBack = () => {
    window.history.pushState(null, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleAdd = () => {
    message.success("新增用户功能");
  };

  const handleEdit = (record: User) => {
    message.info(`编辑用户: ${record.nickname}`);
  };

  const handleDelete = (record: User) => {
    message.warning(`删除用户: ${record.nickname}`);
  };

  return (
    <div className="user-home">
      <div
        title="用户管理系统"
        subTitle="React + Ant Design"
        backIcon={<ArrowLeftOutlined />}
        onBack={goBack}
        extra={[
          <Button
            key="1"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增用户
          </Button>,
        ]}
      />

      <Divider />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={1234}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={856}
              prefix={<TeamOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增"
              value={23}
              prefix={<PlusOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="安全等级"
              value="A+"
              prefix={<SafetyOutlined style={{ color: "#eb2f96" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          {/* 用户列表 */}
          <Card title="用户列表" extra={<a href="#">更多</a>}>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          {/* 用户分布 */}
          <Card title="用户角色分布">
            <div style={{ padding: "20px 0" }}>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>超级管理员</span>
                  <span>2人</span>
                </div>
                <Progress percent={2} strokeColor="#722ed1" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>管理员</span>
                  <span>15人</span>
                </div>
                <Progress percent={15} strokeColor="#1890ff" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>普通用户</span>
                  <span>68人</span>
                </div>
                <Progress percent={68} strokeColor="#52c41a" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>访客</span>
                  <span>15人</span>
                </div>
                <Progress percent={15} strokeColor="#faad14" />
              </div>
            </div>
          </Card>

          {/* 最近活动 */}
          <Card title="最近活动" style={{ marginTop: 16 }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li
                style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}
              >
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span>
                    <strong>张三</strong> 登录了系统
                  </span>
                </Space>
                <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  5分钟前
                </div>
              </li>
              <li
                style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}
              >
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span>
                    <strong>李四</strong> 修改了个人信息
                  </span>
                </Space>
                <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  10分钟前
                </div>
              </li>
              <li
                style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}
              >
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span>
                    <strong>王五</strong> 更新了密码
                  </span>
                </Space>
                <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  30分钟前
                </div>
              </li>
              <li style={{ padding: "12px 0" }}>
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span>
                    <strong>管理员</strong> 新增了用户
                  </span>
                </Space>
                <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                  1小时前
                </div>
              </li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
