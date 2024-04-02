export const getTimeRemaining = (endTime) => {
  const dateString = endTime.match(/([^\s]+)/)[0];
  const timeString = endTime.slice(-5);

  const endTimeDay = dateString.match(/.+?(?=\/)/)[0];
  const endTimeMonth = dateString.slice(-7, -5);
  const endTimeYear = dateString.slice(-4);
  const endTimeHours = timeString.slice(-5, -3);
  const endTimeMinutes = timeString.slice(-2);

  const providedDateString = `${endTimeYear}/${endTimeMonth}/${endTimeDay} ${endTimeHours}:${endTimeMinutes}`;

  const total = new Date(providedDateString) - new Date();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};
