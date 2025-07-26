// import { useState } from "react";
// import PropTypes from "prop-types";
// import clsx from "clsx";
// import { Link } from "react-router-dom";
// import ReactPlayer from "react-player";

// const VideoPopup = ({ spaceBottomClass }) => {
//   const [modalStatus, isOpen] = useState(false);
//   return (
//     <div className={clsx("video-popup", spaceBottomClass)}>
//       <div className="container">
//         <div className="row align-items-center">
//           <div className="col-lg-6">
//             <div className="video-popup__image">
//               <img
//                 src={
//                   process.env.PUBLIC_URL + "/assets/img/banner/banner-41.jpg"
//                 }
//                 alt=""
//                 className="img-fluid"
//               />
//             </div>
//           </div>
//           <div className="col-lg-6">
//             <div className="video-popup__content">
//               <h2 className="title mb-30">
//                 Supro is the modern luxury shopping destination
//               </h2>
//               <p className="text mb-30">
//                 Lorem ipsum dolor sit amet, consectetb adipisicing elit sed do
//                 eiusmod tempor incididunt.
//               </p>
//               <div className="link mb-30">
//                 <Link to={process.env.PUBLIC_URL + "/about"}>
//                   More About Us
//                 </Link>
//               </div>
//               {modalStatus && (
//                 <div className="video-modal-overlay" onClick={() => isOpen(false)}>
//                   <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
//                     <button className="video-modal-close" onClick={() => isOpen(false)}>
//                       ×
//                     </button>
//                     <ReactPlayer
//                       url={`https://www.youtube.com/watch?v=feOScd2HdiU`}
//                       width="100%"
//                       height="100%"
//                       playing={true}
//                       controls={true}
//                     />
//                   </div>
//                 </div>
//               )}
//               <button onClick={() => isOpen(true)}>
//                 <i className="fa fa-play-circle"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <style jsx>{`
//         .video-modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: rgba(0, 0, 0, 0.8);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 9999;
//         }
        
//         .video-modal-content {
//           position: relative;
//           width: 90%;
//           max-width: 800px;
//           height: 60vh;
//           background: #000;
//         }
        
//         .video-modal-close {
//           position: absolute;
//           top: -40px;
//           right: 0;
//           background: none;
//           border: none;
//           color: white;
//           font-size: 30px;
//           cursor: pointer;
//           z-index: 10000;
//         }
//       `}</style>
//     </div>
//   );
// };

// VideoPopup.propTypes = {
//   spaceBottomClass: PropTypes.string
// };

// export default VideoPopup;
import React from 'react'

const VideoPopup = () => {
  return (
    <div>VideoPopup</div>
  )
}

export default VideoPopup
