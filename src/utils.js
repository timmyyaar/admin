import Cookies from "js-cookie";
import {
  AUTH_TOKEN_COOKIE_KEY,
  ROLES,
  USER_DATA_LOCAL_STORAGE_KEY,
} from "./constants";
import EventEmitter from "./eventEmitter";

export const logOut = () => {
  localStorage.removeItem(USER_DATA_LOCAL_STORAGE_KEY);
  Cookies.remove(AUTH_TOKEN_COOKIE_KEY);
};

export const getUserId = () => {
  const localStorageUserData = localStorage.getItem(
    USER_DATA_LOCAL_STORAGE_KEY
  );

  if (!localStorageUserData) {
    return false;
  }

  return JSON.parse(localStorageUserData).id;
};

export const getUserEmail = () => {
  const localStorageUserData = localStorage.getItem(
    USER_DATA_LOCAL_STORAGE_KEY
  );

  if (!localStorageUserData) {
    return false;
  }

  return JSON.parse(localStorageUserData).email;
};

export const isAdmin = () => {
  const localStorageUserData = localStorage.getItem(
    USER_DATA_LOCAL_STORAGE_KEY
  );

  if (!localStorageUserData) {
    return false;
  }

  return JSON.parse(localStorageUserData).role === ROLES.ADMIN;
};

export const isCleaner = () => {
  const localStorageUserData = localStorage.getItem(
    USER_DATA_LOCAL_STORAGE_KEY
  );

  if (!localStorageUserData) {
    return false;
  }

  return JSON.parse(localStorageUserData).role === ROLES.CLEANER;
};

export const isDryCleaner = () => {
  const localStorageUserData = localStorage.getItem(
    USER_DATA_LOCAL_STORAGE_KEY
  );

  if (!localStorageUserData) {
    return false;
  }

  return JSON.parse(localStorageUserData).role === ROLES.CLEANER_DRY;
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

  const day = dateArray[0];
  const month = dateArray[1];
  const year = dateArray[2];

  return new Date(`${year}-${month}-${day}`);
};

export const getDateTimeObjectFromString = (string) => {
  const dateString = string.match(/([^\s]+)/)[0];
  const timeString = string.slice(-5);

  const endTimeDay = dateString.match(/.+?(?=\/)/)[0];
  const endTimeMonth = dateString.slice(-7, -5);
  const endTimeYear = dateString.slice(-4);
  const endTimeHours = timeString.slice(-5, -3);
  const endTimeMinutes = timeString.slice(-2);

  const providedDateString = `${endTimeYear}-${endTimeMonth}-${endTimeDay} ${endTimeHours}:${endTimeMinutes}`;

  return new Date(providedDateString);
};

export const getDateString = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const twoDigitsMonth = month < 10 ? `0${month}` : month;
  const year = date.getFullYear();

  return `${day}/${twoDigitsMonth}/${year}`;
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
