import { useState, useEffect } from "react";
import { Modal } from "antd";
import { notification } from "antd";
import axios from "axios";

function UpdateClass({
  handleCloseModalUpdateClass,
  selectedClass,
  classes,
  getClasses,
}: {
  handleCloseModalUpdateClass: () => any;
  selectedClass: any;
  classes: any;
  getClasses: () => any;
}) {
  const [open, setOpen] = useState(true); //modal
  const [picFileUpdate, setPicFileUpdate] = useState<string>("");
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false); //modal
  const [selectedClassData, setSelectedClassData] = useState<any>(null); //for update modal

  const [formUpdateClass, setFormUpdateClass] = useState({
    className: "",
    classImage: "",
    classInfo: "",
    coachId: "",
    slots: "",
    price: "",
    classTime: "",
  });

  //Find selected class:
  const foundClass = classes.find(
    (item: any) => item.classId === selectedClass
  );

  useEffect(() => {
    setSelectedClassData(foundClass);
  }, [foundClass]);

  //Upload image
  function convertFileImage(files: FileList | null) {
    if (files && files.length > 0) {
      const fileRef = files[0];
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const base64Image = ev.target?.result as string;
        setPicFileUpdate(base64Image);
        setFormUpdateClass((prevFormUpdateClass) => ({
          ...prevFormUpdateClass,
          coachImage: base64Image,
        }));
      };
      reader.readAsDataURL(fileRef);
    }
  }

  useEffect(() => {
    if (selectedClassData) {
      setFormUpdateClass({
        classImage: selectedClassData.classImage,
        className: selectedClassData.className,
        classInfo: selectedClassData.classInfo,
        coachId: selectedClassData.coachId,
        slots: selectedClassData.slots,
        price: selectedClassData.price,
        classTime: selectedClassData.classTime,
      });
    }
  }, [selectedClassData]);

  //Handle change input update:
  function handleChangeInputUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormUpdateClass((prevFormUpdateData) => ({
      ...prevFormUpdateData,
      [name]: value,
      classImage: picFileUpdate,
    }));
  }
  const { className, classImage, classInfo, coachId, slots, price, classTime } =
    formUpdateClass;

  //Submit update form:
  const handleUpdateClass = async (e: any) => {
    e.preventDefault();
    const updateFormData = new FormData();
    updateFormData.append("className", className);
    updateFormData.append("classImage", classImage);
    updateFormData.append("classInfo", classInfo);
    updateFormData.append("coachId", coachId);
    updateFormData.append("slots", slots);
    updateFormData.append("price", price);
    updateFormData.append("classTime", classTime);
    try {
      const response = await axios.put(
        `http://localhost:8800/data/classes/update-class/${selectedClass}`,
        formUpdateClass
      );
      if (response.data.status === "success") {
        notification.success({ message: "Update class successfully!" });
        getClasses();
        handleCloseModalUpdateClass();
        return;
      } else {
        notification.error({ message: "Updating class failed!" });
      }
    } catch (error: any) {
      if (error.response.status === 413) {
        notification.error({
          message: "Image must be smaller than 50MB!",
        });
      }
      console.log("error update class-->", error.response.data);
    }
  };

  // ---------------------------modal--------------------------------
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = (): void => {
    handleCloseModalUpdateClass();
  };

  //Get all coaches:
  const [coaches, setCoaches] = useState<any>([]);
  const getCoaches = async () => {
    try {
      const response = await axios.get("http://localhost:8800/data/coaches");
      console.log("response all coaches in add classes-->", response);
      if (response.data.status === "success") {
        setCoaches(response.data.data);
      } else {
        notification.error({
          message: "Get coaches failed!",
        });
        return;
      }
    } catch (err) {
      console.log("get coaches error-->", err);
    }
  };
  useEffect(() => {
    getCoaches();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
        footer={null}
        style={{ top: 0 }}
      >
        <div className="updateClass py-[2rem] px-[2.5rem]">
          <div className="flex justify-center items-center font-semibold text-3xl mb-[1rem]">
            UPDATE CLASS DETAILS
          </div>
          <form onSubmit={handleUpdateClass}>
            <table>
              <tr className="h-[4rem]">
                <th>Fields</th>
                <th>Values</th>
              </tr>
              <tr className="h-[4rem]">
                <td>Classname:</td>
                <td>
                  <input
                    onChange={handleChangeInputUpdate}
                    placeholder="Enter classname"
                    className="updateInput"
                    type="text"
                    value={className}
                    name="className"
                    required
                  />
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>Image:</td>

                <td>
                  <div className="relative">
                    <input
                      className="hidden"
                      onChange={(e) => convertFileImage(e.target.files)}
                      type="file"
                      name="classImage"
                      id="classImage"
                      required
                    />
                    <label className="pl-[.75rem]" htmlFor="classImage">
                      Choose a new image &nbsp;
                      <i className="fa-regular fa-image"></i>
                    </label>
                    <span className="absolute left-[25%] top-[-80%]">
                      {picFileUpdate && picFileUpdate.indexOf("image/") > -1 ? (
                        <div className="flex justify-start">
                          <div className="flex items-center justify-center">
                            <div className=" w-[5.5rem] rounded-lg overflow-hidden">
                              <img
                                className="w-full object-cover"
                                src={selectedClassData?.classImage}
                              />
                            </div>
                          </div>
                          <div className="mx-[2rem] flex justify-end items-center">
                            <i className="fa-solid fa-arrow-right"></i>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className=" w-[5.5rem] rounded-lg overflow-hidden">
                              <img
                                className="w-full object-cover"
                                src={picFileUpdate}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <div className=" w-[5.5rem] rounded-lg overflow-hidden">
                            <img
                              className="w-full object-cover"
                              src={selectedClassData?.classImage}
                            />
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>Class info:</td>
                <td>
                  <input
                    onChange={handleChangeInputUpdate}
                    placeholder="Enter class info"
                    className="updateInput"
                    type="text"
                    maxLength={250}
                    name="classInfo"
                    value={classInfo}
                    required
                  />
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>Coach:</td>
                <td>
                  <select
                    onChange={handleChangeInputUpdate}
                    className="updateInput"
                    name="coachId"
                    required
                  >
                    <option value="">{selectedClassData?.coachName}</option>
                    {coaches?.map((coach: any) => (
                      <option value={coach.coachId}>{coach.coachName}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>Class time:</td>
                <td>
                  <input
                    onChange={handleChangeInputUpdate}
                    placeholder="Enter class time"
                    className="updateInput"
                    type="text"
                    maxLength={30}
                    name="classTime"
                    value={classTime}
                    required
                  />
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>Slots:</td>
                <td>
                  <input
                    onChange={handleChangeInputUpdate}
                    placeholder="Enter slots"
                    className="updateInput"
                    type="text"
                    name="slots"
                    value={slots}
                    required
                  />
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>Price:</td>
                <td>
                  <input
                    onChange={handleChangeInputUpdate}
                    className="updateInput"
                    type="text"
                    name="price"
                    value={price}
                    required
                  />
                </td>
              </tr>
            </table>
            <button className="addCoach">Update</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default UpdateClass;
