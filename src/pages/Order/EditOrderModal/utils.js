import { getRoundedServicePrice } from "../priceUtils";

import coffeeMachineSvg from "./icons/coffee-machine.svg";
import cleanClothesSvg from "./icons/clean-clothes.svg";
import cleanDishesSvg from "./icons/clean-dishes.svg";
import closetSvg from "./icons/closet.svg";
import cookerHoodSvg from "./icons/cooker-hood.svg";
import fridgeSvg from "./icons/fridge.svg";
import hoursglassSvg from "./icons/hoursglass.svg";
import ironSvg from "./icons/iron.svg";
import kitchenSvg from "./icons/kitchen.svg";
import kitchenCabinets from "./icons/kitchen-cabinets.svg";
import laundrySvg from "./icons/laundry.svg";
import microwaveSvg from "./icons/microwave.svg";
import ovenSvg from "./icons/oven.svg";
import petToiletTraySvg from "./icons/pet-toilet-tray.svg";
import SlowCooker from "./icons/slow-cooker.svg";
import wateringPlantsSvg from "./icons/watering-plants.svg";
import windowSvg from "./icons/window.svg";
import babyStrollerSvg from "./icons/baby-stroller.svg";
import bathroomSvg from "./icons/bathroom.svg";
import corredSvg from "./icons/corred.svg";
import bedSvg from "./icons/bed.svg";
import chairSvg from "./icons/chair.svg";
import readingRoomSvg from "./icons/reading-room.svg";
import iconsSvg from "./icons/Icons.svg";
import balconySvg from "./icons/balcony.svg";
import mattressSvg from "./icons/mattress.svg";
import mattressDblSvg from "./icons/mattressDbl.svg";
import mirrorSvg from "./icons/mirror.svg";
import officeChairSvg from "./icons/office-chair.svg";
import hangerSvg from "./icons/hanger.svg";
import sofaSvg from "./icons/sofa.svg";
import twoSeaterSofaSvg from "./icons/two-seater-sofa.svg";
import threeSeaterSofaSvg from "./icons/three-seater-sofa.svg";
import fourSeaterSofaSvg from "./icons/four-seater-sofa.svg";
import fiveSeaterSofaSvg from "./icons/five-seater-sofa.svg";
import sixSeaterSofaSvg from "./icons/six-seater-sofa.svg";
import carpetSvg from "./icons/carpet.svg";
import officeSvg from "./icons/office.svg";
import vacuumCleanerSvg from "./icons/vacuum-cleaner.svg";
import ownSuppliesSvg from "./icons/own-supplies.svg";
import wallStainRemovalSvg from "./icons/wall-stain.svg";
import limescaleRemovalSvg from "./icons/lomescale-removal.svg";
import moldRemovalSvg from "./icons/mold-removal.svg";
import { BRACKETS_REGEX, ORDER_TYPE } from "../../../constants";
import { FIELD_TYPE } from "./constants";

const AGGREGATOR_SERVICES = [
  {
    title: "Wall stain removal",
    icons: wallStainRemovalSvg,
    originalPrice: 1,
    price: 1,
    oldPrice: 1,
    time: 1,
  },
  {
    title: "Limescale removal",
    icons: limescaleRemovalSvg,
    originalPrice: 1,
    price: 1,
    oldPrice: 1,
    time: 1,
  },
  {
    title: "Mold removal",
    icons: moldRemovalSvg,
    originalPrice: 1,
    price: 1,
    oldPrice: 1,
    time: 1,
  },
  {
    title: "Provide supplies",
    icons: ownSuppliesSvg,
    originalPrice: 1,
    price: 1,
    oldPrice: 1,
    time: 1,
  },
];

