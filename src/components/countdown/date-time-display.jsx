import PropTypes from "prop-types";

const DateTimeDisplay = ({ value, type }) => {
    return (
        <div className="countdown-item">
            <span className="countdown-value">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="countdown-label">
                {type}
            </span>
        </div>
    );
};

DateTimeDisplay.propTypes = {
    value: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
}

export default DateTimeDisplay;