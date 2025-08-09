import PropTypes from "prop-types";
import clsx from "clsx";

const SectionTitleWithText = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div className={clsx("welcome-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="welcome-content text-center">
          <h5>About Us</h5>
          <h1>Welcome to IFI – Iconic Futures Innovations</h1>
          <p>
            IFI (ifilifestyle) is a trusted multi-brand destination where style meets innovation. We curate premium quality products — luxury watches, signature perfumes, men’s fabrics, and fashion accessories — bringing affordability and value together with fast nationwide delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

SectionTitleWithText.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default SectionTitleWithText;