export const allServices = [
  {
    title: "Office cleaning",
    icons: officeSvg,
  },
  {
    title: "Clean the room",
    icons: readingRoomSvg,
  },
  {
    title: "Clean the bathroom",
    icons: bathroomSvg,
  },
  {
    title: "Clean the kitchen",
    icons: kitchenSvg,
  },
  {
    title: "Clean the corridor",
    icons: corredSvg,
  },
  {
    title: "Clean the cloak room",
    icons: hangerSvg,
  },
  {
    title: "Wash the window",
    icons: windowSvg,
  },
  {
    title: "Balcony",
    icons: balconySvg,
  },
  {
    title: "Clean the oven",
    icons: ovenSvg,
  },
  {
    title: "Clean the fridge",
    icons: fridgeSvg,
  },
  {
    title: "Clean kitchen cabinets",
    icons: kitchenCabinets,
  },
  {
    title: "Clean the hood",
    icons: cookerHoodSvg,
  },
  {
    title: "Extra tasks",
    icons: hoursglassSvg,
  },
  {
    title: "Cleaning bath or shower cubicle",
    icons: iconsSvg,
  },
  {
    title: "Ironing",
    icons: ironSvg,
  },
  {
    title: "Space organizer",
    icons: cleanClothesSvg,
  },
  {
    title: "Wardrobe cleaning",
    icons: closetSvg,
  },
  {
    title: "Wash dishes",
    icons: cleanDishesSvg,
  },
  {
    title: "Water plants",
    icons: wateringPlantsSvg,
  },
  {
    title: "Laundry",
    icons: laundrySvg,
  },
  {
    title: "Wash the microwave",
    icons: microwaveSvg,
  },
  {
    title: "Clean animal's tray",
    icons: petToiletTraySvg,
  },
  {
    title: "Clean the mirror",
    icons: mirrorSvg,
  },
  {
    title: "Clean slow-cooker",
    icons: SlowCooker,
  },
  {
    title: "Clean coffee-machine",
    icons: coffeeMachineSvg,
  },
  {
    title: "Two-seater sofa",
    icons: twoSeaterSofaSvg,
  },
  {
    title: "Three-seater sofa",
    icons: threeSeaterSofaSvg,
  },
  {
    title: "Four-seater sofa",
    icons: fourSeaterSofaSvg,
  },
  {
    title: "Five-seater sofa",
    icons: fiveSeaterSofaSvg,
  },
  {
    title: "Six-seater sofa",
    icons: sixSeaterSofaSvg,
  },
  {
    title: "Upholstered to bed",
    icons: bedSvg,
  },
  {
    title: "Carpet dry cleaning",
    icons: carpetSvg,
  },
  {
    title: "Single mattress",
    icons: mattressSvg,
  },
  {
    title: "Single mattress from both sides",
    icons: mattressSvg,
  },
  {
    title: "Double mattress",
    icons: mattressDblSvg,
  },
  {
    title: "Double mattress from both sides",
    icons: mattressDblSvg,
  },
  {
    title: "Armchair",
    icons: sofaSvg,
  },
  {
    title: "Chair",
    icons: chairSvg,
  },
  {
    title: "Office chair",
    icons: officeChairSvg,
  },
  {
    title: "Cleaning baby stroller",
    icons: babyStrollerSvg,
  },
  {
    title: "Vacuum_cleaner_sub_service",
    icons: vacuumCleanerSvg,
  },
  {
    title: "Own_supplies_sub_service",
    icons: ownSuppliesSvg,
  },
  ...AGGREGATOR_SERVICES,
];

export const getSubServiceListByMainService = (
  prices,
  mainService,
  mainServicesResponse,
  subServicesResponse,
  priceMultiplier = 1,
) => {
  const selectedMainService = mainServicesResponse.find(
    ({ title }) => title === mainService,
  );

  console.log(mainService);
  return [
    ...subServicesResponse
      .filter(({ mainServices }) =>
        mainServices.includes(selectedMainService.id),
      )
      .map((subService) => ({
        ...subService,
        originalPrice: prices[subService.key],
        price: getRoundedServicePrice(priceMultiplier * prices[subService.key]),
        oldPrice: priceMultiplier === 1 ? "" : prices[subService.key],
        icons: allServices.find(({ title }) => title === subService.title)
          ?.icons,
      })),
    ...(mainService === ORDER_TYPE.DRY ? [] : AGGREGATOR_SERVICES),
  ];
};

const isExistOrZero = (item) => Boolean(item || item === 0);

export const getFieldsFromCounter = (counter) => {
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

export const getSelectedSubServices = (subServices, subServicesOptions) => {
  const splittedSubServices = subServices
    .split(BRACKETS_REGEX)
    .map((service) => service.trim())
    .filter((item) => item);
  const selectedSubServicesLabels = splittedSubServices.map((item) =>
    item.replace("_summery", ""),
  );
  const itemsCounts = subServices
    .split(")")
    .map((service) => service.trim())
    .filter((item) => item)
    .map((item) => item.slice(item.indexOf("(") + 1, item.length))
    .map((item) => +item);

  return selectedSubServicesLabels
    .map((item, index) => ({
      value: item,
      count: itemsCounts[index],
    }))
    .map((item) => {
      const existingSubService = subServicesOptions.find(
        (subServiceOption) => subServiceOption.title === item.value,
      );

      return {
        ...item,
        ...existingSubService,
      };
    });
};
