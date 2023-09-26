import { useState, useEffect } from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useAppSelector } from "../redux/hook";
import { Modal } from "antd";
import { notification } from "antd";
import { Link } from "react-router-dom";

function Reservation({
  handleCloseReserveModal,
}: {
  handleCloseReserveModal: () => any;
}) {
  const [open, setOpen] = useState(true); //modal
  const [confirmLoading, setConfirmLoading] = useState(false); //modal
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const currentUserId = currentUser.userId;

  interface DataType {
    key: string;
    name: string;
    classId: string;
    userId: string | undefined;
  }

  //Get user's reserveCart:
  const [reserveCart, setReserveCart] = useState([] as any);
  const getReserveCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/cart/${currentUserId}`
      );
      setReserveCart(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getReserveCart();
  }, [currentUser]);

  const classArray = reserveCart.map((item: any) => item.classId);

  //Caculate classes price in reserve cart:
  const total = reserveCart?.reduce((acc, item) => acc + Number(item.price), 0);

  //Delete class from reservecart:
  const handleDeleteClass = (classId: string) => async () => {
    try {
      Modal.confirm({
        title: "DELETE CLASS CONFIRMATION",
        content: "Do you want to delete this class?",
        okText: "Yes",
        okType: "danger",
        onOk: async () => {
          await axios.delete(
            `http://localhost:8800/cart/removeFromCart/${currentUserId}/${classId}`
          );
          getReserveCart();
          notification.success({
            message: "Class deleted successfully",
          });
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Classname",
      dataIndex: "className",
      key: "className",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Image",
      dataIndex: "classImage",
      key: "classImage",
      render: (url) => (
        <img className="w-[5rem] rounded-lg" src={url} alt="Class Image" />
      ),
    },
    {
      title: "Class time",
      dataIndex: "classTime",
      key: "classTime",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <p>${text}/month</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={handleDeleteClass(record.classId)}
            className="py-[.3rem] px-[.7rem] rounded-lg bg-rose-200 hover:bg-rose-400 hover:text-white font-semibold"
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  // ---------------------------modal--------------------------------
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = (): void => {
    handleCloseReserveModal();
  };

  //-------------------------------handleCheckOut---------------------------
  const handleCheckOut = async () => {
    try {
      if (reserveCart.length > 0) {
        Modal.confirm({
          title: "CHECK OUT CONFIRMATION",
          content:
            "The payment can't be reversed once you click on YES. Do you want to check out now?",
          okText: "Yes",
          okType: "danger",
          onOk: async () => {
            await axios.post(`http://localhost:8800/cart/checkout`, {
              userId: currentUserId,
              classIds: classArray,
              total: total,
            });
            getReserveCart();
            notification.success({
              message: "Check out successfully",
            });
            handleCloseReserveModal();
          },
        });
      } else {
        notification.error({
          message: "Your cart is empty!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="">
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={900}
        footer={null}
        style={{ top: 80 }}
      >
        <div className="w-full h-full">
          <div className="flex justify-center items-center pt-[3rem] font-semibold text-2xl">
            CLASS REGISTRATION
          </div>
          <div className="mt-[1.5rem] px-[3.5rem]">
            <Table
              columns={columns}
              dataSource={reserveCart}
              pagination={{ pageSize: 2 }}
            />
          </div>
          <div className="flex justify-between mx-[3.8rem]">
            <Link to="/registration-history">
              <button className="py-[.3rem] px-[.7rem] rounded-lg bg-purple-200 hover:bg-purple-400 hover:text-white font-semibold mb-[2rem]">
                Registration history
              </button>
            </Link>
            <div>
              <span className="text-xl font-semibold">Total: ${total}</span>
              <button
                onClick={handleCheckOut}
                className="ml-[3rem] py-[.3rem] px-[.7rem] rounded-lg bg-blue-200 hover:bg-blue-400 hover:text-white font-semibold mb-[2rem]"
              >
                Checkout now
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Reservation;
