import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/common/Modal";
import {
  EMAIL_REGEX,
  NUMBER_FLOAT_EMPTY_REGEX,
  ORDER_TYPE_ADDITIONAL,
  POSITIVE_NUMBER_EMPTY_REGEX,
} from "../../../constants";
import {
  capitalizeFirstLetter,
  getDateTimeObjectFromString,
  getDateTimeString,
  getFloatOneDigit,
  request,
} from "../../../utils";
import { LocaleContext } from "../../../contexts";
import DatePicker from "react-datepicker";
import CounterEdit from "./CounterEdit";
import SubServiceEdit from "./SubServicesEdit";
import Select from "../../../components/common/Select/Select";
import { AGGREGATOR_OPTIONS } from "../constants";
import "./style.scss";
import { getServiceEstimate } from "../estimateUtils";
import {
  getFieldsFromCounter,
  getSelectedSubServices,
  getSubServiceListByMainService,
} from "./utils";
import useFirstRender from "../../../hooks/useFirstRender";
import { COUNTER_TYPE } from "./constants";
import { getCleanerReward } from "../priceUtils";
import {
  getEstimateInHoursMinutesFormat,
  getEstimateInMinutes,
} from "../utils";
import usePrevious from "../../../hooks/usePrevious";
import { OptionWithIcon, SingleValueWithIcon } from "../select-components";

const ESTIMATE_REGEXP = /^[0-9]+h, [0-9]+m$/;

