import PropTypes from "prop-types";
import { useState } from "react";
import clsx from "clsx";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const FunFactOneSingle = ({ data, spaceBottomClass, textAlignClass }) => {
  const [didViewCountUp, setDidViewCountUp] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Trigger count up when element comes into view
  if (inView && !didViewCountUp) {
    setDidViewCountUp(true);
  }

  return (
      <div className={clsx("single-count", textAlignClass, spaceBottomClass)}>
        <div className="count-icon">
          <i className={data.iconClass} />
        </div>
        <h2 className="count" ref={ref}>
          <CountUp end={didViewCountUp ? data.countNum : 0} />
        </h2>
        <span>{data.title}</span>
      </div>
  );
};

FunFactOneSingle.propTypes = {
  data: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  textAlignClass: PropTypes.string
};

export default FunFactOneSingle;
