import { DEFAULT_COUNTER_SERVICES, MAIN_SERVICES } from "./constants";
import MainService from "./MainService";
import { capitalizeFirstLetter } from "../../utils";

function MainServices({ mainService, prices, getPrices, t }) {
  const defaultKey = `default${capitalizeFirstLetter(mainService.value)}`;
  const minimalKey = `minimal${capitalizeFirstLetter(mainService.value)}`;
  const bedroomKey = `${mainService.value}Bedroom`;
  const bathroomKey = `${mainService.value}Bathroom`;
  const kitchenKey = `${mainService.value}Kitchen`;
  const windowKey = "window";
  const windowBalconyKey = "windowBalconySquareMeter";
  const officeKey = "officeSquareMeter";
  const ozonationSmallAreaKey = "ozonationSmallArea";
  const ozonationMediumAreaKey = "ozonationMediumArea";
  const ozonationBigAreaKey = "ozonationBigArea";
  const postConstructionWindowKey = "postConstructionWindow";
  const postConstructionAreaKey = "postConstructionSquareMeter";

  const generalServicesPrices = [
    {
      key: defaultKey,
      price: prices[defaultKey],
      title: t("default_price"),
    },
    {
      key: minimalKey,
      price: prices[minimalKey],
      title: t("minimal_price"),
    },
  ];

  const defaultMainServicesPrices = [
    ...generalServicesPrices,
    {
      key: bedroomKey,
      price: prices[bedroomKey],
      title: t("Bedroom"),
    },
    {
      key: bathroomKey,
      price: prices[bathroomKey],
      title: t("Bathroom"),
    },
    {
      key: kitchenKey,
      price: prices[kitchenKey],
      title: t("Kitchen"),
    },
  ];
  const windowPrices = [
    ...generalServicesPrices,
    {
      key: windowKey,
      price: prices[windowKey],
      title: t("Window"),
    },
    {
      key: windowBalconyKey,
      price: prices[windowBalconyKey],
      title: `${t("Balcony")} (m<sup>2</sup>)`,
    },
  ];
  const officePrices = [
    ...generalServicesPrices,
    {
      key: officeKey,
      price: prices[officeKey],
      title: `${t("Area")} (m<sup>2</sup>)`,
    },
  ];
  const ozonationPrices = [
    ...generalServicesPrices,
    {
      key: ozonationSmallAreaKey,
      price: prices[ozonationSmallAreaKey],
      title: `${t("small_area")} (<= 50m<sup>2</sup>)`,
    },
    {
      key: ozonationMediumAreaKey,
      price: prices[ozonationMediumAreaKey],
      title: `${t("medium_area")} (> 50m<sup>2</sup> and <= 120m<sup>2</sup>)`,
    },
    {
      key: ozonationBigAreaKey,
      price: prices[ozonationBigAreaKey],
      title: `${t("big_area")} (> 120m<sup>2</sup>)`,
    },
  ];
  const postConstructionPrices = [
    ...generalServicesPrices,
    {
      key: postConstructionWindowKey,
      price: prices[postConstructionWindowKey],
      title: t("Window"),
    },
    {
      key: postConstructionAreaKey,
      price: prices[postConstructionAreaKey],
      title: `${t("Area")} (m<sup>2</sup>)`,
    },
  ];

  const getPricesRowsDependsOnMainService = () => {
    if (DEFAULT_COUNTER_SERVICES.includes(mainService?.value)) {
      return defaultMainServicesPrices;
    } else if (mainService?.value === MAIN_SERVICES.WINDOW.value) {
      return windowPrices;
    } else if (mainService?.value === MAIN_SERVICES.OFFICE.value) {
      return officePrices;
    } else if (mainService?.value === MAIN_SERVICES.POST_CONSTRUCTION.value) {
      return postConstructionPrices;
    } else if (mainService?.value === MAIN_SERVICES.OZONATION.value) {
      return ozonationPrices;
    } else {
      return generalServicesPrices;
    }
  };

  return (
    <>
      {mainService?.value && (
        <MainService
          getPrices={getPrices}
          servicePrices={getPricesRowsDependsOnMainService()}
          t={t}
        />
      )}
    </>
  );
}

export default MainServices;
