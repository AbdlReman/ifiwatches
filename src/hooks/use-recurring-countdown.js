import { useEffect, useState, useCallback } from "react";
import { 
    initializeCountdown, 
    createNewTargetDate, 
    setStoredTargetDate 
} from "../helpers/recurring-countdown";

const getReturnValues = (countDown) => {
    const isExpired = countDown <= 0;
    // calculate time left
    if (!isExpired) {
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (countDown % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

        return [days, hours, minutes, seconds];
    }
    return [0, 0, 0, 0];
};

const useRecurringCountdown = (cycleDays = 10) => {
    const [targetDate, setTargetDate] = useState(() => {
        return initializeCountdown(cycleDays);
    });

    const [countDown, setCountDown] = useState(() => {
        const countDownDate = new Date(targetDate).getTime();
        return countDownDate - new Date().getTime();
    });

    const resetCountdown = useCallback(() => {
        const newDate = createNewTargetDate(cycleDays);
        const newTargetDate = newDate.toISOString();
        setTargetDate(newTargetDate);
        setStoredTargetDate(newDate);
        setCountDown(newDate.getTime() - new Date().getTime());
    }, [cycleDays]);

    useEffect(() => {
        const interval = setInterval(() => {
            const countDownDate = new Date(targetDate).getTime();
            const newCountDown = countDownDate - new Date().getTime();
            
            // If countdown has expired, reset it
            if (newCountDown <= 0) {
                resetCountdown();
            } else {
                setCountDown(newCountDown);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate, countDown, resetCountdown]);

    return getReturnValues(countDown);
};

export default useRecurringCountdown; 