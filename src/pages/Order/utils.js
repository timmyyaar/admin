import {
  getDateString,
  getDateTimeObjectFromString,
  getTimeUnitWithPrefix,
} from "../../utils";
import { BRACKETS_REGEX, ORDER_STATUS, PAYMENT_STATUS } from "../../constants";

export const getEstimateInTimeFormat = (estimate) => {
  const estimateArray = estimate.split(", ");
  const estimateHours = +estimateArray[0].slice(
    0,
    estimateArray[0].indexOf("h")
  );
  const estimateMinutes = +estimateArray[1].slice(
    0,
    estimateArray[1].indexOf("m")
  );

  const estimateHoursWithPrefix = getTimeUnitWithPrefix(estimateHours);
  const estimateMinutesWithPrefix = getTimeUnitWithPrefix(estimateMinutes);

  return `${estimateHoursWithPrefix}:${estimateMinutesWithPrefix}`;
};

export const getEstimateInMinutes = (estimate) => {
  const estimateArray = estimate.split(", ");
  const estimateHours = +estimateArray[0].slice(
    0,
    estimateArray[0].indexOf("h")
  );
  const estimateMinutes = +estimateArray[1].slice(
    0,
    estimateArray[1].indexOf("m")
  );

  return estimateHours * 60 + estimateMinutes;
};

export const getEstimateInHoursMinutesFormat = (estimateInMinutes) => {
  const estimateHours = Math.trunc(estimateInMinutes / 60);

  const estimateMinutes = Math.trunc(estimateInMinutes % 60);

  return `${estimateHours}h, ${estimateMinutes}m`;
};

export const getOrderEndTime = (orderTime, estimate) => {
  const splitOrderTime = orderTime.split(":");
  const splitEstimateTime = getEstimateInTimeFormat(estimate).split(":");

  const hoursRaw = parseInt(splitOrderTime[0]) + parseInt(splitEstimateTime[0]);
  const minutesRaw =
    parseInt(splitOrderTime[1]) + parseInt(splitEstimateTime[1]);
  const hours = hoursRaw + Math.trunc(minutesRaw / 60);
  const minutes = minutesRaw % 60;

  return `${getTimeUnitWithPrefix(hours)}:${getTimeUnitWithPrefix(minutes)}`;
};

export const getOrderTimeSlot = (
  startTime,
  endTime,
  startTimeOfSlot,
  endTimeOfSlot
) => {
  const startTimeNumeric = Number(startTime.split(":").join("."));
  const endTimeNumeric = Number(endTime.split(":").join("."));

  if (startTimeNumeric >= endTimeOfSlot || endTimeNumeric <= startTimeOfSlot) {
    return null;
  }

  if (endTimeNumeric >= endTimeOfSlot) {
    if (startTimeNumeric <= startTimeOfSlot) {
      return `${startTimeOfSlot}:00 - ${endTimeOfSlot}:00`;
    } else {
      return `${startTime} - ${endTimeOfSlot}:00`;
    }
  }

  if (startTimeNumeric <= startTimeOfSlot) {
    return `${startTimeOfSlot}:00 - ${endTime}`;
  }

  return `${startTime} - ${endTime}`;
};

export const getOrderTimeSlots = (order) => {
  const startTime = order.date.split(" ")[1];
  const endTime = getOrderEndTime(startTime, order.estimate);

  const firstTimeSlot = getOrderTimeSlot(startTime, endTime, 6, 10);
  const secondTimeSlot = getOrderTimeSlot(startTime, endTime, 10, 14);
  const thirdTimeSlot = getOrderTimeSlot(startTime, endTime, 14, 18);
  const fourthTimeSlot = getOrderTimeSlot(startTime, endTime, 18, 22);

  return { firstTimeSlot, secondTimeSlot, thirdTimeSlot, fourthTimeSlot };
};

