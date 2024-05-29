import Modal from "../../components/common/Modal";
import DatePicker from "react-datepicker";
import React, { useState } from "react";
import { getDateTimeString, request } from "../../utils";

function DuplicateModal({ t, onClose, order, setOrders }) {
  const [orderDate, setOrderDate] = useState(null);
  const [includeDiscounts, setIncludeDiscounts] = useState(true);
  const [isDuplicateLoading, setIsDuplicateLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const isDuplicateEnabled = orderDate;

  const duplicateOrder = async () => {
    if (!isDuplicateEnabled) {
      return;
    }

    try {
      setIsDuplicateLoading(true);

      const duplicatedOrder = await request({
        url: "order",
        method: "POST",
        body: {
          name: order.name,
          number: order.number,
          email: order.email,
          address: order.address,
          date: getDateTimeString(orderDate),
          onlinePayment: order.onlinepayment,
          requestPreviousCleaner: order.requestpreviouscleaner,
          personalData: order.personaldata,
          price: includeDiscounts ? order.price : order.price_original,
          title: order.title,
          counter: order.counter,
          subService: order.subservice,
          mainServicePrice: includeDiscounts
            ? order.price
            : order.price_original,
          mainServicePriceOriginal: order.price_original,
          priceOriginal: order.price_original,
          additionalInformation: order.additional_information,
          city: order.city,
          transportationPrice: order.transportation_price,
          mainServiceEstimate: order.estimate,
          mainServiceCleanersCount: order.cleaners_count,
          language: order.language,
          creationDate: getDateTimeString(new Date()),
        },
      });

      setOrders((prev) => [duplicatedOrder, ...prev]);
      onClose();
    } catch (error) {
      setDuplicateError(error.message);
    } finally {
      setIsDuplicateLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isLoading={isDuplicateLoading}
      isActionButtonDisabled={isDuplicateLoading || !isDuplicateEnabled}
      errorMessage={duplicateError}
      actionButtonText={t("admin_order_duplicate")}
      onActionButtonClick={duplicateOrder}
    >
      <h5 className="mb-4 text-center">
        {t("admin_order_duplicate")} {order.id}
      </h5>
      <div className="d-flex align-items-center">
        <span className="white-space-nowrap _mr-2">
          {t("admin_order_new_order_date")}:
        </span>
        <DatePicker
          showTimeSelect
          dateFormat="d/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          selected={orderDate}
          onChange={(newDate) => setOrderDate(newDate)}
        />
      </div>
      <div className="form-check my-3">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="original_discounts"
          checked={includeDiscounts}
          onChange={() => setIncludeDiscounts(!includeDiscounts)}
        />
        <label className="form-check-label" htmlFor="original_discounts">
          {t("admin_order_include_original_discounts")}
        </label>
      </div>
      <div>
        <span className="_mr-1">{t("admin_order_price")}:</span>
        {includeDiscounts ? order.price : order.price_original} zl
      </div>
      <div>
        {t("admin_order_original_price")}: {order.price_original} zl
      </div>
    </Modal>
  );
}

export default DuplicateModal;
