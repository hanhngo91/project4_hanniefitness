import { useAppSelector } from "../redux/hook";
import axios from "axios";
import { useState, useEffect } from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import ReserveDetails from "./ReserveDetails";
import moment from "moment";

export interface Reservation {
  reservationsId: string;
}

function History() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const currentUserId = currentUser?.userId;
  const [history, setHistory] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState({} as any);
  const [openModalDetails, setOpenModalDetails] = useState(false);

  //Open details of order:
  const handleOpenDetailOrder = (reservationsId: string) => () => {
    setSelectedReservation(reservationsId);
    setOpenModalDetails(true);
  };

  const handleCloseDetailOrder = () => {
    setOpenModalDetails(false);
  };

  interface DataType {
    key: string;
    name: string;
    reservationsId: string;
    userId: string | undefined;
    status: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Purchase date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => <p>${text}</p>,
    },
    {
      title: "Status",
      dataIndex: "reservationStatus",
      key: "reservationStatus",
      render: (status) => (
        <>
          {parseInt(status) === 1 ? (
            <span
              title="Click for more details"
              className="text-sky-600 text-base font-medium"
            >
              Paid
            </span>
          ) : (
            <></>
          )}
        </>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={handleOpenDetailOrder(record.reservationsId)}
            className="py-[.3rem] px-[.7rem] rounded-lg bg-blue-200 hover:bg-blue-400 hover:text-white font-semibold"
          >
            See more
          </button>
        </Space>
      ),
    },
  ];

  //Get all registration history:
  const getHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/cart/reservations/${currentUserId}`
      );
      setHistory(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <>
      {openModalDetails ? (
        <ReserveDetails
          selectedReservation={selectedReservation}
          handleCloseDetailOrder={handleCloseDetailOrder}
        />
      ) : (
        <></>
      )}
      <div className="mt-[3.2rem]">
        <div className="mt-[5rem] mb-[2rem] flex justify-center items-center text-2xl font-semibold">
          REGISTRATION HISTORY
        </div>
        <Table
          className="w-[90%] mx-auto"
          columns={columns}
          dataSource={history}
          pagination={{ pageSize: 3 }}
        />
      </div>
    </>
  );
}

export default History;
