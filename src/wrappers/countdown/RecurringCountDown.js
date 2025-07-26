import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import RecurringCountdownTimer from "../../components/countdown/recurring-countdown";

const RecurringCountDown = ({ 
  spaceTopClass, 
  spaceBottomClass, 
  bgImg, 
  cycleDays = 10 
}) => {
  return (
    <div
      className={clsx("funfact-area", spaceTopClass, spaceBottomClass)}
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL + bgImg})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6 ms-auto">
            <div className="funfact-content text-center">
              <h2>Deal of the day</h2>
              <div className="timer">
                <RecurringCountdownTimer cycleDays={cycleDays} />
              </div>
              <div className="funfact-btn btn-hover">
                <Link to={process.env.PUBLIC_URL + "/shop"}>
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RecurringCountDown.propTypes = {
  bgImg: PropTypes.string,
  cycleDays: PropTypes.number,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default RecurringCountDown; 