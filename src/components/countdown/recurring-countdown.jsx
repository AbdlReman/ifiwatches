import clsx from "clsx";
import PropTypes from "prop-types";
import useRecurringCountdown from "../../hooks/use-recurring-countdown";
import DateTimeDisplay from "./date-time-display";

const RecurringCountdownTimer = ({ className, cycleDays = 10 }) => {
    const [days, hours, minutes, seconds] = useRecurringCountdown(cycleDays);

    return (
        <div
            className={clsx("countdown-timer", className)}
        >
            <DateTimeDisplay value={days} type="Days" />
            <DateTimeDisplay value={hours} type="Hours" />
            <DateTimeDisplay value={minutes} type="Minutes" />
            <DateTimeDisplay value={seconds} type="Seconds" />
        </div>
    );
};

RecurringCountdownTimer.propTypes = {
    className: PropTypes.string,
    cycleDays: PropTypes.number,
};

export default RecurringCountdownTimer; 