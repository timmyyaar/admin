import Select from "../../../components/common/Select/Select";
import { getSubServiceListByMainService } from "./utils";
import { BRACKETS_REGEX } from "../../../constants";
import { useEffect, useState } from "react";
import {
  getRoundedServicePrice,
  getServicePriceBasedOnManualCleaners,
} from "../priceUtils";

const OWN_SUPPLIES_SERVICE = "Own_supplies_sub_service";

const SINGLE_SUB_SERVICES = [
  "Vacuum_cleaner_sub_service",
  "Own_supplies_sub_service",
];

const getSelectedSubServices = (subServices, subServicesOptions) => {
  const splittedSubServices = subServices
    .split(BRACKETS_REGEX)
    .map((service) => service.trim())
    .filter((item) => item);
  const selectedSubServicesLabels = splittedSubServices.map((item) =>
    item.replace("_summery", "")
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
        (subServiceOption) => subServiceOption.title === item.value
      );

      return {
        ...item,
        ...existingSubService,
      };
    });
};

const getSubServicesPrice = (
  subServices,
  isPrivateHouse,
  cleanersCount,
  manualCleanersCount
) =>
  getServicePriceBasedOnManualCleaners(
    subServices.reduce(
      (acc, el) =>
        acc +
        ([
          "Clean the room",
          "Clean the bathroom",
          "Clean the kitchen",
          "Clean the corridor",
        ].includes(el.value) && isPrivateHouse
          ? el.originalPrice * el.count * 1.3
          : el.originalPrice * el.count),
      0
    ),
    cleanersCount - manualCleanersCount,
    manualCleanersCount
  );

function SubServiceEdit({
  prices,
  title,
  subServices,
  setSubServices,
  t,
  isPrivateHouse,
  cleanersCount,
  manualCleanersCount,
  discount,
  orderPrice,
  orderPriceOriginal,
  onPriceChange,
  onOriginalPriceChange,
}) {
  const subServicesOptions = getSubServiceListByMainService(prices, title).map(
    (item) => ({
      ...item,
      label: t(`${item.title}_summery`),
      value: item.title,
    })
  );
  const originalSubServices = getSelectedSubServices(
    subServices,
    subServicesOptions
  );

  const [selectedSubServices, setSelectedSubServices] = useState(
    getSelectedSubServices(subServices, subServicesOptions)
  );

  const originalSubServicesPrice = getSubServicesPrice(
    originalSubServices.filter(({ value }) => value !== OWN_SUPPLIES_SERVICE),
    isPrivateHouse,
    cleanersCount,
    manualCleanersCount
  );
  const subServicesPrice = getSubServicesPrice(
    selectedSubServices.filter(({ value }) => value !== OWN_SUPPLIES_SERVICE),
    isPrivateHouse,
    cleanersCount,
    manualCleanersCount
  );

  const wereOwnSuppliesInitiallySelected = originalSubServices.some(
    ({ value }) => value === OWN_SUPPLIES_SERVICE
  );
  const areOwnSuppliesSelected = selectedSubServices.some(
    ({ value }) => value === OWN_SUPPLIES_SERVICE
  );

  const needToRemoveOwnSupplies =
    wereOwnSuppliesInitiallySelected && !areOwnSuppliesSelected;
  const needToAddOwnSupplies =
    !wereOwnSuppliesInitiallySelected && areOwnSuppliesSelected;
  const ownSuppliesAdditionalPrice = needToRemoveOwnSupplies
    ? -prices.ownSupplies
    : needToAddOwnSupplies
    ? prices.ownSupplies
    : 0;

  useEffect(() => {
    const subServicePriceDifference =
      subServicesPrice - originalSubServicesPrice;
    const subServicePriceDifferenceWithDiscount = discount
      ? getRoundedServicePrice(
          subServicePriceDifference * ((100 - discount) / 100)
        )
      : subServicePriceDifference;

    onPriceChange(
      orderPrice +
        subServicePriceDifferenceWithDiscount +
        ownSuppliesAdditionalPrice
    );
    onOriginalPriceChange(
      orderPriceOriginal +
        subServicePriceDifference +
        ownSuppliesAdditionalPrice
    );

    //eslint-disable-next-line
  }, [subServicesPrice, ownSuppliesAdditionalPrice, originalSubServicesPrice]);

  useEffect(() => {
    setSubServices(
      selectedSubServices
        .map((service) => `${service.value + "_summery"} (${service.count})`)
        .join(" ")
    );

    //eslint-disable-next-line
  }, [selectedSubServices]);

  const onMinusClick = (subService) => {
    const updatedCount = subService.count - 1;

    if (updatedCount === 0) {
      setSelectedSubServices(
        selectedSubServices.filter(({ value }) => subService.value !== value)
      );
    } else {
      setSelectedSubServices(
        selectedSubServices.map((item) =>
          item.value === subService.value
            ? { ...item, count: updatedCount }
            : item
        )
      );
    }
  };

  const onPlusClick = (subService) => {
    const isDisabled =
      SINGLE_SUB_SERVICES.includes(subService.value) && subService.count === 1;

    if (isDisabled) {
      return;
    }

    const updatedCount = subService.count + 1;

    setSelectedSubServices(
      selectedSubServices.map((item) =>
        item.value === subService.value
          ? { ...item, count: updatedCount }
          : item
      )
    );
  };

  return (
    <div>
      {subServicesOptions.length > 0 ? (
        <Select
          options={subServicesOptions}
          value={selectedSubServices}
          isMulti
          onChange={(options) =>
            setSelectedSubServices(
              options?.map((option) => ({
                ...option,
                count: option.count || 1,
              })) || []
            )
          }
        />
      ) : (
        t("admin_order_no_sub_services_available")
      )}
      <div className="_mt-4">
        {selectedSubServices.map((subService) => (
          <h4 className="d-flex align-items-center">
            <button
              className="btn btn-sm btn-secondary font-weight-bold _mr-2 rounded-circle icon-button-small"
              disabled={subService.count === 0}
              onClick={() => onMinusClick(subService)}
            >
              &ndash;
            </button>
            <div className="badge bg-secondary d-flex align-items-center">
              <img
                src={subService.icons}
                alt=""
                className="icon-button-small _mr-2"
              />
              {t(subService.label)}:
              <span className="_ml-1">{subService.count}</span>
            </div>
            <button
              className="btn btn-sm btn-secondary font-weight-bold _ml-2 rounded-circle icon-button-small"
              onClick={() => onPlusClick(subService)}
              disabled={
                SINGLE_SUB_SERVICES.includes(subService.value) &&
                subService.count === 1
              }
            >
              +
            </button>
          </h4>
        ))}
      </div>
    </div>
  );
}

export default SubServiceEdit;
