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

export const request = async ({
  url,
  method = "GET",
  includeCredentials = true,
  headers = {},
  body,
}) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    ...(includeCredentials && { credentials: "include" }),
    ...(body && { body: JSON.stringify(body) }),
  });

  const parsedResponse = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      EventEmitter.emit("logOut");
    } else if (response.status === 500) {
      throw new Error("Server error!");
    } else {
      throw new Error(parsedResponse.message);
    }
  }

  return parsedResponse;
};
