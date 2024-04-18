import { ORDER_TYPE } from "../../constants";
import { getFloatOneDigit } from "../../utils";

export const getCleanerReward = ({
  title,
  price_original,
  cleaners_count,
  estimate,
}) => {
  const timeArray = estimate.split(", ");
  const hours = +timeArray[0].slice(0, timeArray[0].indexOf("h"));
  const minutes = +timeArray[1].slice(0, timeArray[1].indexOf("m"));
  const minutesPercentage = Number(((minutes * 100) / 60).toFixed(0));
  const numericEstimate = Number(`${hours}.${minutesPercentage}`);

  if ([ORDER_TYPE.DRY, ORDER_TYPE.OZONATION].includes(title)) {
    return getFloatOneDigit(price_original / 2 / cleaners_count);
  } else {
    if (price_original <= process.env.REACT_APP_MIDDLE_ORDER_ESTIMATE) {
      return (
        numericEstimate * process.env.REACT_APP_DEFAULT_ORDER_PER_HOUR_PRICE
      );
    } else if (
      price_original > process.env.REACT_APP_MIDDLE_ORDER_ESTIMATE &&
      price_original <= process.env.REACT_APP_HIGH_ORDER_ESTIMATE
    ) {
      return getFloatOneDigit(
        numericEstimate * process.env.REACT_APP_MIDDLE_ORDER_PER_HOUR_PRICE
      );
    } else {
      return getFloatOneDigit(
        numericEstimate * process.env.REACT_APP_HIGH_ORDER_PER_HOUR_PRICE
      );
    }
  }
};
