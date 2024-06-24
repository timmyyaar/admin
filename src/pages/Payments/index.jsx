import React, { useContext, useEffect, useState } from "react";
import { getDateTimeString, request } from "../../utils";
import Payment from "./Payment";

import "./style.scss";
import { AppContext, LocaleContext } from "../../contexts";
import { ROLES } from "../../constants";
import { Louder } from "../../components/Louder";
import Filters from "./Filters";
import { CARD_PAYMENT_METHOD } from "./constants";

const getLastPaymentPeriod = () => {
  const lastTuesday = new Date();

  lastTuesday.setDate(lastTuesday.getDate() - ((lastTuesday.getDay() + 5) % 7));
  lastTuesday.setHours(0, 0, 0, 0);

  const prevTuesday = new Date(
    new Date(lastTuesday).setDate(lastTuesday.getDate() - 7)
  );

  return {
    lastTuesday: getDateTimeString(lastTuesday),
    prevTuesday: getDateTimeString(prevTuesday),
  };
};

export const getDateWithoutTimeString = (dateTimeString) =>
  dateTimeString.slice(0, dateTimeString.indexOf(" "));

function Payments() {
  const {
    userData: { role, email, firstName, lastName, customerId },
  } = useContext(AppContext);
  const { t } = useContext(LocaleContext);
  const isAdmin = [ROLES.ADMIN, ROLES.SUPERVISOR].includes(role);

  const [payments, setPayments] = useState([]);
  const [notFinishedOrdersError, setNotFinishedOrdersError] = useState(false);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(null);
  const [savedCards, setSavedCards] = useState([]);
  const [isSavedPaymentMethodsLoading, setIsSavedPaymentMethodsLoading] =
    useState(false);

  const getMyPaymentMethods = async () => {
    try {
      setIsSavedPaymentMethodsLoading(true);

      const paymentMethods = await request({
        url: `payment-methods/${customerId}`,
      });

      setSavedCards(
        paymentMethods.data.filter(({ type }) => type === CARD_PAYMENT_METHOD)
      );
    } finally {
      setIsSavedPaymentMethodsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      getMyPaymentMethods();
    }

    //eslint-disable-next-line
  }, []);

  const getMyPayments = async () => {
    try {
      setIsPaymentsLoading(true);

      setNotFinishedOrdersError(false);

      const lastPeriodDates = getLastPaymentPeriod();

      const myPaymentsResponse = await request({ url: "employee-payments" });

      const existingLastWeekPayment = myPaymentsResponse.find(
        ({ period_start, period_end }) =>
          period_start === lastPeriodDates.prevTuesday &&
          period_end === lastPeriodDates.lastTuesday
      );

      if (existingLastWeekPayment) {
        setPayments(myPaymentsResponse);
      } else {
        try {
          const newPayment = await request({
            url: "employee-payments",
            method: "POST",
            body: { email, firstName, lastName, customerId },
          });

          setPayments([newPayment, ...myPaymentsResponse]);
        } catch (error) {
          if (error.code === 400) {
            setNotFinishedOrdersError(true);
          }
        }
      }
    } finally {
      setIsPaymentsLoading(false);
    }
  };

  const getAllPayments = async () => {
    try {
      setIsPaymentsLoading(true);

      const allPayments = await request({ url: "employee-payments/all" });

      setPayments(allPayments);
    } finally {
      setIsPaymentsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getAllPayments();
    } else {
      getMyPayments();
    }

    //eslint-disable-next-line
  }, []);

  const lastPaymentPeriod = getLastPaymentPeriod();

  const filteredPayments = isAdmin
    ? payments
        .filter((payment) =>
          selectedEmployeeId ? payment.employee_id === selectedEmployeeId : true
        )
        .filter(({ period_start, period_end }) =>
          selectedTimePeriod
            ? `${getDateWithoutTimeString(
                period_start
              )} - ${getDateWithoutTimeString(period_end)}` ===
              selectedTimePeriod
            : true
        )
    : payments;

  return (
    <div>
      <Louder visible={isPaymentsLoading || isSavedPaymentMethodsLoading} />
      {isAdmin && (
        <Filters
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
          payments={payments}
          selectedTimePeriod={selectedTimePeriod}
          setSelectedTimePeriod={setSelectedTimePeriod}
        />
      )}
      {!isAdmin && (
        <div className="_mb-3 font-weight-semi-bold">{t("your_payments")}:</div>
      )}
      {notFinishedOrdersError && (
        <h5 className="_mb-3 text-danger">
          Please, finish all orders for the period (
          {getDateWithoutTimeString(lastPaymentPeriod.prevTuesday)} -{" "}
          {getDateWithoutTimeString(lastPaymentPeriod.lastTuesday)}) to generate
          payment!
        </h5>
      )}
      <div className="accordion accordion-wrapper _mb-3">
        {filteredPayments.map((payment) => (
          <Payment
            key={payment.id}
            payment={payment}
            setPayments={setPayments}
            savedCards={savedCards}
            setSavedCards={setSavedCards}
          />
        ))}
      </div>
    </div>
  );
}

export default Payments;
