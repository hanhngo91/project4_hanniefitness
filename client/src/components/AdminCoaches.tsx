import React, { useState, useEffect } from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { Modal } from "antd";
import AddCoach from "./AddCoach";
import UpdateCoach from "./UpdateCoach";

interface DataType {
  key: string;
  coachname: string;
  image: any;
  intro: string;
  major: string;
  coachId: string;
  expanded: boolean;
}

const AdminCoaches: React.FC = () => {
  const [coaches, setCoaches] = useState<
    Array<DataType & { expanded: boolean }>
  >([]);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [selectedCoach, setSelectedCoach] = useState<DataType | null>(null); //for update modal

  //See more:
  const handleSeeMore = (coachId: string) => {
    setCoaches((prevCoaches) =>
      prevCoaches.map((coachData) =>
        coachData.coachId === coachId
          ? { ...coachData, expanded: !coachData.expanded }
          : coachData
      )
    );
  };

  //Get all coaches:
  const getCoaches = async () => {
    try {
      const res = await axios.get("http://localhost:8800/data/coaches");
      const coachesWithExpanded = res?.data?.data.map(
        (coachData: DataType) => ({
          ...coachData,
          expanded: false,
        })
      );
      setCoaches(coachesWithExpanded);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCoaches();
  }, []);

  //Delete a coach:
  const handleDeleteCoach = async (coachId: string) => {
    try {
      Modal.confirm({
        title: "Coach Delete Confirmation:",
        content: "Are you sure you want to delete this coach?",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          await axios.delete(
            `http://localhost:8800/data/coaches/delete-coach/${coachId}`
          );
          getCoaches();
        },
      });
    } catch (error: any) {
      console.log("delete coach from admin", error);
    }
  };

  //Update a coach:
  const handleUpdateCoach = async (coachId: DataType) => {
    setOpenModalUpdate(true);
    setSelectedCoach(coachId);
  };

  const handleCloseModalUpdate = () => {
    setOpenModalUpdate(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Coach name",
      dataIndex: "coachName",
      key: "coachname",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Coach image",
      dataIndex: "coachImage",
      key: "image",
      render: (url) => (
        <img className="w-[5rem] rounded-lg" src={url} alt="Coach Image" />
      ),
    },
    {
      title: "Intro",
      dataIndex: "intro",
      key: "intro",
      render: (text, record) => (
        <span>
          {record.expanded ? text : `${text.slice(0, 50)}...`}
          <span
            onClick={() => handleSeeMore(record.coachId)}
            className="cursor-pointer font-medium"
          >
            {record.expanded ? "...see less" : "see more"}
          </span>
        </span>
      ),
    },
    {
      title: "Major",
      key: "major",
      dataIndex: "major",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <button
            onClick={() => handleDeleteCoach(record.coachId)}
            className="py-[.3rem] px-[.7rem] rounded-lg bg-rose-200 hover:bg-rose-400 hover:text-white font-semibold"
          >
            Delete
          </button>
          <button
            onClick={() => handleUpdateCoach(record.coachId)}
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
      {openModalUpdate ? (
        <UpdateCoach
          handleCloseModalUpdate={handleCloseModalUpdate}
          selectedCoach={selectedCoach}
          coaches={coaches}
          getCoaches={getCoaches}
        />
      ) : (
        <AddCoach getCoaches={getCoaches} />
      )}
      <Table
        columns={columns}
        dataSource={coaches}
        pagination={{ pageSize: 3 }}
      />
    </>
  );
};

export default AdminCoaches;
