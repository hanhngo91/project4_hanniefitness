import { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";

function AddCoach({ getCoaches }: { getCoaches: () => void }) {
  const [filebase64, setFileBase64] = useState<string>("");
  const [showImg, setShowImg] = useState(4);
  const [formData, setFormData] = useState({
    coachName: "",
    coachImage: "",
    intro: "",
    major: "",
  });

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
    setFormData({ ...formData, [name]: value, coachImage: filebase64 });
  }

  const { coachName, intro, major, coachImage } = formData;

  //Submit form:
  const handleAddCoach = async (e: any) => {
    console.log("formData-->", formData);
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append("coachName", coachName);
    updatedFormData.append("intro", intro);
    updatedFormData.append("major", major);
    updatedFormData.append("coachImage", coachImage);
    try {
      const response = await axios.post(
        "http://localhost:8800/data/coaches/add-coach",
        formData
      );
      if (response.data.status === "success") {
        notification.success({
          message: "Added coach successfully!",
        });
        getCoaches();
        setFormData({
          coachName: "",
          coachImage: "",
          intro: "",
          major: "",
        });
        return;
      } else {
        notification.error({
          message: "Adding coach failed!",
        });
        return;
      }
    } catch (error: any) {
      if (error.response.status === 413) {
        notification.error({
          message: "Image exceeds size 2MB!",
        });
      } else {
        console.log(error.response);
      }
    }
  };

  return (
    <div className="mt-[.5rem]">
      <form onSubmit={handleAddCoach}>
        <div
          style={{
            gridTemplateColumns: filebase64 ? "repeat(5,1fr)" : "repeat(4,1fr)",
          }}
          className={`grid gap-2 items-center`}
        >
          {/* ------------------coachName----------------- */}
          <div className="input-form">
            <input
              onChange={handleChangeInput}
              className="inputAddCoach"
              name="coachName"
              value={coachName}
              type="text"
              required
            />
            <label className="textUser">
              <span className="text-red-600 text-base">*</span>Enter coach name
            </label>
          </div>
          {/* ------------------coachImage----------------- */}
          <div className="input-form inputAddCoach flex">
            <input
              onChange={(e) => convertFile(e.target.files)}
              className="hidden"
              name="coachImage"
              type="file"
              id="coachImage"
              required
            />
            <label htmlFor="coachImage" className="">
              <span className="text-red-600 text-base">*</span> Choose coach
              image &nbsp;
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
          {/* ------------------intro----------------- */}
          <div className="input-form ">
            <input
              onChange={handleChangeInput}
              maxLength={250}
              className="inputAddCoach"
              name="intro"
              type="text"
              value={intro}
              required
            />
            <label className="textUser">
              <span className="text-red-600 text-base">*</span> Enter coach
              intro
            </label>
          </div>
          <select
            onChange={handleChangeInput}
            className="inputAddCoach"
            name="major"
            id="major"
            value={major}
            required
          >
            <option className="" value="">
              ---- Select coach major----
            </option>
            <option className="" value="HIIT coach">
              HIIT coach
            </option>
            <option className="" value="YOGA coach">
              YOGA coach
            </option>
            <option className="" value="Aerobics coach">
              Aerobics coach
            </option>
            <option className="" value="Cardio coach">
              Cardio coach
            </option>
            <option className="" value="Pilates coach">
              Pilates coach
            </option>
            <option className="" value="Cardio Kickboxing coach">
              Cardio Kickboxing coach
            </option>
            <option className="" value="Lifting weights coach">
              Lifting weights coach
            </option>
            <option className="" value="CrossFit coach">
              CrossFit coach
            </option>
            <option className="" value="Body Pump coach">
              Body Pump coach
            </option>
          </select>
        </div>
        <div>
          {/* ------------------classTime----------------- */}
          <div className="input-form mt-[1rem]">
            <button className="addCoach">Add coach</button>
          </div>
        </div>
      </form>
      <hr className="mt-[1rem] font-lg border-2" />
    </div>
  );
}

export default AddCoach;
