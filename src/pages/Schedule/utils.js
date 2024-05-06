export const getTimeWithMinuteDifference = (time, symbol = "plus") => {
    const newTime = new Date(time);

    const minutes = time.getMinutes();

    newTime.setMinutes(symbol === "plus" ? minutes + 1 : minutes - 1);

    return newTime;
};

export const getMinOrMaxTime = (time) => {
    const splittedTime = time.split(":");

    const minOrMaxTime = new Date();
    minOrMaxTime.setHours(splittedTime[0]);
    minOrMaxTime.setMinutes(splittedTime[1]);
    minOrMaxTime.setSeconds(0);

    return minOrMaxTime;
};
