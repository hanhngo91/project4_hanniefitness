import About from "../components/About";
import Footer from "../components/Footer";
import Landing from "../components/Landing";
import Navbar from "../components/Navbar";
import Offer from "../components/Offer";
import Review from "../components/Review";

function Home() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="overflow-hidden w-full h-screen">
        <Landing />
      </div>
      <div>
        <About />
      </div>
      <div>
        <Offer />
      </div>
      <div>
        <Review />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
