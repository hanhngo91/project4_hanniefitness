import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Component } from "react";
import Slider from "react-slick";

export default class PauseOnHover extends Component {
  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
    };
    return (
      <div>
        <h2>Pause On Hover</h2>
        <Slider {...settings}>
          <div>
            <img src="/medias/landing.gif" alt="landing1" />
          </div>
          <div>
            <img src="/medias/landing2.gif" alt="landing2" />
          </div>
          <div>
            <img src="/medias/landing3.gif" alt="landing3" />
          </div>
        </Slider>
      </div>
    );
  }
}
