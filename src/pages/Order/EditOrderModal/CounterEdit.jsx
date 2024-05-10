import { BRACKETS_REGEX } from "../../../constants";
import { useEffect, useState } from "react";
import {
  getPriceFromCounterByService,
  getRoundedServicePrice,
  getServicePriceBasedOnManualCleaners,
} from "../priceUtils";
import CounterType from "./CounterType";
import CounterField from "./counter/CounterField";

export const COUNTER_TYPE = {
  DEFAULT: "Default",
  SQUARE_METERS: "Square meters",
};

export const NON_ZERO_COUNTER_MAIN_SERVICES = [
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
  const isOriginalCounterSquareMeters = counter.includes("square_meters_total");

  const [counterType, setCounterType] = useState(
    isOriginalCounterSquareMeters
      ? COUNTER_TYPE.SQUARE_METERS
      : COUNTER_TYPE.DEFAULT
  );
  const [fields, setFields] = useState(originalCounter);
  const isSquareMetersCounter = counterType === COUNTER_TYPE.SQUARE_METERS;

  const originalCounterPrice = getServicePriceBasedOnManualCleaners(
    getPriceFromCounterByService(
      prices,
      title,
      originalCounter,
      isOriginalCounterSquareMeters
    ) * (isPrivateHouse ? 1.3 : 1),
    cleanersCount - manualCleanersCount,
    manualCleanersCount
  );
  const counterPrice = getServicePriceBasedOnManualCleaners(
    getPriceFromCounterByService(prices, title, fields, isSquareMetersCounter) *
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

    onPriceChange(
      getRoundedServicePrice(orderPrice + counterPriceDifferenceWithDiscount)
    );
    onOriginalPriceChange(
      getRoundedServicePrice(orderPriceOriginal + counterPriceDifference)
    );

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

  return (
    <div className="d-flex flex-column _gap-3">
      {NON_ZERO_COUNTER_MAIN_SERVICES.includes(title) && (
        <CounterType
          counterType={counterType}
          setCounterType={setCounterType}
          setFields={setFields}
          t={t}
        />
      )}
      {fields.map((field) =>
        field.type === FIELD_TYPE.COUNTER ? (
          <CounterField
            field={field}
            setFields={setFields}
            t={t}
            title={title}
          />
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
