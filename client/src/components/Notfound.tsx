import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div>
      <div>
        <div className="container">
          <img className="notFoundPic" src="/medias/notfound2.png" alt="" />
          <p className="notFoundText">
            <i className="fa-regular fa-face-frown"></i>
            Oops...! Page not found!
          </p>
          <Link to="/">
            <button className="btn-backtohome">Back to homepage</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Notfound;
