import PropTypes from "prop-types";

const LanguageCurrencyChanger = ({ currency }) => {
  return (
    <div className="language-currency-wrap">
      <div className="same-language-currency">
        {/* Phone number moved to marquee */}
      </div>
    </div>
  );
};

LanguageCurrencyChanger.propTypes = {
  currency: PropTypes.shape({}),
};

export default LanguageCurrencyChanger;
