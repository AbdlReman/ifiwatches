import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";

const HeaderTop = ({ borderStyle }) => {
  const currency = useSelector((state) => state.currency);
  return (
    <div className="header-top-wrapper">
      <div className="header-top-container">
        <div className="header-marquee">
          <div className="marquee-content">
            <span className="marquee-item">Call Us 03180977696</span>
            <span className="marquee-separator">•</span>
            <span className="marquee-item">
              Free delivery on order over{" "}
              <span className="highlight">
                {"Rs "+ (20000 * currency.currencyRate).toFixed(2)}
              </span>
            </span>
            <span className="marquee-separator">•</span>
            <span className="marquee-item">Call Us 03180977696</span>
            <span className="marquee-separator">•</span>
            <span className="marquee-item">
              Free delivery on order over{" "}
              <span className="highlight">
                {"Rs "+ (20000 * currency.currencyRate).toFixed(2)}
              </span>
            </span>
            <span className="marquee-separator">•</span>
            <span className="marquee-item">Call Us 03180977696</span>
            <span className="marquee-separator">•</span>
            <span className="marquee-item">
              Free delivery on order over{" "}
              <span className="highlight">
                {"Rs "+ (20000 * currency.currencyRate).toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>
      <style>
        {`
          .header-top-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
          }
          
          .header-top-container {
            position: relative;
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            overflow: hidden;
           
            padding: 8px 0;
            min-height: 20px;
            box-sizing: border-box;
          }
          
          .header-marquee {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            margin: 0;
            padding: 0;
          }
          
          .marquee-content {
            display: inline-block;
            animation: marquee 15s linear infinite;
            white-space: nowrap;
            transform: translateX(0);
            opacity: 1;
            padding-left: 100%;
          }
          
          .marquee-item {
            display: inline-block;
            margin-right: 30px;
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
          
          .marquee-separator {
            display: inline-block;
            margin: 0 15px;
            color: #666;
            font-weight: bold;
          }
          
          .highlight {
            color:#daaa58;
            font-weight: 600;
          }
          
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          /* Tablet responsive */
          @media (max-width: 768px) {
            .header-top-container {
              padding: 6px 0;
              min-height: 18px;
            }
            
            .marquee-item {
              font-size: 12px;
              margin-right: 20px;
            }
            
            .marquee-separator {
              margin: 0 10px;
            }
            
            .marquee-content {
              animation-duration: 12s;
            }
          }
          
          /* Mobile responsive */
          @media (max-width: 480px) {
            .header-top-container {
              padding: 5px 0;
              min-height: 16px;
            }
            
            .marquee-item {
              font-size: 11px;
              margin-right: 15px;
            }
            
            .marquee-separator {
              margin: 0 8px;
            }
            
            .marquee-content {
              animation-duration: 10s;
            }
          }
          
          /* Small mobile responsive */
          @media (max-width: 360px) {
            .header-top-container {
              padding: 4px 0;
              min-height: 14px;
            }
            
            .marquee-item {
              font-size: 10px;
              margin-right: 12px;
            }
            
            .marquee-separator {
              margin: 0 6px;
            }
            
            .marquee-content {
              animation-duration: 8s;
            }
          }
          
          /* Large screens */
          @media (min-width: 1200px) {
            .header-top-container {
              padding: 10px 0;
              min-height: 22px;
            }
            
            .marquee-item {
              font-size: 15px;
              margin-right: 35px;
            }
            
            .marquee-separator {
              margin: 0 18px;
            }
            
            .marquee-content {
              animation-duration: 18s;
            }
          }
          
          /* Fix for very small screens */
          @media (max-width: 320px) {
            .header-top-container {
              padding: 3px 0;
              min-height: 12px;
            }
            
            .marquee-item {
              font-size: 9px;
              margin-right: 10px;
            }
            
            .marquee-separator {
              margin: 0 5px;
            }
            
            .marquee-content {
              animation-duration: 6s;
            }
          }
        `}
      </style>
    </div>
  );
};

HeaderTop.propTypes = {
  borderStyle: PropTypes.string,
};

export default HeaderTop;
