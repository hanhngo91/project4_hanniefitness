import { Modal } from "antd";
import { useState, useEffect } from "react";
import { Reservation } from "./History";
import axios from "axios";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";

function ReserveDetails({
  selectedReservation,
  handleCloseDetailOrder,
}: {
  selectedReservation: Reservation;
  handleCloseDetailOrder: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [reservation, setReservation] = useState([] as any);

  interface DataType {
    key: string;
    name: string;
    reservationsId: string;
    userId: string | undefined;
    status: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Classname",
      dataIndex: "className",
      key: "className",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Purchase date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => <p>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</p>,
    },

    {
      title: "Image",
      dataIndex: "classImage",
      key: "classImage",
      render: (url) => (
        <img className="w-[5rem] rounded-lg" src={url} alt="Coach Image" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <p>${text}/month</p>,
    },
    {
      title: "Class time",
      dataIndex: "classTime",
      key: "classTime",
      render: (text) => <p>{text}</p>,
    },
  ];

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = (): void => {
    handleCloseDetailOrder();
  };

  //Get reservation details:
  const getReservationDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/cart/reservationDetails/${selectedReservation}`
      );
      setReservation(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getReservationDetails();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        width={900}
        style={{ top: 88 }}
      >
        <div>
          <div className="flex justify-center items-center pt-[1.5rem] text-2xl font-semibold">
            REGISTRATION DETAILS
          </div>
          <Table
            className="w-[90%] mx-auto py-[2rem]"
            columns={columns}
            dataSource={reservation}
            pagination={{ pageSize: 2 }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ReserveDetails;
