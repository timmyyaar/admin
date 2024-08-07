import { capitalizeFirstLetter } from "./utils";

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const ROLES = {
  SUPERVISOR: "supervisor",
  ADMIN: "admin",
  CLEANER: "cleaner",
  CLEANER_DRY: "cleaner_dry",
  CLIENT: "client",
};

export const ROLES_OPTIONS = Object.values(ROLES).map((role) => ({
  value: role,
  label: role
    .split("_")
    .map((item) => capitalizeFirstLetter(item))
    .join(" "),
}));

export const ORDER_STATUS = {
  CREATED: { value: "created", label: "Created" },
  APPROVED: { value: "approved", label: "Approved" },
  IN_PROGRESS: { value: "in-progress", label: "In progress" },
  DONE: { value: "done", label: "Done" },
  CLOSED: { value: "closed", label: "Closed" },
};

export const ORDER_TYPE = {
  REGULAR: "Regular",
  DRY: "Dry cleaning",
  OZONATION: "Ozonation",
};

export const ORDER_TYPE_ADDITIONAL = {
  SUBSCRIPTION: "Subscription",
  ECO: "Eco cleaning",
  OFFICE: "Office",
  DEEP_KITCHEN: "Deep kitchen",
  CUSTOM: "Custom cleaning",
  DEEP: "Deep",
  MOVE: "Move in/out",
  AFTER_PARTY: "After party",
  WHILE_SICK: "While sickness",
  AIRBNB: "Airbnb",
  POST_CONSTRUCTION: "Post-construction",
  WINDOW: "Window cleaning",
};

export const BRACKETS_REGEX = /\([^()]*\)/;

export const POSITIVE_NUMBER_EMPTY_REGEX = /^(\s*|[1-9][0-9]*)+$/;

export const NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX = /^-?(\s*|[0-9\b])+$/;

export const NUMBER_EMPTY_REGEX = /^(\s*|\d+)$/;

export const NUMBER_FLOAT_EMPTY_REGEX = /^(\s*|((\d+)\.?(\s*|\d+)))$/;

export const FIGURE_BRACKETS_REGEX = /{([^}]*)}/g;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  WAITING_FOR_CONFIRMATION: "waiting_for_confirmation",
  FAILED: "failed",
  CONFIRMED: "confirmed",
  CANCELED: "canceled",
};

export const CITIES = {
  KRAKOW: "Krakow",
  WARSAW: "Warsaw",
};

export const CITIES_OPTIONS = Object.values(CITIES).map((city) => ({
  value: city,
  label: city,
}));
