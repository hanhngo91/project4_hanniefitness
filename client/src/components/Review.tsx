function Review() {
  return (
    <div className="flex flex-col justify-evenly min-h-screen bg-[#C1D0DB] py-[3rem] font-lora">
      <div className="flex  flex-col text-center pb-3">
        <p className="text-gray-600 font-archivo text-4xl font-semibold">
          WHAT OUR CLIENTS ARE SAYING
        </p>
      </div>
      <div className="flex justify-evenly gap-[3rem]">
        <article className="card">
          <div className="temporary_text">
            <img className="image" src="/medias/review1.jpg" alt="" />
          </div>
          <div className="card_content">
            <span className="card_title">Donna Bleaker, 31</span>
            <span className="card_subtitle">
              This is a subtitle of this page. Let us see how it looks on the
              Web.
            </span>
            <p className="card_description">
              "Boost your product and service's credibility by adding
              testimonials from your clients. People love recommendations so
              feedback from others who've tried it is invaluable."
            </p>
          </div>
        </article>
        <article className="card">
          <div className="temporary_text">
            <img className="image" src="/medias/review2.jpg" alt="" />
          </div>
          <div className="card_content">
            <span className="card_title">Thomas Xue, 36</span>
            <span className="card_subtitle">
              Thsi is a subtitle of this page. Let us see how it looks on the
              Web.
            </span>
            <p className="card_description">
              "Boost your product and service's credibility by adding
              testimonials from your clients. People love recommendations so
              feedback from others who've tried it is invaluable."
            </p>
          </div>
        </article>
        <article className="card">
          <div className="temporary_text">
            <img className="image" src="/medias/review3.jpg" alt="" />
          </div>
          <div className="card_content">
            <span className="card_title">Lauren Cross, 25</span>
            <span className="card_subtitle">
              Thsi is a subtitle of this page. Let us see how it looks on the
              Web.
            </span>
            <p className="card_description">
              "Boost your product and service's credibility by adding
              testimonials from your clients. People love recommendations so
              feedback from others who've tried it is invaluable."
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default Review;
