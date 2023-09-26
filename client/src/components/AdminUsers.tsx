import React, { useState, useEffect } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { Modal } from "antd";

interface DataType {
  key: string;
  Username: string;
  Email: string;
  tags: string[];
  userId: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  //Get users:
  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800/data/users");
      setUsers(res?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  //Change color of tag based on role:
  function getTagColorRole(roleName: any) {
    switch (roleName) {
      case 2:
        return "#73B8DD";
      case 1:
        return "#C469F1";
      default:
        return "#73B8DD";
    }
  }
  //Change text of tag based on role:
  function renderRoleName(roleName: any) {
    let roleNameText = "";
    let tagColor = getTagColorRole(roleName);

    switch (roleName) {
      case 2:
        roleNameText = "User";
        break;
      case 1:
        roleNameText = "Admin";
        break;
      case null:
        roleNameText = "User";
        break;
      default:
        break;
    }

    return <Tag color={tagColor}>{roleNameText}</Tag>;
  }
  //Delete an user:
  const handleDeleteUser = async (userId: string) => {
    try {
      Modal.confirm({
        title: "User Delete Confirmation:",
        content: "Are you sure you want to delete this user?",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          await axios.delete(
            `http://localhost:8800/data/users/delete-user/${userId}`
          );
          getUsers();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "username",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "Email",
    },
    {
      title: "Role",
      key: "tags",
      dataIndex: "roles",
      render: renderRoleName,
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <Space size="middle">
          {record.roles !== 1 ? (
            <button
              onClick={() => handleDeleteUser(record.userId)}
              className="py-[.3rem] px-[.7rem] rounded-lg bg-rose-200 hover:bg-rose-400 hover:text-white font-semibold"
            >
              Delete
            </button>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table columns={columns} dataSource={users} pagination={{ pageSize: 5 }} />
  );
};

export default AdminUsers;
