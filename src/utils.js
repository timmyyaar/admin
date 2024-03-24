import Cookies from "js-cookie";
import {
  AUTH_TOKEN_COOKIE_KEY,
  ROLES,
  USER_DATA_LOCAL_STORAGE_KEY,
} from "./constants";

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

  return JSON.parse(localStorageUserData).id
}

export const getUserEmail = () => {
  const localStorageUserData = localStorage.getItem(
      USER_DATA_LOCAL_STORAGE_KEY
  );

  if (!localStorageUserData) {
    return false;
  }

  return JSON.parse(localStorageUserData).email
}

export const isAdmin = () => {
  const localStorageUserData = localStorage.getItem(
    USER_DATA_LOCAL_STORAGE_KEY
  );

  if (!localStorageUserData) {
    return false;
  }

  return JSON.parse(localStorageUserData).role === ROLES.ADMIN;
};
