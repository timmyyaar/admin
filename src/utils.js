import Cookies from "js-cookie";
import {
  AUTH_TOKEN_COOKIE_KEY,
  USER_DATA_LOCAL_STORAGE_KEY,
} from "./constants";
import EventEmitter from "./eventEmitter";

export const logOut = () => {
  localStorage.removeItem(USER_DATA_LOCAL_STORAGE_KEY);
  Cookies.remove(AUTH_TOKEN_COOKIE_KEY);
};

export const getFloatOneDigit = (number) => Number(number.toFixed(1));

export const request = async ({
  url,
  method = "GET",
  includeCredentials = true,
  headers = {},
  body,
}) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`, {
    method,
    headers:
      body instanceof FormData
        ? {}
        : { "Content-Type": "application/json", ...headers },
    ...(includeCredentials && { credentials: "include" }),
    ...(body && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  });

  const parsedResponse = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      EventEmitter.emit("logOut");
    } else if (response.status === 500) {
      throw new Error("Server error!");
    } else {
      // eslint-disable-next-line
      throw {
        code: response.status,
        message: parsedResponse.message,
      };
    }
  }

  return parsedResponse;
};

export const getDateObjectFromString = (string) => {
  const dateArray = string.split("/");

  const day = +dateArray[0];
  const month = +dateArray[1];
  const year = +dateArray[2];

  return new Date(year, month - 1, day);
};

export const getDateTimeObjectFromString = (string) => {
  const dateAndTime = string.split(" ");
  const dateString = dateAndTime[0];
  const timeString = dateAndTime[1];

  const [day, month, year] = dateString.split("/");
  const [hours, minutes] = timeString.split(":");

  return new Date(+year, +month - 1, +day, +hours, +minutes);
};

export const getDateString = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const twoDigitsMonth = month < 10 ? `0${month}` : month;
  const year = date.getFullYear();

  return `${day}/${twoDigitsMonth}/${year}`;
};

export const getTimeString = (date) => {
  const hours = date.getHours();
  const twoDigitsHours = hours < 10 ? `0${hours}` : hours;
  const minutes = date.getMinutes();
  const twoDigitsMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${twoDigitsHours}:${twoDigitsMinutes}`;
};

export const getDateTimeString = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const twoDigitsMonth = month < 10 ? `0${month}` : month;
  const year = date.getFullYear();
  const hours = date.getHours();
  const twoDigitsHours = hours < 10 ? `0${hours}` : hours;
  const minutes = date.getMinutes();
  const twoDigitsMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day}/${twoDigitsMonth}/${year} ${twoDigitsHours}:${twoDigitsMinutes}`;
};

export const getTimeRemaining = (endTime) => {
  const dateAndTime = endTime.split(" ");
  const dateString = dateAndTime[0];
  const timeString = dateAndTime[1];

  const [day, month, year] = dateString.split("/");
  const [hours, minutes] = timeString.split(":");

  const totalLeft =
    new Date(+year, +month - 1, +day, +hours, +minutes) - new Date();
  const secondsLeft = Math.floor((totalLeft / 1000) % 60);
  const minutesLeft = Math.floor((totalLeft / 1000 / 60) % 60);
  const hoursLeft = Math.floor((totalLeft / (1000 * 60 * 60)) % 24);
  const daysLeft = Math.floor(totalLeft / (1000 * 60 * 60 * 24));

  return {
    total: totalLeft,
    days: daysLeft,
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  };
};

export const getDatesBetween = (startDate, stopDate) => {
  const dateArray = [];

  let currentDate = new Date(startDate);

  const dayAfterStopDate = new Date(
    new Date(stopDate).setDate(stopDate.getDate() + 1)
  );

  while (currentDate <= dayAfterStopDate) {
    dateArray.push(new Date(currentDate));

    const currentDateCopy = new Date(currentDate);

    currentDateCopy.setDate(currentDateCopy.getDate() + 1);

    currentDate = currentDateCopy;
  }

  return dateArray;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getTimeUnitWithPrefix = (timeUnit) =>
  timeUnit < 10 ? `0${timeUnit}` : timeUnit;
