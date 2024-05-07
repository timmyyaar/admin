import { capitalizeFirstLetter } from "../../utils";

export const getOzonationMultiplier = (prices, value) =>
  value > 120
    ? prices.ozonationBigArea
    : value > 50
    ? prices.ozonationMediumArea
    : prices.ozonationSmallArea;

const getDefaultCounterPrice = (counter, prices, prefix) => {
  const bedroomPrice = prices[`${prefix}Bedroom`];
  const bathroomPrice = prices[`${prefix}Bathroom`];
  const kitchenPrice = prices[`${prefix}Kitchen`];
  const defaultPrice = prices[`default${capitalizeFirstLetter(prefix)}`];

  return counter.reduce((acc, el, i) => {
    if (i === 0 && el.count > 1) acc += (el.count - 1) * bedroomPrice;
    if (i === 1 && el.count > 1) acc += (el.count - 1) * bathroomPrice;
    if (i === 2 && el.title === "Kitchen") acc += kitchenPrice;

    return acc;
  }, defaultPrice);
};

export const getPriceFromCounterByService = (prices, mainService, counter) => {
  switch (mainService) {
    case "Deep kitchen":
      return prices.defaultDeepKitchen;

    case "Deep":
      return getDefaultCounterPrice(counter, prices, "deep");

    case "Move in/out":
      return getDefaultCounterPrice(counter, prices, "moveInOut");

    case "After party":
      return getDefaultCounterPrice(counter, prices, "afterParty");

    case "In a last minute":
      return getDefaultCounterPrice(counter, prices, "lastMinute");

    case "While sickness":
      return getDefaultCounterPrice(counter, prices, "whileSickness");

    case "Airbnb":
      return getDefaultCounterPrice(counter, prices, "airbnb");

    case "Regular":
      return getDefaultCounterPrice(counter, prices, "regular");

    case "Subscription":
      return getDefaultCounterPrice(counter, prices, "subscription");

    case "Eco cleaning":
      return getDefaultCounterPrice(counter, prices, "eco");

    case "Office":
      return counter.reduce((acc, el, i) => {
        acc += el.count * prices.officeSquareMeter;
        return acc;
      }, prices.defaultOffice);

    case "Ozonation":
      return counter.reduce((acc, { count }, i) => {
        if (i === 0) acc += count * getOzonationMultiplier(prices, count);

        return acc;
      }, prices.defaultOzonation);

    case "Post-construction":
      return counter.reduce((acc, el, i) => {
        if (i === 0) {
          acc += el.count * prices.postConstructionWindow;
        } else if (i === 1) {
          acc += el.count * prices.postConstructionSquareMeter;
        }

        return acc;
      }, prices.defaultPostConstruction);

    case "Window cleaning":
      return counter.reduce((acc, el, i) => {
        if (i === 0) acc += el.count * prices.window;
        if (i === 1) acc += el.count * prices.windowBalconySquareMeter;

        return acc;
      }, prices.defaultWindow);

    case "Dry cleaning":
      return prices.defaultDry;

    case "Custom cleaning":
      return prices.defaultCustom;

    default:
      return 0;
  }
};

export const getServicePriceBasedOnManualCleaners = (
  price,
  cleanersCount,
  manualCleanersCount
) => {
  if (!manualCleanersCount) {
    return price;
  }

  const basicPercentForOneCleaner = Math.pow(0.25, cleanersCount);
  const extraPriceForEachExtraCleaner = price * basicPercentForOneCleaner;
  const extraPrice = manualCleanersCount * extraPriceForEachExtraCleaner;
  const extraPriceRounded = Number(parseFloat(extraPrice.toFixed(1)));

  return price + extraPriceRounded;
};

export const getRoundedServicePrice = (number) =>
  Number(parseFloat(number.toFixed(1)));
