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

export const allServices = (prices, priceMultiplier = 1) => [
  {
    title: "Office cleaning",
    icons: officeSvg,
    originalPrice: prices.subServiceOffice,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceOffice),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceOffice,
    time: 1,
  },
  {
    title: "Clean the room",
    icons: readingRoomSvg,
    originalPrice: prices.subServiceRoom,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceRoom),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceRoom,
    time: 30,
  },
  {
    title: "Clean the bathroom",
    icons: bathroomSvg,
    originalPrice: prices.subServiceBathroom,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceBathroom),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceBathroom,
    time: 60,
  },
  {
    title: "Clean the kitchen",
    icons: kitchenSvg,
    originalPrice: prices.subServiceKitchen,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceKitchen),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceKitchen,
    time: 60,
  },
  {
    title: "Clean the corridor",
    icons: corredSvg,
    originalPrice: prices.subServiceCorridor,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceCorridor),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceCorridor,
    time: 30,
  },
  {
    title: "Clean the cloak room",
    icons: hangerSvg,
    originalPrice: prices.subServiceCloakRoom,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceCloakRoom),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceCloakRoom,
    time: 30,
  },
  {
    title: "Wash the window",
    icons: windowSvg,
    originalPrice: prices.subServiceWindow,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceWindow),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceWindow,
    time: 30,
  },
  {
    title: "Balcony",
    icons: balconySvg,
    originalPrice: prices.subServiceBalcony,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceBalcony),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceBalcony,
    time: 1,
  },
  {
    title: "Clean the oven",
    icons: ovenSvg,
    originalPrice: prices.subServiceOven,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceOven),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceOven,
    time: 60,
  },
  {
    title: "Clean the fridge",
    icons: fridgeSvg,
    originalPrice: prices.subServiceFridge,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceFridge),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceFridge,
    time: 45,
  },
  {
    title: "Clean kitchen cabinets",
    icons: kitchenCabinets,
    originalPrice: prices.subServiceKitchenCabinets,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceKitchenCabinets
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceKitchenCabinets,
    time: 75,
  },
  {
    title: "Clean the hood",
    icons: cookerHoodSvg,
    originalPrice: prices.subServiceHood,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceHood),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceHood,
    time: 45,
  },
  {
    title: "Extra tasks",
    icons: hoursglassSvg,
    originalPrice: prices.subServiceExtraTasks,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceExtraTasks
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceExtraTasks,
    time: 60,
  },
  {
    title: "Cleaning bath or shower cubicle",
    icons: iconsSvg,
    originalPrice: prices.subServiceCubicle,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceCubicle),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceCubicle,
    time: 30,
  },
  {
    title: "Ironing",
    icons: ironSvg,
    originalPrice: prices.subServiceIron,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceIron),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceIron,
    time: 60,
  },
  {
    title: "Space organizer",
    icons: cleanClothesSvg,
    originalPrice: prices.subServiceSpaceOrganizer,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceSpaceOrganizer
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceSpaceOrganizer,
    time: 60,
  },
  {
    title: "Wardrobe cleaning",
    icons: closetSvg,
    originalPrice: prices.subServiceWardrobe,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceWardrobe),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceWardrobe,
    time: 30,
  },
  {
    title: "Wash dishes",
    icons: cleanDishesSvg,
    originalPrice: prices.subServiceDishes,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceDishes),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceDishes,
    time: 15,
  },
  {
    title: "Water plants",
    icons: wateringPlantsSvg,
    originalPrice: prices.subServiceWaterPlants,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceWaterPlants
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceWaterPlants,
    time: 20,
  },
  {
    title: "Laundry",
    icons: laundrySvg,
    originalPrice: prices.subServiceLaundry,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceLaundry),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceLaundry,
    time: 15,
  },
  {
    title: "Wash the microwave",
    icons: microwaveSvg,
    originalPrice: prices.subServiceMicrowave,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceMicrowave),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceMicrowave,
    time: 15,
  },
  {
    title: "Clean animal's tray",
    icons: petToiletTraySvg,
    originalPrice: prices.subServiceAnimalTray,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceAnimalTray
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceAnimalTray,
    time: 15,
  },
  {
    title: "Clean the mirror",
    icons: mirrorSvg,
    originalPrice: prices.subServiceMirror,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceMirror),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceMirror,
    time: 15,
  },
  {
    title: "Clean slow-cooker",
    icons: SlowCooker,
    originalPrice: prices.subServiceSlowCooker,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceSlowCooker
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceSlowCooker,
    time: 15,
  },
  {
    title: "Clean coffee-machine",
    icons: coffeeMachineSvg,
    originalPrice: prices.subServiceCoffeeMachine,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceCoffeeMachine
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceCoffeeMachine,
    time: 15,
  },
  {
    title: "Two-seater sofa",
    icons: twoSeaterSofaSvg,
    originalPrice: prices.subServiceTwoSeaterSofa,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceTwoSeaterSofa
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceTwoSeaterSofa,
    time: 60,
  },
  {
    title: "Three-seater sofa",
    icons: threeSeaterSofaSvg,
    originalPrice: prices.subServiceThreeSeaterSofa,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceThreeSeaterSofa
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceThreeSeaterSofa,
    time: 60,
  },
  {
    title: "Four-seater sofa",
    icons: fourSeaterSofaSvg,
    originalPrice: prices.subServiceFourSeaterSofa,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceFourSeaterSofa
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceFourSeaterSofa,
    time: 60,
  },
  {
    title: "Five-seater sofa",
    icons: fiveSeaterSofaSvg,
    originalPrice: prices.subServiceFiveSeaterSofa,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceFiveSeaterSofa
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceFiveSeaterSofa,
    time: 60,
  },
  {
    title: "Six-seater sofa",
    icons: sixSeaterSofaSvg,
    originalPrice: prices.subServiceSixSeaterSofa,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceSixSeaterSofa
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceSixSeaterSofa,
    time: 60,
  },
  {
    title: "Upholstered to bed",
    icons: bedSvg,
    originalPrice: prices.subServiceUpholsteredToBed,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceUpholsteredToBed
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceUpholsteredToBed,
    time: 60,
  },
  {
    title: "Carpet dry cleaning",
    icons: carpetSvg,
    originalPrice: prices.subServiceCarpet,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceCarpet),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceCarpet,
    time: 10,
  },
  {
    title: "Single mattress",
    icons: mattressSvg,
    originalPrice: prices.subServiceSingleMattress,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceSingleMattress
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceSingleMattress,
    time: 60,
  },
  {
    title: "Single mattress from both sides",
    icons: mattressSvg,
    originalPrice: prices.subServiceSingleMattressBothSides,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceSingleMattressBothSides
    ),
    oldPrice:
      priceMultiplier === 1 ? "" : prices.subServiceSingleMattressBothSides,
    time: 60,
  },
  {
    title: "Double mattress",
    icons: mattressDblSvg,
    originalPrice: prices.subServiceDoubleMattress,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceDoubleMattress
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceDoubleMattress,
    time: 60,
  },
  {
    title: "Double mattress from both sides",
    icons: mattressDblSvg,
    originalPrice: prices.subServiceDoubleMattressBothSides,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceDoubleMattressBothSides
    ),
    oldPrice:
      priceMultiplier === 1 ? "" : prices.subServiceDoubleMattressBothSides,
    time: 90,
  },
  {
    title: "Armchair",
    icons: sofaSvg,
    originalPrice: prices.subServiceArmchair,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceArmchair),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceArmchair,
    time: 30,
  },
  {
    title: "Chair",
    icons: chairSvg,
    originalPrice: prices.subServiceChair,
    price: getRoundedServicePrice(priceMultiplier * prices.subServiceChair),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceChair,
    time: 30,
  },
  {
    title: "Office chair",
    icons: officeChairSvg,
    originalPrice: prices.subServiceOfficeChair,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceOfficeChair
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceOfficeChair,
    time: 30,
  },
  {
    title: "Cleaning baby stroller",
    icons: babyStrollerSvg,
    originalPrice: prices.subServiceBabyStroller,
    price: getRoundedServicePrice(
      priceMultiplier * prices.subServiceBabyStroller
    ),
    oldPrice: priceMultiplier === 1 ? "" : prices.subServiceBabyStroller,
    time: 30,
  },
  {
    title: "Vacuum_cleaner_sub_service",
    icons: vacuumCleanerSvg,
    originalPrice: prices.vacuumCleaner,
    price: getRoundedServicePrice(priceMultiplier * prices.vacuumCleaner),
    oldPrice: priceMultiplier === 1 ? "" : prices.vacuumCleaner,
    time: 0,
  },
  {
    title: "Own_supplies_sub_service",
    icons: ownSuppliesSvg,
    originalPrice: prices.ownSupplies,
    price: getRoundedServicePrice(priceMultiplier * prices.ownSupplies),
    oldPrice: priceMultiplier === 1 ? "" : prices.ownSupplies,
    time: 0,
  },
];

