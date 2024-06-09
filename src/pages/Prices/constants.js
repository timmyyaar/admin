export const MAIN_SERVICES = {
  CUSTOM: { label: "Custom cleaning", value: "custom" },
  SUBSCRIPTION: { label: "Subscription", value: "subscription" },
  AIRBNB: { label: "Airbnb", value: "airbnb" },
  MOVE_IN_OUT: { label: "Move in/out", value: "moveInOut" },
  ECO: { label: "Eco cleaning", value: "eco" },
  REGULAR: { label: "Regular", value: "regular" },
  WHILE_SICKNESS: { label: "While sickness", value: "whileSickness" },
  AFTER_PARTY: { label: "After party", value: "afterParty" },
  DEEP: { label: "Deep", value: "deep" },
  DEEP_KITCHEN: { label: "Deep kitchen", value: "deepKitchen" },
  OFFICE: { label: "Office", value: "office" },
  OZONATION: { label: "Ozonation", value: "ozonation" },
  WINDOW: { label: "Window cleaning", value: "window" },
  DRY: { label: "Dry cleaning", value: "dry" },
  POST_CONSTRUCTION: { label: "Post-construction", value: "postConstruction" },
};

export const DEFAULT_COUNTER_SERVICES = [
  MAIN_SERVICES.DEEP.value,
  MAIN_SERVICES.MOVE_IN_OUT.value,
  MAIN_SERVICES.AFTER_PARTY.value,
  MAIN_SERVICES.WHILE_SICKNESS.value,
  MAIN_SERVICES.AIRBNB.value,
  MAIN_SERVICES.REGULAR.value,
  MAIN_SERVICES.SUBSCRIPTION.value,
  MAIN_SERVICES.ECO.value,
];

export const MAIN_SERVICES_OPTIONS = Object.values(MAIN_SERVICES);

export const SUB_SERVICES = [
  {
    label: "Office cleaning",
    value: "subServiceOffice",
  },
  {
    label: "Clean the room",
    value: "subServiceRoom",
  },
  {
    label: "Clean the bathroom",
    value: "subServiceBathroom",
  },
  {
    label: "Clean the kitchen",
    value: "subServiceKitchen",
  },
  {
    label: "Clean the corridor",
    value: "subServiceCorridor",
  },
  {
    label: "Clean the cloak room",
    value: "subServiceCloakRoom",
  },
  {
    label: "Wash the window",
    value: "subServiceWindow",
  },
  {
    label: "Balcony",
    value: "subServiceBalcony",
  },
  {
    label: "Clean the oven",
    value: "subServiceOven",
  },
  {
    label: "Clean the fridge",
    value: "subServiceFridge",
  },
  {
    label: "Clean kitchen cabinets",
    value: "subServiceKitchenCabinets",
  },
  {
    label: "Clean the hood",
    value: "subServiceHood",
  },
  {
    label: "Extra tasks",
    value: "subServiceExtraTasks",
  },
  {
    label: "Cleaning bath or shower cubicle",
    value: "subServiceCubicle",
  },
  {
    label: "Ironing",
    value: "subServiceIron",
  },
  {
    label: "Space organizer",
    value: "subServiceSpaceOrganizer",
  },
  {
    label: "Wardrobe cleaning",
    value: "subServiceWardrobe",
  },
  {
    label: "Wash dishes",
    value: "subServiceDishes",
  },
  {
    label: "Water plants",
    value: "subServiceWaterPlants",
  },
  {
    label: "Laundry",
    value: "subServiceLaundry",
  },
  {
    label: "Wash the microwave",
    value: "subServiceMicrowave",
  },
  {
    label: "Clean animal's tray",
    value: "subServiceAnimalTray",
  },
  {
    label: "Clean the mirror",
    value: "subServiceMirror",
  },
  {
    label: "Clean slow-cooker",
    value: "subServiceSlowCooker",
  },
  {
    label: "Clean coffee-machine",
    value: "subServiceCoffeeMachine",
  },
  {
    label: "Two-seater sofa",
    value: "subServiceTwoSeaterSofa",
  },
  {
    label: "Three-seater sofa",
    value: "subServiceThreeSeaterSofa",
  },
  {
    label: "Four-seater sofa",
    value: "subServiceFourSeaterSofa",
  },
  {
    label: "Five-seater sofa",
    value: "subServiceFiveSeaterSofa",
  },
  {
    label: "Six-seater sofa",
    value: "subServiceSixSeaterSofa",
  },
  {
    label: "Upholstered to bed",
    value: "subServiceUpholsteredToBed",
  },
  {
    label: "Carpet dry cleaning",
    value: "subServiceCarpet",
  },
  {
    label: "Single mattress",
    value: "subServiceSingleMattress",
  },
  {
    label: "Single mattress from both sides",
    value: "subServiceSingleMattressBothSides",
  },
  {
    label: "Double mattress",
    value: "subServiceDoubleMattress",
  },
  {
    label: "Double mattress from both sides",
    value: "subServiceDoubleMattressBothSides",
  },
  {
    label: "Armchair",
    value: "subServiceArmchair",
  },
  {
    label: "Chair",
    value: "subServiceChair",
  },
  {
    label: "Office chair",
    value: "subServiceOfficeChair",
  },
  {
    label: "Cleaning baby stroller",
    value: "subServiceBabyStroller",
  },
];
