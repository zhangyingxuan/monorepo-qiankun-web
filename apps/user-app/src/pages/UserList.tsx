import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Avatar,
  message,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
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
  createTime: string;
}

const UserList = () => {
  const [searchKey, setSearchKey] = useState("");

  const [users] = useState<User[]>([
    {
      id: 1,
      username: "admin",
      nickname: "管理员",
      email: "admin@example.com",
      phone: "13800138000",
      role: "超级管理员",
      status: "正常",
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
      createTime: "2024-01-05 10:00:00",
    },
  ]);

  const filteredUsers = searchKey
    ? users.filter(
        (u) => u.nickname.includes(searchKey) || u.username.includes(searchKey)
      )
    : users;

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
          <Popconfirm
            title="确定删除该用户吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
    <div className="user-list">
      <Card
        title="用户列表"
        extra={
          <Space>
            <Input
              placeholder="搜索用户"
              prefix={<SearchOutlined />}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          </Space>
        }
      >
        <Table columns={columns} dataSource={filteredUsers} rowKey="id" />
      </Card>
    </div>
  );
};

export default UserList;
