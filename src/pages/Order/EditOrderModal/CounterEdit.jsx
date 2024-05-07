import { BRACKETS_REGEX } from "../../../constants";
import { useEffect, useState } from "react";
import {
  getPriceFromCounterByService,
  getRoundedServicePrice,
  getServicePriceBasedOnManualCleaners,
} from "../priceUtils";

const NON_ZERO_COUNTER_MAIN_SERVICES = [
  "Deep",
  "Move in/out",
  "After party",
  "In a last minute",
  "While sickness",
  "Airbnb",
  "Regular",
  "Subscription",
  "Eco cleaning",
];

const KITCHEN_RADIOS = {
  KITCHEN: "Kitchen",
  KITCHENETTE: "Kitchenette",
};

const FIELD_TYPE = {
  COUNTER: "counter",
  SWITCHER: "switcher",
};

const isExistOrZero = (item) => Boolean(item || item === 0);

const getFieldsFromCounter = (counter) => {
  const splittedFields = counter
    .split(BRACKETS_REGEX)
    .filter((item) => item)
    .map((service) => service.trim());
  const itemsCounts = counter
    .split(" ")
    .filter((item) => item.includes("("))
    .map((item) => item.slice(item.indexOf("("), item.length))
    .map((item) => item.replaceAll(/[()]/g, ""))
    .map((item) => +item);

  return splittedFields.map((item, index) => ({
    title: item,
    type: isExistOrZero(itemsCounts[index])
      ? FIELD_TYPE.COUNTER
      : FIELD_TYPE.SWITCHER,
    ...(isExistOrZero(itemsCounts[index]) && {
      count: itemsCounts[index],
    }),
  }));
};

function CounterEdit({
  title,
  counter,
  prices,
  t,
  cleanersCount,
  manualCleanersCount,
  isPrivateHouse,
  setCounter,
  discount,
  orderPrice,
  orderPriceOriginal,
  onPriceChange,
  onOriginalPriceChange,
}) {
  const originalCounter = getFieldsFromCounter(counter);

  const [fields, setFields] = useState(originalCounter);

  const originalCounterPrice = getServicePriceBasedOnManualCleaners(
    getPriceFromCounterByService(prices, title, originalCounter) *
      (isPrivateHouse ? 1.3 : 1),
    cleanersCount - manualCleanersCount,
    manualCleanersCount
  );
  const counterPrice = getServicePriceBasedOnManualCleaners(
    getPriceFromCounterByService(prices, title, fields) *
      (isPrivateHouse ? 1.3 : 1),
    cleanersCount - manualCleanersCount,
    manualCleanersCount
  );

  useEffect(() => {
    const counterPriceDifference = counterPrice - originalCounterPrice;
    const counterPriceDifferenceWithDiscount = discount
      ? getRoundedServicePrice(
          counterPriceDifference * ((100 - discount) / 100)
        )
      : counterPriceDifference;

    onPriceChange(orderPrice + counterPriceDifferenceWithDiscount);
    onOriginalPriceChange(orderPriceOriginal + counterPriceDifference);

    //eslint-disable-next-line
  }, [counterPrice, originalCounterPrice]);

  useEffect(() => {
    setCounter(
      fields
        .map(({ title, count }) => (count ? title + "(" + count + ")" : title))
        .join(" ")
    );

    //eslint-disable-next-line
  }, [fields]);

  const minimumCounterValue = NON_ZERO_COUNTER_MAIN_SERVICES.includes(title)
    ? 1
    : 0;

  const onMinusClick = ({ count, title }) => {
    if (count === minimumCounterValue) {
      return;
    }

    setFields(
      fields.map((field) =>
        title === field.title ? { ...field, count: field.count - 1 } : field
      )
    );
  };

  const onPlusClick = ({ title }) => {
    setFields(
      fields.map((field) =>
        title === field.title ? { ...field, count: field.count + 1 } : field
      )
    );
  };

  return (
    <div className="d-flex flex-column _gap-3">
      {fields.map((field) =>
        field.type === FIELD_TYPE.COUNTER ? (
          <h4 className="d-flex align-items-center">
            <button
              className="btn btn-sm btn-secondary font-weight-bold _mr-2 rounded-circle icon-button-small"
              disabled={field.count === minimumCounterValue}
              onClick={() => onMinusClick(field)}
            >
              &ndash;
            </button>
            <span className="badge bg-secondary">
              {t(field.title)}
              {field.count}
            </span>
            <button
              className="btn btn-sm btn-secondary font-weight-bold _ml-2 rounded-circle icon-button-small"
              onClick={() => onPlusClick(field)}
            >
              +
            </button>
          </h4>
        ) : (
          <div className="d-flex">
            <div className="form-check _mr-3">
              <input
                className="form-check-input _cursor-pointer"
                type="radio"
                id={KITCHEN_RADIOS.KITCHEN}
                checked={field.title === KITCHEN_RADIOS.KITCHEN}
                onChange={() =>
                  setFields(
                    fields.map((field) =>
                      field.type === FIELD_TYPE.SWITCHER
                        ? { ...field, title: KITCHEN_RADIOS.KITCHEN }
                        : field
                    )
                  )
                }
              />
              <label
                className="form-check-label _cursor-pointer"
                htmlFor={KITCHEN_RADIOS.KITCHEN}
              >
                {t(KITCHEN_RADIOS.KITCHEN)}
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input _cursor-pointer"
                type="radio"
                id={KITCHEN_RADIOS.KITCHENETTE}
                checked={field.title === KITCHEN_RADIOS.KITCHENETTE}
                onChange={() =>
                  setFields(
                    fields.map((field) =>
                      field.type === FIELD_TYPE.SWITCHER
                        ? { ...field, title: KITCHEN_RADIOS.KITCHENETTE }
                        : field
                    )
                  )
                }
              />
              <label
                className="form-check-label _cursor-pointer"
                htmlFor={KITCHEN_RADIOS.KITCHENETTE}
              >
                {t(KITCHEN_RADIOS.KITCHENETTE)}
              </label>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default CounterEdit;
