import React, { useState, useEffect } from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { Modal } from "antd";
import AddClasses from "./AddClasses";
import UpdateClass from "./UpdateClass";
import { notification } from "antd";

interface DataType {
  classId: string;
  key: string;
  className: string;
  classImage: any;
  coachName: string;
  classInfo: string;
  slots: number;
  expanded: boolean;
  price: number;
}

const AdminClasses: React.FC = () => {
  const [classes, setClasses] = useState<
    Array<DataType & { expanded: boolean }>
  >([]);
  const [openModalUpdateClass, setOpenModalUpdateClass] =
    useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<DataType | null>(null); //for update modal class

  //See more:
  const handleSeeMore = (classId: string) => {
    setClasses((prevClasses) =>
      prevClasses.map((classData) =>
        classData.classId === classId
          ? { ...classData, expanded: !classData.expanded }
          : classData
      )
    );
  };
  //Get all classes:
  const getClasses = async () => {
    try {
      const res = await axios.get("http://localhost:8800/data/classes");
      const classesWithExpanded = res?.data?.data.map(
        (classData: DataType) => ({
          ...classData,
          expanded: false,
        })
      );
      setClasses(classesWithExpanded);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  //Delete a class:
  const handleDeleteClass = async (classId: string) => {
    try {
      Modal.confirm({
        title: "Class Delete Confirmation:",
        content: "Are you sure you want to delete this class?",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          await axios.delete(
            `http://localhost:8800/data/classes/delete-class/${classId}`
          );
          getClasses();
          notification.success({
            message: "Deleted class successfully!",
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Update class:
  const handleUpdateClass = (classId: DataType) => {
    setSelectedClass(classId);
    setOpenModalUpdateClass(true);
  };

  //Close modal update class:
  const handleCloseModalUpdateClass = () => {
    setOpenModalUpdateClass(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Classname",
      dataIndex: "className",
      key: "className",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Class image",
      dataIndex: "classImage",
      key: "classImage",
      render: (url) => (
        <img className="w-[5rem] rounded-lg" src={url} alt="Class Image" />
      ),
    },
    {
      title: "Class info",
      dataIndex: "classInfo",
      key: "classInfo",
      render: (text, record) => (
        <span>
          {record.expanded ? text : `${text.slice(0, 50)}...`}
          <span
            onClick={() => handleSeeMore(record.classId)}
            className="cursor-pointer font-medium"
          >
            {record.expanded ? "...see less" : "see more"}
          </span>
        </span>
      ),
    },
    {
      title: "Coach",
      dataIndex: "coachName",
      key: "coachName",
    },
    {
      title: "Class time",
      dataIndex: "classTime",
      key: "classTime",
    },
    {
      title: "Slots",
      dataIndex: "slots",
      key: "slots",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>${text}/month</span>,
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <button
            onClick={() => handleDeleteClass(record.classId)}
            className="py-[.3rem] px-[.7rem] rounded-lg bg-rose-200 hover:bg-rose-400 hover:text-white font-semibold"
          >
            Delete
          </button>
          <button
            onClick={() => handleUpdateClass(record.classId)}
            className="py-[.3rem] px-[.7rem] rounded-lg bg-blue-200 hover:bg-blue-400 hover:text-white font-semibold"
          >
            Update
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {openModalUpdateClass ? (
        <UpdateClass
          handleCloseModalUpdateClass={handleCloseModalUpdateClass}
          selectedClass={selectedClass}
          classes={classes}
          getClasses={getClasses}
        />
      ) : (
        <AddClasses />
      )}
      <Table
        columns={columns}
        dataSource={classes}
        pagination={{ pageSize: 2 }}
      />
    </>
  );
};

export default AdminClasses;
