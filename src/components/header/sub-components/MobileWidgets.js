import { Link } from "react-router-dom";

const MobileWidgets = () => {
  return (
    <div className="header-offcanvas-widget">
      <div className="header-offcanvas-widget-single">
        <div className="header-offcanvas-widget-content">
          <p>Need help? Call us:</p>
          <p>
            <a href="tel://031809776967">03180977696</a>
          </p>
          <p>
            <a href="mailto:info@ifiwatches.pk">info@ifiwatches.pk</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileWidgets;
