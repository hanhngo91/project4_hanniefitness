import { useState, useEffect } from "react";
import ClassDetails from "./ClassDetails";
import axios from "axios";
import { notification } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { addToCart } from "../redux/reserveCart";
import { resetStatus } from "../redux/authSlice";

export interface interfaceClass {
  classId: string;
  className: string;
  classImage: string;
  coachImage: string;
  slots: number | string;
  classInfo: string;
  major: string;
  coachName: string;
  classTime: string;
  price: number;
}

function GroupClasses() {
  const [openClassDetail, setOpenClassDetail] = useState(false); //detail modal
  const [classes, setClasses] = useState<interfaceClass[]>([]); //classes data
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null); //selected class id
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const arrayCurrentUserLength = Object.keys(currentUser).length;
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.cart.error);

  useEffect(() => {
    if (error) {
      notification.error({
        message: error,
      });
    }
    dispatch(resetStatus());
  }, [error]);

  //-----------------open class detail modal---------------------
  const showModalClassDetails = (classId: string) => {
    setSelectedClassId(classId);
    setOpenClassDetail(true);
  };

  const handleCloseClassDetail = (): any => {
    setOpenClassDetail(false);
  };

  //Render classes data:
  const getClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8800/data/classes");
      setClasses(response.data.data as interfaceClass[]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  //Get user's reserveCart:
  const currentUserId = currentUser.userId;

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
  }, [reserveCart]);

  const handleReserve = (classId: string) => {
    //Check if slots is 0:
    const selectedClass = classes.find(
      (classItem) => classItem.classId === classId
    );

    if (arrayCurrentUserLength === 0) {
      notification.error({
        message: "Please login to reserve class!",
      });
      return;
    } else if (arrayCurrentUserLength > 0) {
      if (Number(selectedClass?.slots) === 0) {
        notification.error({
          message: "This class is full!",
        });
        return;
      }

      // check if class is already in cart:
      const isAlreadyInCart = reserveCart.some(
        (item: any) =>
          item?.classId === classId && item?.userId === currentUserId //true or false
      );

      if (isAlreadyInCart) {
        notification.error({
          message: "This class is already in your cart!",
        });
        return;
      }

      //add class to cart:
      dispatch(
        addToCart({
          userId:
            typeof currentUser.userId === "string" ? currentUser.userId : "",
          classId: classId,
        })
      );
      getReserveCart();
      getClasses();
      notification.success({
        message: "Class added to your cart successfully!",
      });
      return;
    }
  };

  return (
    <>
      {openClassDetail ? (
        <ClassDetails
          handleCloseClassDetail={handleCloseClassDetail}
          classes={classes}
          selectedClassId={selectedClassId}
        />
      ) : (
        <></>
      )}

      <div className="mt-[5rem] mx-[4rem] mb-[4rem] bg-[#FDFFF5]">
        <div className="text-[3rem] font-semibold flex justify-center mb-[2rem] text-gray-600">
          GROUP CLASSES
        </div>
        <div className="grid grid-cols-4 gap-8 ">
          {Array.isArray(classes) && classes?.length > 0 ? (
            classes?.map((classItem) => (
              <div className="card3" key={classItem.classId}>
                <div className="card__img">
                  <img src={classItem.classImage} alt="" />
                </div>
                <div className="card__avatar3">
                  <img src={classItem.coachImage} alt="" />
                </div>
                <div className="card__title">{classItem.className}</div>
                {parseInt(classItem.slots.toString()) === 0 ? (
                  <div className="card__subtitle">Full</div>
                ) : (
                  <div className="card__subtitle">
                    Slots left: {classItem.slots}
                  </div>
                )}

                <div className="card__wrapper">
                  <button
                    className="card__btn"
                    onClick={() => showModalClassDetails(classItem.classId)}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleReserve(classItem.classId)}
                    className="card__btn card__btn-solid"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="loader flex justify-center">
              <p className="text">
                <span className="letter letter1">L</span>
                <span className="letter letter2">o</span>
                <span className="letter letter3">a</span>
                <span className="letter letter4">d</span>
                <span className="letter letter5">i</span>
                <span className="letter letter6">n</span>
                <span className="letter letter7">g</span>
                <span className="letter letter8">.</span>
                <span className="letter letter9">.</span>
                <span className="letter letter10">.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GroupClasses;
