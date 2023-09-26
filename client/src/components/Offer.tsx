import { Link } from "react-router-dom";

function Offer() {
  return (
    <div className="min-h-screen bg-[#FDFFF5] flex flex-col items-center justify-center">
      <div className="text-center py-4">
        <p className="text-gray-600 font-archivo text-4xl font-semibold mb-2">
          WHAT WE OFFER
        </p>
        <p className="text-lg mb-2">
          We're committed to bringing you the best workout experience.
        </p>
      </div>
      <div className="flex justify-around gap-12">
        <div className="w-[20rem]  h-[3orem] flex items-center justify-center relative overflow-hidden ">
          <div className="w-full h-full bg-black opacity-30 absolute"></div>
          <div className="hover:scale-110 transition duration-700 ease-in-out cursor-pointer">
            <img
              className=" w-full h-full  object-cover "
              src="/medias/tour.jpg"
              alt="gym tour"
            />
            <p className="text-[#FDFFF5] text-lg px-[.5rem] font-bold absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              TOUR OUR GYM
            </p>
          </div>
        </div>
        <div className="w-[20rem]  h-[3orem] flex items-center justify-center relative overflow-hidden">
          <div className="w-full h-full bg-black opacity-30 absolute"></div>
          <Link to="classes">
            <div className="hover:scale-110 transition duration-700 ease-in-out cursor-pointer">
              <img
                className=" w-full h-full  object-cover "
                src="/medias/group.jpg"
                alt="group classes"
              />
              <p className="text-[#FDFFF5] text-lg px-[.5rem] font-bold absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                GROUP CLASSES
              </p>
            </div>
          </Link>
        </div>
        <div className="w-[20rem]  h-[3orem] flex items-center justify-center relative overflow-hidden">
          <div className="w-full h-full bg-black opacity-30 absolute"></div>
          <div className="hover:scale-110 transition duration-700 ease-in-out cursor-pointer">
            <img
              className=" w-full h-full object-cover "
              src="/medias/coach.jpg"
              alt="personal training"
            />
            <p className="text-[#FDFFF5] text-lg whitespace-nowrap px-[.5rem] font-bold absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              PERSONAL TRAINING
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Offer;
