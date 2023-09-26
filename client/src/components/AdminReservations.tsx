import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useState, useEffect } from "react";
import axios from "axios";
import ReserveDetailsAdmin from "./ReserveDetailsAdmin";

function Reservations() {
  interface DataType {
    key: string;
    name: string;
    reservationsId: string;
    userId: string | undefined;
    status: string;
  }
  const [allReservations, setAllReservations] = useState([] as any);
  const [selectedOrder, setSelectedOrder] = useState({} as any);
  const [openModalDetails, setOpenModalDetails] = useState(false);

  //Get all reservations:
  const getAllReservations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/cart/all/all-reservations"
      );
      setAllReservations(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllReservations();
  }, []);

  //--------------open detail modal------------------
  const handleOpenDetails = (reservationsId: string) => () => {
    setSelectedOrder(reservationsId);
    setOpenModalDetails(true);
  };

  const handleCloseDetailOrder = () => {
    setOpenModalDetails(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Purchase date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</p>,
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
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => <p>${text}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={handleOpenDetails(record.reservationsId)}
            className="py-[.3rem] px-[.7rem] rounded-lg bg-rose-200 hover:bg-rose-400 hover:text-white font-semibold"
          >
            Details
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {openModalDetails ? (
        <ReserveDetailsAdmin
          selectedOrder={selectedOrder}
          handleCloseDetailOrder={handleCloseDetailOrder}
        />
      ) : (
        <></>
      )}
      <div>
        <Table
          columns={columns}
          dataSource={allReservations}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </>
  );
}

export default Reservations;
