import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Component } from "react";
import Slider from "react-slick";

export default class CenterMode extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 3000,
      cssEase: "linear",
    };
    return (
      <div className="overflow-hidden h-[15.5rem]">
        <Slider {...settings}>
          <div>
            <img src="/medias/coaches/coach1.jpg" alt="" />
          </div>
          <div>
            <img src="/medias/coaches/coach2.jpg" alt="" />
          </div>
          <div>
            <img src="/medias/coaches/coach3.jpg" alt="" />
          </div>
          <div>
            <img src="/medias/coaches/coach4.jpg" alt="" />
          </div>
          <div>
            <img src="/medias/coaches/coach6.jpg" alt="" />
          </div>
          <div>
            <img src="/medias/coaches/coach7.jpg" alt="" />
          </div>
          <div>
            <img src="/medias/coaches/coach8.jpg" alt="" />
          </div>
          <div>
            <img src="/medias/coaches/coach9.jpg" alt="" />
          </div>
          <div>
            <img src="/medias/coaches/coach10.jpg" alt="" />
          </div>
        </Slider>
      </div>
    );
  }
}
