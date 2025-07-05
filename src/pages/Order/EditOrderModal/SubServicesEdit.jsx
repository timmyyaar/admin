import Select from "../../../components/common/Select/Select";
import {
  getSelectedSubServices,
  getSubServiceListByMainService,
} from "./utils";
import { useEffect, useState } from "react";
import {
  getRoundedServicePrice,
  getServicePriceBasedOnManualCleaners,
} from "../priceUtils";

const SINGLE_SUB_SERVICES = [
  "Vacuum_cleaner_sub_service",
  "Own_supplies_sub_service",
];

const getSubServicesPrice = (
  subServices,
  isPrivateHouse,
  cleanersCount,
  manualCleanersCount,
  discount
) => {
  const subServicesWithoutDiscount = subServices.filter(
    ({ isDiscountExcluded }) => isDiscountExcluded
  );
  const subServicesWithDiscount = subServices.filter(
    ({ isDiscountExcluded }) => !isDiscountExcluded
  );

  const subServicesWithoutDiscountPrice = subServicesWithoutDiscount.reduce(
    (acc, el) => acc + el.originalPrice * el.count,
    0
  );

  const priceBasedOnManualCleaners = getServicePriceBasedOnManualCleaners(
    subServicesWithDiscount.reduce(
      (acc, el) =>
        acc +
        (el.countInPrivateHouse && isPrivateHouse
          ? el.originalPrice * el.count * 1.3
          : el.originalPrice * el.count),
      0
    ),
    cleanersCount - manualCleanersCount,
    manualCleanersCount
  );

  return {
    priceWithDiscount: discount
      ? getRoundedServicePrice(
          priceBasedOnManualCleaners * ((100 - discount) / 100) +
            subServicesWithoutDiscountPrice
        )
      : priceBasedOnManualCleaners + subServicesWithoutDiscountPrice,
    priceWithoutDiscount:
      priceBasedOnManualCleaners + subServicesWithoutDiscountPrice,
  };
};

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
  mainServicesResponse,
  subServicesResponse,
}) {
  const subServicesOptions = getSubServiceListByMainService(
    prices,
    title,
    mainServicesResponse,
    subServicesResponse
  ).map((item) => ({
    ...item,
    label: t(`${item.title}_summery`),
    value: item.title,
  }));
  const originalSubServices = getSelectedSubServices(
    subServices,
    subServicesOptions
  );

  const [selectedSubServices, setSelectedSubServices] = useState(
    getSelectedSubServices(subServices, subServicesOptions)
  );

  const {
    priceWithDiscount: originalSubServicesPriceWithDiscount,
    priceWithoutDiscount: originalSubServicePrice,
  } = getSubServicesPrice(
    originalSubServices,
    isPrivateHouse,
    cleanersCount,
    manualCleanersCount,
    discount
  );
  const {
    priceWithDiscount: subServicesPriceWithDiscount,
    priceWithoutDiscount: subServicesPrice,
  } = getSubServicesPrice(
    selectedSubServices,
    isPrivateHouse,
    cleanersCount,
    manualCleanersCount,
    discount
  );

  useEffect(() => {
    const subServicePriceDifferenceWithDiscount =
      subServicesPriceWithDiscount - originalSubServicesPriceWithDiscount;
    const subServicePriceDifference =
      subServicesPrice - originalSubServicePrice;

    onPriceChange(orderPrice + subServicePriceDifferenceWithDiscount);
    onOriginalPriceChange(orderPriceOriginal + subServicePriceDifference);

    //eslint-disable-next-line
  }, [
    subServicesPrice,
    originalSubServicePrice,
    subServicesPriceWithDiscount,
    originalSubServicesPriceWithDiscount,
  ]);

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
