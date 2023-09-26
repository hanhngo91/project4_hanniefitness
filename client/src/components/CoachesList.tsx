import axios from "axios";
import { useState, useEffect } from "react";

interface interfaceCoach {
  coachId: string;
  coachName: string;
  coachImage: string;
  major: string;
  intro: string;
}

function CoachesList(): any {
  const [coaches, setCoaches] = useState<interfaceCoach[]>();

  //Render data:
  const getCoaches = async () => {
    try {
      const response = await axios.get("http://localhost:8800/data/coaches");
      setCoaches(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCoaches();
  }, []);

  return (
    <div className="pt-[3rem] bg-[#EED7C1]">
      <div className="text-[3rem] font-semibold flex justify-center mt-[.5rem] mb-[2rem] text-gray-600">
        OUR COACHES
      </div>
      <div className="pb-[3rem] mx-[3rem] grid grid-cols-4 gap-5">
        {Array.isArray(coaches) && coaches?.length > 0 ? (
          coaches?.map((coach) => (
            <div className="card4" key={coach?.coachId}>
              <div className="header4">
                <div className="image4">
                  <img src={coach?.coachImage} alt="" />
                </div>
                <div>
                  <p className="name4">{coach?.coachName}</p>
                  <p className="text-[.8rem] text-gray-500">{coach?.major}</p>
                </div>
              </div>
              <p className="message4">"{coach?.intro}"</p>
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
  );
}

export default CoachesList;
