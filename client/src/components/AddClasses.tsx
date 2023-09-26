import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";

function AddClasses() {
  const [filebase64, setFileBase64] = useState<string>("");
  const [showImg, setShowImg] = useState<number>(4);
  const [formData, setFormData] = useState({
    className: "",
    classImage: "",
    classInfo: "",
    coachId: "",
    slots: "",
    price: "",
    classTime: "",
  });

  //Get all Coaches:
  const [coaches, setCoaches] = useState<string[]>([]);
  const getCoaches = async () => {
    try {
      const response = await axios.get("http://localhost:8800/data/coaches");
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

  //Get all classes:
  const [classes, setClasses] = useState<string[]>([]);
  const getClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8800/data/classes");
      if (response.data.status === "success") {
        setClasses(response.data.data);
      } else {
        notification.error({
          message: "Get classes failed!",
        });
        return;
      }
    } catch (err) {
      console.log("get classes error-->", err);
    }
  };
  useEffect(() => {
    getClasses();
  }, [classes]);

  //Upload image:
  function convertFile(files: FileList | null) {
    if (files) {
      const fileRef = files[0] || "";
      const fileType: string = fileRef.type || "";
      const reader = new FileReader();
      reader.readAsBinaryString(fileRef);
      reader.onload = (ev: any) => {
        // convert it to base64
        setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`);
      };
    }
  }
  useEffect(() => {
    if (filebase64) {
      setShowImg(5);
    } else {
      setShowImg(4);
    }
  }, [filebase64]);

  //Handle change input:
  function handleChangeInput(e: any) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, classImage: filebase64 });
  }

  //submit add class:
  const { className, classImage, classInfo, coachId, slots, price, classTime } =
    formData;

  const handleAddClass = async (e: any) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append("className", className);
    updatedFormData.append("classImage", classImage);
    updatedFormData.append("classInfo", classInfo);
    updatedFormData.append("coachId", coachId);
    updatedFormData.append("slots", slots);
    updatedFormData.append("price", price);
    updatedFormData.append("classTime", classTime);
    try {
      const response = await axios.post(
        "http://localhost:8800/data/classes/add-class",
        formData
      );
      console.log("response add class-->", response.data.status);

      if (response.data.status == "success") {
        notification.success({
          message: "Added class successfully!",
        });
        getClasses();
        setFormData({
          className: "",
          classImage: "",
          classInfo: "",
          coachId: "",
          slots: "",
          price: "",
          classTime: "",
        });
      } else {
        notification.error({
          message: "Adding class failed!",
        });
        return;
      }
    } catch (error: any) {
      if (error.response.status === 413) {
        notification.error({
          message: "Image exceeds size 50MB!",
        });
      } else {
        console.log("error upload new class-->", error.response);
      }
    }
  };
  return (
    <div className="mt-[.5rem]">
      <form onSubmit={handleAddClass}>
        <div
          style={{
            gridTemplateColumns: filebase64 ? "repeat(5,1fr)" : "repeat(4,1fr)",
          }}
          className={`grid gap-2 items-center`}
        >
          {/* ------------------className----------------- */}
          <div className="input-form">
            <input
              className="inputAddCoach"
              onChange={handleChangeInput}
              name="className"
              type="text"
              required
            />
            <label className="textUser">
              <span className="text-red-600 text-base">*</span>&nbsp;Enter
              classname
            </label>
          </div>
          {/* ------------------classImage----------------- */}
          <div className="input-form inputAddCoach flex">
            <input
              onChange={(e) => convertFile(e.target.files)}
              className="hidden"
              name="classImage"
              type="file"
              id="classImage"
              accept="image/*"
              required
            />
            <label htmlFor="classImage" className="">
              <span className="text-red-600 text-base">*</span> Choose a image
              &nbsp;
              <i className="fa-regular fa-image"></i>
            </label>
          </div>
          {filebase64 && filebase64.indexOf("image/") > -1 && (
            <div className="flex items-center justify-center">
              <div className=" w-[6rem] rounded-lg overflow-hidden">
                <img className="w-full object-cover" src={filebase64} />
              </div>
            </div>
          )}
          {/* ------------------classInfo----------------- */}
          <div className="input-form">
            <input
              maxLength={300}
              className="inputAddCoach"
              onChange={handleChangeInput}
              name="classInfo"
              type="text"
              required
            />
            <label className="textUser">
              <span className="text-red-600 text-base">*</span> Enter class info
            </label>
          </div>
          {/* ------------------coach----------------- */}
          <div className="input-form">
            <select
              onChange={handleChangeInput}
              className="inputAddCoach"
              name="coachId"
              id=""
              required
            >
              <option value="">------ Select a coach ------</option>
              {coaches?.map((coach: any) => (
                <option value={coach.coachId}>{coach.coachName}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <div className="flex justify-start gap-2 items-center mt-[1.5rem]">
            {/* ------------------slots----------------- */}
            <div className="input-form">
              <input
                onChange={handleChangeInput}
                className="inputAddCoach"
                name="slots"
                type="text"
                required
              />
              <label className="textUser">
                <span className="text-red-600 text-base">*</span> Enter number
                of slots
              </label>
            </div>
            {/* ------------------price----------------- */}
            <div className="input-form">
              <input
                onChange={handleChangeInput}
                className="inputAddCoach"
                name="price"
                type="number"
                required
              />
              <label className="textUser">
                <span className="text-red-600 text-base">*</span> Enter price
              </label>
            </div>
            {/* ------------------classTime----------------- */}
            <div className="input-form">
              <select
                className="inputAddCoach"
                onChange={handleChangeInput}
                name="classTime"
                id="classTime"
                required
              >
                <option className="" value="">
                  ---- Select class time ----
                </option>
                <option className="" value="7AM-8AM every Mon, Wed, Fri">
                  7AM-8AM every Mon, Wed, Fri
                </option>
                <option className="" value="8AM-9AM every Mon, Wed, Fri">
                  8AM-9AM every Mon, Wed, Fri
                </option>
                <option className="" value="5PM-6PM every Mon, Wed, Fri">
                  5PM-6PM every Mon, Wed, Fri
                </option>
                <option className="" value="6PM-7PM every Mon, Wed, Fri">
                  6PM-7PM every Mon, Wed, Fri
                </option>
                <option className="" value="6AM-8AM every Sat & Sun">
                  6AM-8AM every Sat & Sun
                </option>
                <option className="" value="8AM-10AM every Sat & Sun">
                  8AM-10AM every Sat & Sun
                </option>
                <option className="" value="4PM-6PM every Sat & Sun">
                  4PM-6PM every Sat & Sun
                </option>
                <option className="" value="6PM-8PM every Sat & Sun">
                  6PM-8PM every Sat & Sun
                </option>
              </select>
            </div>
            <div>
              <button className="addClass">Add class</button>
            </div>
          </div>
        </div>
        <hr className="mt-[1rem] font-lg border-2" />
      </form>
    </div>
  );
}

export default AddClasses;