export const getFilteredCleanersForOrder = (cleaners, order, schedule) => {
  const getAdditionalPeriodFilter = (timeSlot, periodAdditional) => {
    if (!periodAdditional) {
      return false;
    } else {
      const timeSlotSplit = timeSlot.split(" - ");
      const schedulePeriodSplit = periodAdditional.split(" - ");
      const startTimeSlotNumeric = Number(
        timeSlotSplit[0].split(":").join(".")
      );
      const endTimeSlotNumeric = Number(timeSlotSplit[1].split(":").join("."));
      const startTimeScheduleNumeric = Number(
        schedulePeriodSplit[0].split(":").join(".")
      );
      const endTimeScheduleNumeric = Number(
        schedulePeriodSplit[1].split(":").join(".")
      );

      if (startTimeSlotNumeric <= startTimeScheduleNumeric) {
        return endTimeSlotNumeric <= startTimeScheduleNumeric;
      }

      return startTimeSlotNumeric >= endTimeScheduleNumeric;
    }
  };

  return cleaners.filter(({ id }) => {
    const cleanerSchedule = schedule.find(
      ({ employeeId, date }) =>
        employeeId === id &&
        date === getDateString(getDateTimeObjectFromString(order.date))
    );

    if (!cleanerSchedule) {
      return true;
    }

    const { firstTimeSlot, secondTimeSlot, thirdTimeSlot, fourthTimeSlot } =
      getOrderTimeSlots(order);

    if (firstTimeSlot && !cleanerSchedule.firstPeriod) {
      return getAdditionalPeriodFilter(
        firstTimeSlot,
        cleanerSchedule.firstPeriodAdditional
      );
    }

    if (secondTimeSlot && !cleanerSchedule.secondPeriod) {
      return getAdditionalPeriodFilter(
        secondTimeSlot,
        cleanerSchedule.secondPeriodAdditional
      );
    }

    if (thirdTimeSlot && !cleanerSchedule.thirdPeriod) {
      return getAdditionalPeriodFilter(
        thirdTimeSlot,
        cleanerSchedule.thirdPeriodAdditional
      );
    }

    if (fourthTimeSlot && !cleanerSchedule.fourthPeriod) {
      return getAdditionalPeriodFilter(
        fourthTimeSlot,
        cleanerSchedule.fourthPeriodAdditional
      );
    }

    return true;
  });
};

const SHOW_CORRIDOR_TITLES = [
  "Regular",
  "Deep",
  "Eco cleaning",
  "Move in/out",
  "After party",
  "While sickness",
  "Airbnb",
];

export const getTranslatedServices = (t, services, title) => {
  let transformedServicesString = services;

  if (SHOW_CORRIDOR_TITLES.includes(title)) {
    transformedServicesString = `${transformedServicesString}, ${t(
      "Corridor"
    )} (1)`;
  }

  services
    .split(BRACKETS_REGEX)
    .map((service) => service.trim())
    .forEach((service) => {
      transformedServicesString = transformedServicesString.replace(
        service,
        t(service)
      );
    });

  return transformedServicesString;
};

export const getSubServiceWithBalcony = (subService) => {
  const balconyMatch = subService.match(/Balcony_summery\s+\(\d+\)/)?.[0];

  if (!balconyMatch) {
    return subService;
  }

  const metersSquare = balconyMatch.match(/\d+/);
  const balconyWithMetersSquare = balconyMatch.replace(
    metersSquare,
    `${metersSquare}m2`
  );

  return subService.replace(balconyMatch, balconyWithMetersSquare);
};

export const getSubServiceWithCarpet = (subService) => {
  const carpetMatch = subService.match(
    /Carpet\sdry\scleaning_summery\s+\(\d+\)/
  )?.[0];

  if (!carpetMatch) {
    return subService;
  }

  const metersSquare = carpetMatch.match(/\d+/);
  const carpetWithMetersSquare = carpetMatch.replace(
    metersSquare,
    `${metersSquare}m2`
  );

  return subService.replace(carpetMatch, carpetWithMetersSquare);
};

export const getPaymentColorDependsOnStatus = (paymentStatus) => {
  switch (paymentStatus) {
    case PAYMENT_STATUS.PENDING:
      return "text-info";
    case PAYMENT_STATUS.FAILED:
      return "text-danger";
    case PAYMENT_STATUS.WAITING_FOR_CONFIRMATION:
      return "text-warning";
    case PAYMENT_STATUS.CONFIRMED:
      return "text-success";
    case PAYMENT_STATUS.CANCELED:
      return "text-secondary";
    default:
      return "text-white";
  }
};

export const getPaymentTextDependsOnStatus = (paymentStatus) => {
  switch (paymentStatus) {
    case PAYMENT_STATUS.PENDING:
      return "client_payment_waiting";
    case PAYMENT_STATUS.FAILED:
      return "client_payment_failed";
    case PAYMENT_STATUS.WAITING_FOR_CONFIRMATION:
      return "client_payment_waiting_for_confirmation";
    case PAYMENT_STATUS.CONFIRMED:
      return "client_payment_succeeded";
    case PAYMENT_STATUS.CANCELED:
      return "client_payment_canceled";
    default:
      return "";
  }
};

export const getIsOrderPassedButNotDone = ({ status, date }) =>
  ![ORDER_STATUS.DONE.value, ORDER_STATUS.CLOSED.value].includes(status) &&
  new Date() > getDateTimeObjectFromString(date);