export const getSubServiceListByMainService = (
  prices,
  mainService,
  priceMultiplier = 1
) => {
  switch (mainService) {
    case "After party":
    case "In a last minute":
    case "Window cleaning":
    case "Airbnb":
    case "Deep":
    case "Regular":
    case "Eco cleaning":
    case "Move in/out":
      return allServices(prices, priceMultiplier).filter((el) => {
        const excludedTitles = [
          "Clean the cloak room",
          "Clean the mirror",
          "Clean the room",
          "Clean the kitchen",
          "Clean the corridor",
          "Clean the bathroom",
          "Cleaning bath or shower cubicle",
          "Office cleaning",

          "Two-seater sofa",
          "Three-seater sofa",
          "Four-seater sofa",
          "Five-seater sofa",
          "Six-seater sofa",
          "Upholstered to bed",
          "Carpet dry cleaning",
          "Single mattress",
          "Single mattress from both sides",
          "Double mattress",
          "Double mattress from both sides",
          "Armchair",
          "Chair",
          "Office chair",
          "Cleaning baby stroller",
          "Office cleaning",
        ];

        return !excludedTitles.includes(el.title);
      });

    case "Dry cleaning":
      return allServices(prices, priceMultiplier).filter((el) => {
        const excludedTitles = [
          "Two-seater sofa",
          "Three-seater sofa",
          "Four-seater sofa",
          "Five-seater sofa",
          "Six-seater sofa",
          "Upholstered to bed",
          "Carpet dry cleaning",
          "Single mattress",
          "Single mattress from both sides",
          "Double mattress",
          "Double mattress from both sides",
          "Armchair",
          "Chair",
          "Office chair",
          "Cleaning baby stroller",
        ];

        return excludedTitles.includes(el.title);
      });

    case "Subscription":
      return allServices(prices, priceMultiplier).filter((el) => {
        const excludedTitles = [
          "Clean the room",
          "Clean the kitchen",
          "Clean the corridor",
          "Clean the bathroom",
        ];

        return !excludedTitles.includes(el.title);
      });

    case "Custom cleaning":
      return allServices(prices, priceMultiplier).filter(
        (el) => el.title !== "Office cleaning"
      );

    default:
      return [];
  }
};