const EditOrderModal = ({ onClose, order, setOrders }) => {
  const { t } = useContext(LocaleContext);
  const isFirstRender = useFirstRender();

  const [name, setName] = useState(order.name);
  const [number, setNumber] = useState(order.number);
  const [email, setEmail] = useState(order.email);
  const [date, setDate] = useState(getDateTimeObjectFromString(order.date));
  const [dateCreated] = useState(
    getDateTimeObjectFromString(order.creation_date)
  );
  const [address, setAddress] = useState(order.address);
  const [price, setPrice] = useState(order.price);
  const [mainServices, setMainServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [isMainServicesLoading, setIsMainServicesLoading] = useState(false);
  const [isSubServicesLoading, setIsSubServicesLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(order.total_service_price);
  const [priceOriginal, setPriceOriginal] = useState(order.price_original);
  const [totalPriceOriginal, setTotalPriceOriginal] = useState(
    order.total_service_price_original
  );
  const [onlinePayment, setOnlinePayment] = useState(order.onlinepayment);
  const [estimate, setEstimate] = useState(order.estimate || "");
  const [counter, setCounter] = useState(order.counter);
  const [subService, setSubService] = useState(order.subservice);
  const [note, setNote] = useState(order.note || "");
  const [originalReward, setOriginalReward] = useState(order.reward_original);
  const [reward, setReward] = useState(order.reward || "");
  const [ownCheckList, setOwnCheckList] = useState(
    order.own_check_list || false
  );
  const [cleanersCount, setCleanersCount] = useState(order.cleaners_count || 0);
  const [aggregator, setAggregator] = useState(
    order.aggregator
      ? AGGREGATOR_OPTIONS.find(({ value }) => order.aggregator === value)
      : null
  );
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [prices, setPrices] = useState({});
  const [isPricesLoading, setIsPricesLoading] = useState(false);
  const [requestPreviousCleaner, setRequestPreviousCleaner] = useState(
    order.requestpreviouscleaner || false
  );

  const isOriginalCounterSquareMeters = counter.includes("square_meters_total");

  const [counterType, setCounterType] = useState(
    isOriginalCounterSquareMeters
      ? COUNTER_TYPE.SQUARE_METERS
      : COUNTER_TYPE.DEFAULT
  );

  const getMainServices = async () => {
    try {
      setIsMainServicesLoading(true);

      const response = await request({ url: "main-services" });

      setMainServices(response);
    } finally {
      setIsMainServicesLoading(false);
    }
  };

  const getSubServices = async () => {
    try {
      setIsSubServicesLoading(true);

      const response = await request({ url: "sub-services" });

      setSubServices(response);
    } finally {
      setIsSubServicesLoading(false);
    }
  };

  const getPrices = async () => {
    try {
      setIsPricesLoading(true);

      const pricesResponse = await request({ url: "prices" });

      const currentCityPrices = pricesResponse
        .filter(({ city }) => city === order.city)
        .reduce((result, item) => ({ ...result, [item.key]: item.price }), {});

      setPrices({
        ...pricesResponse.reduce(
          (result, item) => ({ ...result, [item.key]: item.price }),
          {}
        ),
        ...currentCityPrices,
      });
    } finally {
      setIsPricesLoading(false);
    }
  };

  useEffect(() => {
    getPrices();
    getMainServices();
    getSubServices();

    //eslint-disable-next-line
  }, []);

  const isEmailValid = EMAIL_REGEX.test(email);
  const isOrderValid =
    name &&
    number &&
    email &&
    isEmailValid &&
    address &&
    date &&
    price &&
    priceOriginal &&
    totalPrice &&
    totalPriceOriginal &&
    estimate &&
    ESTIMATE_REGEXP.test(estimate) &&
    cleanersCount;

  const onUpdateOrder = async () => {
    if (!isOrderValid) {
      return;
    }

    try {
      setIsUpdateLoading(true);

      const updatedOrders = await request({
        url: `order/${order.id}`,
        method: "PUT",
        body: {
          name,
          number,
          email,
          address,
          date: getDateTimeString(date),
          onlinePayment,
          price,
          estimate,
          title: order.title,
          counter,
          subService,
          note,
          total_service_price: totalPrice,
          total_service_price_original: totalPriceOriginal,
          price_original: priceOriginal,
          reward: reward ? +reward : null,
          ownCheckList,
          cleanersCount: +cleanersCount,
          aggregator: aggregator?.value || null,
          reward_original: originalReward,
          requestPreviousCleaner,
        },
      });

      setOrders((prevOrders) =>
        prevOrders.map((prev) => {
          const updatedOrder = updatedOrders.find(
            (item) => item.id === prev.id
          );

          return updatedOrder || prev;
        })
      );
      onClose();
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const totalPriceDifference = getFloatOneDigit(
    order.total_service_price - order.price
  );
  const totalPriceOriginalDifference = getFloatOneDigit(
    order.total_service_price_original - order.price_original
  );

  const previousCleanersCount = usePrevious(cleanersCount);

  const onCleanersCountChange = ({ target: { value } }) => {
    if (order.manual_cleaners_count) {
      return;
    }

    if (POSITIVE_NUMBER_EMPTY_REGEX.test(value)) {
      setCleanersCount(value);

      if (value) {
        const oneCleanerEstimate =
          getEstimateInMinutes(estimate) *
          (cleanersCount || previousCleanersCount);
        const updatedEstimate = getEstimateInHoursMinutesFormat(
          oneCleanerEstimate / +value
        );

        setEstimate(updatedEstimate);
      }
    }
  };

  const onPriceChange = (value) => {
    if (order.price === order.total_service_price) {
      setTotalPrice(value);
    } else {
      setTotalPrice(getFloatOneDigit(totalPriceDifference + +value));
    }

    setPrice(Number(value));
  };

  const onOriginalPriceChange = (value) => {
    if (order.price_original === order.total_service_price_original) {
      setTotalPriceOriginal(value);
    } else {
      setTotalPriceOriginal(
        getFloatOneDigit(totalPriceOriginalDifference + +value)
      );
    }

    setPriceOriginal(Number(value));
  };

  const isPrivateHouse = order.address.includes("(Private house)");

  useEffect(() => {
    const subServicesOptions = getSubServiceListByMainService(
      prices,
      order.title,
      mainServices,
      subServices
    ).map((item) => ({
      ...item,
      label: t(`${item.title}_summery`),
      value: item.title,
    }));
    const subServicesList = getSelectedSubServices(
      subService,
      subServicesOptions
    );
    const counterList = getFieldsFromCounter(counter).map(
      ({ title, count }) => ({
        value: count || count === 0 ? count : title,
      })
    );

    const updatedEstimate = getServiceEstimate(
      order.title,
      counterList,
      subServicesList,
      order.manual_cleaners_count,
      isPrivateHouse
    );

    if (!isFirstRender) {
      setEstimate(updatedEstimate.time);
      setCleanersCount(
        updatedEstimate.cleanersCount + order.manual_cleaners_count
      );
    }

    //eslint-disable-next-line
  }, [order.title, counter, subService, isPrivateHouse]);

  useEffect(() => {
    if (!isFirstRender) {
      const cleanerReward = getCleanerReward({
        title: order.title,
        originalPrice: priceOriginal,
        cleanersCount,
        estimate,
        price,
      });

      setOriginalReward(cleanerReward);
    }

    //eslint-disable-next-line
  }, [order.title, priceOriginal, cleanersCount, estimate, price]);

  const isPricesLoaded = Object.keys(prices).length > 0;
  const isServicesLoaded = mainServices.length > 0 && subServices.length > 0;
  const discount = Math.round(100 - (order.price * 100) / order.price_original);

  return (
    <Modal
      onClose={onClose}
      actionButtonText={t("admin_order_edit_update_order")}
      onActionButtonClick={onUpdateOrder}
      isActionButtonDisabled={
        !isOrderValid || isUpdateLoading || isPricesLoading
      }
      isLoading={isUpdateLoading}
      isInitialDataLoading={
        isPricesLoading || isMainServicesLoading || isSubServicesLoading
      }
    >
      <div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_name")}:</label>
          <input
            className="form-control"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_phone")}:</label>
          <input
            className="form-control"
            value={number}
            onChange={({ target: { value } }) => setNumber(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Email:</label>
          <input
            className="form-control"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_address")}:</label>
          <textarea
            className="form-control"
            value={address}
            onChange={({ target: { value } }) => setAddress(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_date")}:</label>
          <DatePicker
            showTimeSelect
            selected={date}
            onChange={(newDate) => setDate(newDate)}
            dateFormat="d/MM/yyyy HH:mm"
            timeFormat="HH:mm"
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_created")}:</label>
          <DatePicker
            showTimeSelect
            selected={dateCreated}
            dateFormat="d/MM/yyyy HH:mm"
            timeFormat="HH:mm"
            disabled
          />
        </div>
        <div className="lg:_flex lg:_gap-3 _items-end">
          <div className="w-100 mb-3">
            <label className="mb-2">
              {t("admin_order_price_with_discount")}{" "}
              <span className="text-warning">({t("final_price")})</span>:
            </label>
            <input
              className="form-control"
              value={price}
              onChange={({ target: { value } }) => {
                if (NUMBER_FLOAT_EMPTY_REGEX.test(value)) {
                  onPriceChange(value);
                }
              }}
              disabled={order.payment_intent}
            />
          </div>
          <div className="w-100 mb-3">
            <label className="mb-2">{t("admin_order_price")}:</label>
            <input
              className="form-control"
              value={priceOriginal}
              onChange={({ target: { value } }) => {
                if (NUMBER_FLOAT_EMPTY_REGEX.test(value)) {
                  onOriginalPriceChange(value);
                }
              }}
              disabled={order.payment_intent}
            />
          </div>
        </div>
        <div className="lg:_flex lg:_gap-3 _items-end">
          <div className="w-100 mb-3">
            <label className="mb-2">
              {t("admin_order_total_price_with_discount")}:
            </label>
            <input className="form-control" value={totalPrice} disabled />
          </div>
          <div className="w-100 mb-3">
            <label className="mb-2">{t("admin_order_total_price")}:</label>
            <input
              className="form-control"
              value={totalPriceOriginal}
              disabled
            />
          </div>
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_estimate")}:</label>
          <input
            className="form-control"
            value={estimate}
            onChange={({ target: { value } }) => setEstimate(value)}
            disabled={counterType !== COUNTER_TYPE.SQUARE_METERS}
          />
        </div>
        {counter && isPricesLoaded && isServicesLoaded && (
          <div className="w-100 mb-3">
            <label className="mb-2">{t("admin_order_edit_counter")}:</label>
            <CounterEdit
              title={order.title}
              counter={order.counter}
              prices={prices}
              t={t}
              cleanersCount={cleanersCount}
              manualCleanersCount={order.manual_cleaners_count}
              isPrivateHouse={isPrivateHouse}
              setCounter={setCounter}
              discount={discount}
              orderPrice={order.price}
              orderPriceOriginal={order.price_original}
              onPriceChange={onPriceChange}
              onOriginalPriceChange={onOriginalPriceChange}
              counterType={counterType}
              setCounterType={setCounterType}
            />
          </div>
        )}
        {isPricesLoaded && isServicesLoaded && (
          <div className="w-100 mb-3">
            <label className="mb-2">{t("admin_order_edit_services")}:</label>
            <SubServiceEdit
              prices={prices}
              title={order.title}
              subServices={order.subservice}
              setSubServices={setSubService}
              t={t}
              cleanersCount={cleanersCount}
              manualCleanersCount={order.manual_cleaners_count}
              discount={discount}
              isPrivateHouse={isPrivateHouse}
              orderPrice={order.price}
              orderPriceOriginal={order.price_original}
              onPriceChange={onPriceChange}
              onOriginalPriceChange={onOriginalPriceChange}
              mainServicesResponse={mainServices}
              subServicesResponse={subServices}
            />
          </div>
        )}
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_note")}:</label>
          <textarea
            className="form-control"
            value={note}
            onChange={({ target: { value } }) => setNote(value)}
          />
        </div>
        <div className="lg:_flex lg:_gap-3 _items-end">
          <div className="w-100 mb-3">
            <label className="mb-2">{t("admin_order_original_reward")}:</label>
            <input className="form-control" value={originalReward} disabled />
          </div>
          <div className="w-100 mb-3">
            <label className="mb-2">
              {t("admin_order_reward")}{" "}
              <span className="text-danger">
                ({t("admin_order_this_will_override_reward")})
              </span>
              :
            </label>
            <input
              className="form-control"
              value={reward}
              onChange={({ target: { value } }) => {
                if (NUMBER_FLOAT_EMPTY_REGEX.test(value)) {
                  setReward(value.trim());
                }
              }}
            />
          </div>
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">
            {t("admin_order_cleaners_count")}
            {Boolean(order.manual_cleaners_count) && (
              <span className="text-warning">
                {" "}
                ({t("admin_order_you_cant_edit_manual_cleaners")})
              </span>
            )}
            :
          </label>
          <input
            className="form-control"
            value={cleanersCount}
            onChange={onCleanersCountChange}
            disabled={order.manual_cleaners_count}
          />
        </div>
        <div className="w-100 mb-3">
          <div className="form-check">
            <input
              id="online-payment"
              className="form-check-input _cursor-pointer"
              type="checkbox"
              checked={onlinePayment}
              onClick={() => setOnlinePayment(!onlinePayment)}
              disabled={order.payment_intent}
            />
            <label
              htmlFor="online-payment"
              className="form-check-label _cursor-pointer"
            >
              {t("admin_order_edit_online_payment")}
            </label>
          </div>
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">
            {capitalizeFirstLetter(t("aggregator"))}
          </label>
          <Select
            placeholder={t("select_placeholder")}
            options={AGGREGATOR_OPTIONS}
            onChange={setAggregator}
            value={aggregator}
            components={{
              Option: OptionWithIcon,
              SingleValue: SingleValueWithIcon,
            }}
            menuPlacement="top"
            isClearable
          />
        </div>
        {updateError && <div className="mt-3 text-danger">{updateError}</div>}
      </div>
      <div className="w-100 mb-3">
        <div className="form-check">
          <input
            id="request-previous-cleaner"
            className="form-check-input _cursor-pointer"
            type="checkbox"
            checked={Boolean(requestPreviousCleaner)}
            onClick={() => setRequestPreviousCleaner(!requestPreviousCleaner)}
          />
          <label
            htmlFor="request-previous-cleaner"
            className="form-check-label _cursor-pointer"
          >
            {t("admin_order_request_previous_cleaner")}
          </label>
        </div>
      </div>
      {order.title === ORDER_TYPE_ADDITIONAL.OFFICE && !order.is_confirmed && (
        <div className="w-100 mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input _cursor-pointer"
              id="own_check_list"
              name="own_check_list"
              checked={ownCheckList}
              onChange={() => setOwnCheckList((prev) => !prev)}
            />
            <label htmlFor="own_check_list">
              {t("we_provide_our_own_check_list")}
            </label>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditOrderModal;
