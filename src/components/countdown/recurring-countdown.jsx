import clsx from "clsx";
import PropTypes from "prop-types";
import useRecurringCountdown from "../../hooks/use-recurring-countdown";
import DateTimeDisplay from "./date-time-display";

const RecurringCountdownTimer = ({ className, cycleDays = 10 }) => {
    const [days, hours, minutes, seconds] = useRecurringCountdown(cycleDays);

    return (
        <div
            className={clsx("timer timer-style", className)}
        >
            <DateTimeDisplay value={days} type="days" />
            <DateTimeDisplay value={hours} type="hours" />
            <DateTimeDisplay value={minutes} type="minutes" />
            <DateTimeDisplay value={seconds} type="secs" />
        </div>
    );
};

RecurringCountdownTimer.propTypes = {
    className: PropTypes.string,
    cycleDays: PropTypes.number,
};

export default RecurringCountdownTimer; 