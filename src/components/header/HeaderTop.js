import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";

const HeaderTop = ({ borderStyle }) => {
  const currency = useSelector((state) => state.currency);
  return (
    <div>
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
      <style>
        {`
                     .header-marquee {
             overflow: hidden;
             white-space: nowrap;
             position: relative;
             background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
             padding: 8px 0;
             width: 100vw;
             margin: 0;
             min-height: 20px;
             left: 50%;
             transform: translateX(-50%);
           }
          
                                           .marquee-content {
              display: inline-block;
              animation: marquee 15s linear infinite;
              white-space: nowrap;
              transform: translateX(0);
              opacity: 1;
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
            color: #007bff;
            font-weight: 600;
          }
          
                     @keyframes marquee {
             0% {
               transform: translateX(0%);
             }
             100% {
               transform: translateX(-50%);
             }
           }
          
                     @media (max-width: 768px) {
             .marquee-item {
               font-size: 12px;
               margin-right: 20px;
             }
             
             .marquee-separator {
               margin: 0 10px;
             }
             
             .marquee-content {
               animation-duration: 10s;
             }
           }
          
                     @media (max-width: 480px) {
             .marquee-item {
               font-size: 11px;
               margin-right: 15px;
             }
             
             .marquee-separator {
               margin: 0 8px;
             }
             
             .marquee-content {
               animation-duration: 8s;
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
