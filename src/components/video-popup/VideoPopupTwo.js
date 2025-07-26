import { useState } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import clsx from "clsx"

const VideoPopupTwo = ({ spaceBottomClass }) => {
  const [modalStatus, isOpen] = useState(false);
  return (
    <div
      className={clsx("video-popup-2", spaceBottomClass)}
    >
      <div
        className="video-popup-2__left bg-img"
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL + "/assets/img/bg/bg-7.jpg"
          })`
        }}
      >
        <div className="video-popup-2__content">
          <h2 className="title mb-30">
            Furniture 2024 <br /> Collections
          </h2>
          <p className="text mb-30">
            Lorem ipsum dolor sit amet consectetur adipisici elit sed do eiusm.
          </p>
          <div className="link">
            <Link to={process.env.PUBLIC_URL + "/about"}>Shop Now</Link>
          </div>
        </div>
        {modalStatus && (
          <div className="video-modal-overlay" onClick={() => isOpen(false)}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="video-modal-close" onClick={() => isOpen(false)}>
                ×
              </button>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=feOScd2HdiU`}
                width="100%"
                height="100%"
                playing={true}
                controls={true}
              />
            </div>
          </div>
        )}
        <div className="video-popup-2__button">
          <button onClick={() => isOpen(true)}>
            <img
              src={process.env.PUBLIC_URL + "/assets/img/icon-img/play.png"}
              alt=""
            />
          </button>
        </div>
      </div>
      <div
        className="video-popup-2__right bg-img"
        style={{
          backgroundImage: `url(${
            process.env.PUBLIC_URL + "/assets/img/bg/bg-8.jpg"
          })`
        }}
      ></div>
      <style jsx>{`
        .video-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .video-modal-content {
          position: relative;
          width: 72%;
          max-width: 800px;
          height: 60vh;
          background: #000;
        }
        
        .video-modal-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          z-index: 10000;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default VideoPopupTwo;
