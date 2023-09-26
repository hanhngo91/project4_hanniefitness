import { useState, useEffect } from "react";
import { Modal } from "antd";
import { notification } from "antd";
import axios from "axios";

function UpdateCoach({
  handleCloseModalUpdate,
  selectedCoach,
  coaches,
  getCoaches,
}: {
  handleCloseModalUpdate: () => any;
  selectedCoach: any;
  coaches: any;
  getCoaches: () => any;
}) {
  const [open, setOpen] = useState(true); //modal
  const [confirmLoading, setConfirmLoading] = useState(false); //modal
  const [selectedCoachData, setSelectedCoachData] = useState<any>(null); //for update modal
  const [picFile, setPicFile] = useState<string>("");

  const [formData, setFormData] = useState({
    coachImage: "",
    coachName: "",
    intro: "",
    major: "",
  });

  //Find selected coach in coaches array:
  const foundCoach = coaches?.find(
    (coach: any) => coach.coachId === selectedCoach
  );

  useEffect(() => {
    setSelectedCoachData(foundCoach);
  }, [foundCoach]);
  console.log("selected coach data-->", selectedCoachData);

  //Upload image:
  function convertFileImage(files: FileList | null) {
    if (files && files.length > 0) {
      const fileRef = files[0];
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const base64Image = ev.target?.result as string;
        setPicFile(base64Image);
        setFormData((prevFormData) => ({
          ...prevFormData,
          coachImage: base64Image,
        }));
      };
      reader.readAsDataURL(fileRef);
    }
  }

  useEffect(() => {
    if (selectedCoachData) {
      setFormData({
        coachImage: selectedCoachData.coachImage,
        coachName: selectedCoachData.coachName,
        intro: selectedCoachData.intro,
        major: selectedCoachData.major,
      });
    }
  }, [selectedCoachData]);

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      coachImage: picFile,
    }));
  }

  const { coachName, intro, major, coachImage } = formData;

  //Submit form update coach:
  const handleUpdateCoach = async (e: any) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append("coachImage", coachImage);
    updatedFormData.append("coachName", coachName);
    updatedFormData.append("intro", intro);
    updatedFormData.append("major", major);
    try {
      const response = await axios.put(
        `http://localhost:8800/data/coaches/update-coach/${selectedCoach}`,
        formData
      );
      if (response.data.status === "success") {
        notification.success({
          message: "Updated coach successfully!",
        });
        handleCloseModalUpdate();
        getCoaches();

        return;
      } else {
        notification.error({
          message: "Updating coach failed!",
        });
        return;
      }
    } catch (error: any) {
      if (error.response.status === 413) {
        notification.error({
          message: "Image must be smaller than 50MB!",
        });
        return;
      }
      console.log("error uploading coach-->", error.response.data);
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
    handleCloseModalUpdate();
  };

  return (
    <div>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
        footer={null}
      >
        <div className="updateCoach py-[2rem] px-[2.5rem]">
          <div className="flex justify-center items-center font-semibold text-3xl mb-[1rem]">
            UPDATE COACH DETAILS
          </div>
          <form onSubmit={handleUpdateCoach}>
            <table>
              <tr className="h-[4rem]">
                <th>Fields</th>
                <th>Values</th>
              </tr>
              <tr className="h-[4rem]">
                <td>CoachName:</td>
                <td>
                  <input
                    onChange={handleChangeInput}
                    placeholder="Enter coach name"
                    className="updateInput ml-[.5rem]"
                    type="text"
                    value={coachName}
                    name="coachName"
                    required
                  />
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>CoachImage:</td>
                <td>
                  <div className="relative">
                    <input
                      className="hidden"
                      onChange={(e) => convertFileImage(e.target.files)}
                      type="file"
                      name="coachImage"
                      id="coachImage"
                      required
                    />
                    <label className="pl-[1rem]" htmlFor="coachImage">
                      Choose an image &nbsp;
                      <i className="fa-regular fa-image"></i>
                    </label>
                    <span className="absolute left-[25%] top-[-80%]">
                      {picFile && picFile.indexOf("image/") > -1 ? (
                        <div className="flex items-center justify-center">
                          <div className="flex items-center justify-center">
                            <div className=" w-[5.5rem] rounded-lg overflow-hidden">
                              <img
                                className="w-full object-cover"
                                src={selectedCoachData?.coachImage}
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
                                src={picFile}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <div className=" w-[5.5rem] rounded-lg overflow-hidden">
                            <img
                              className="w-full object-cover"
                              src={selectedCoachData?.coachImage}
                            />
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>CoachIntro:</td>
                <td>
                  <input
                    onChange={handleChangeInput}
                    placeholder="Enter coach intro"
                    className="updateInput ml-[.5rem]"
                    type="text"
                    maxLength={250}
                    name="intro"
                    value={intro}
                    required
                  />
                </td>
              </tr>
              <tr className="h-[4rem]">
                <td>CoachMajor:</td>
                <td>
                  <input
                    onChange={handleChangeInput}
                    placeholder="Enter coach major"
                    className="updateInput ml-[.5rem]"
                    type="text"
                    name="major"
                    value={major}
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

export default UpdateCoach;
