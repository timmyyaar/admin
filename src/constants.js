export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const ROLES = {
  ADMIN: "admin",
  CLEANER: "cleaner",
  CLIENT: "client",
};

export const USER_DATA_LOCAL_STORAGE_KEY = 'userData'

export const AUTH_TOKEN_COOKIE_KEY = 'authToken'
