function About() {
  return (
    <div className="about-session flex py-7 px-8 bg-[#EED7C1] gap-20 min-h-screen items-center font-lora">
      <div className="flex flex-col items-end ml-2">
        <div className="text-start">
          <p className="text-[2.2rem] my-[2rem] font-medium">
            We're trained to help you become <br /> fitter and stronger
          </p>
        </div>
        <div className="flex flex-col text-start w-[25rem] justify-end">
          <p className="mb-[1rem] text-[1.2rem]">
            Welcome to our fitness website, your ultimate destination for health
            and wellness. Find workout routines, nutrition tips, and expert
            guidance to transform your lifestyle and become the best version of
            yourself. Join our community and embark on an exciting fitness
            journey.
          </p>

          <p className="mt-[1rem] text-[1.2rem]">
            Let's sweat, inspire, and achieve greatness together!
          </p>
        </div>
      </div>
      <div className="about-img w-[50%] overflow-hidden rounded-bl-[5rem] rounded-tr-[5rem]">
        <img src="/medias/about.png" alt="" />
      </div>
    </div>
  );
}

export default About;
