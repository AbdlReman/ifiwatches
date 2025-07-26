// Utility functions for recurring countdown management

const STORAGE_KEY = 'dealOfTheDayTargetDate';

export const getStoredTargetDate = () => {
    try {
        const storedDate = localStorage.getItem(STORAGE_KEY);
        return storedDate ? new Date(storedDate) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

export const setStoredTargetDate = (date) => {
    try {
        localStorage.setItem(STORAGE_KEY, date.toISOString());
    } catch (error) {
        console.error('Error writing to localStorage:', error);
    }
};

export const createNewTargetDate = (cycleDays = 10) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + cycleDays);
    return newDate;
};

export const shouldResetCountdown = (targetDate) => {
    if (!targetDate) return true;
    const now = new Date();
    return targetDate <= now;
};

export const initializeCountdown = (cycleDays = 10) => {
    const storedDate = getStoredTargetDate();
    
    if (!storedDate || shouldResetCountdown(storedDate)) {
        const newDate = createNewTargetDate(cycleDays);
        setStoredTargetDate(newDate);
        return newDate.toISOString();
    }
    
    return storedDate.toISOString();
}; 