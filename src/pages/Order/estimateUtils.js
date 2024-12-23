export const getEstimateFromCounterByService = (mainService, counter) => {
  switch (mainService) {
    case "Deep kitchen":
      return 360;

    case "Move in/out":
    case "Deep":
      return counter.reduce((acc, el, i) => {
        if (i === 0 && el.value > 1) {
          return acc + (el.value - 1) * 60;
        } else if (i === 1 && el.value > 1) {
          return acc + (el.value - 1) * 90;
        } else if (el.value === "Kitchen") {
          return acc + 30;
        }

        return acc;
      }, 210);

    case "After party":
      return counter.reduce((acc, el, i) => {
        if (i === 0 && el.value !== 1) {
          return acc + (el.value - 1) * 60;
        } else if (i === 1 && el.value !== 1) {
          return acc + (el.value - 1) * 60;
        } else if (el.value === "Kitchen") {
          return acc + 30;
        }

        return acc;
      }, 210);

    case "While sickness":
      return counter.reduce((acc, el, i) => {
        if (i === 0 && el.value > 1) acc += (el.value - 1) * 45;
        if (i === 1 && el.value > 1) acc += (el.value - 1) * 30;
        if (i === 2 && el.value === "Kitchen") {
          return acc + 30;
        }

        return acc;
      }, 60);

    case "Office":
      return counter.reduce((acc, el) => {
        if (el.value <= 100) {
          return acc + 180;
        } else {
          return acc + 180 + (el.value - 100);
        }
      }, 0);

    case "Ozonation":
      return counter.reduce((acc, el) => {
        if (el.value <= 100) {
          return acc + 180;
        } else {
          return acc + 180 + (el.value - 100);
        }
      }, 0);

    case "Post-construction":
      return counter.reduce((acc, el, i) => {
        if (i === 0) {
          return acc + el.value * 60;
        } else if (i === 1) {
          return acc + el.value * 6;
        }

        return acc;
      }, 0);

    case "Window cleaning":
      return counter.reduce((acc, el, i) => {
        if (i === 0) {
          return acc + el.value * 30;
        } else if (i === 1) {
          return acc + el.value;
        }

        return acc;
      }, 0);

    case "Regular":
    case "Eco cleaning":
    case "Airbnb":
    case "Subscription":
      return counter.reduce((acc, el, i) => {
        if (i === 0 && el.value !== 1) {
          return acc + (el.value - 1) * 30;
        } else if (i === 1 && el.value !== 1) {
          return acc + (el.value - 1) * 60;
        } else if (el.value === "Kitchen") {
          return acc + 30;
        }

        return acc;
      }, 180);

    default:
      return 0;
  }
};

export const getServiceEstimate = (
  title,
  counter,
  subService,
  manualCleanersCount,
  isPrivateHouse,
) => {
  const countEstimate = getEstimateFromCounterByService(title, counter);
  const subServiceEstimate = subService.reduce((acc, el) => {
    if (el.title === "Office cleaning") {
      if (el.count <= 100) {
        return acc + 180;
      } else {
        return acc + 180 + (el.count - 100);
      }
    }

    return acc + el.time * el.count;
  }, 0);
  const divider = title === "Dry cleaning" ? 720 : 600;

  const subTotal =
    countEstimate + subServiceEstimate + (isPrivateHouse ? 60 : 0);
  const cleanersCount = Math.ceil(subTotal / divider);

  const cleanersAndManualCleanersCount =
    Math.ceil(subTotal / divider) + manualCleanersCount;
  const total =
    subTotal > divider || manualCleanersCount > 0
      ? subTotal / cleanersAndManualCleanersCount
      : subTotal;

  return {
    time: `${Math.floor(total / 60)}h, ${Math.round(total % 60)}m`,
    cleanersCount,
  };
};
