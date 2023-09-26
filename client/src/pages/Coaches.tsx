import CoachesList from "../components/CoachesList";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CoachesSlider from "../components/CoachesSlider";

function Coaches() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="mt-[3.2rem] w-full">
        <CoachesSlider />
      </div>
      <div>
        <CoachesList />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Coaches;
