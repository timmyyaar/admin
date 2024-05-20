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
  const lastFriday = new Date();

  lastFriday.setDate(lastFriday.getDate() - ((lastFriday.getDay() + 2) % 7));
  lastFriday.setHours(0, 0, 0, 0);

  const prevFriday = new Date(
    new Date(lastFriday).setDate(lastFriday.getDate() - 7)
  );

  return {
    lastFriday: getDateTimeString(lastFriday),
    prevFriday: getDateTimeString(prevFriday),
  };
};

export const getDateWithoutTimeString = (dateTimeString) =>
  dateTimeString.slice(0, dateTimeString.indexOf(" "));

function Payments() {
  const {
    userData: { role, email, firstName, lastName, customerId },
  } = useContext(AppContext);
  const { t } = useContext(LocaleContext);
  const isAdmin = role === ROLES.ADMIN;

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
  }, []);

  const getMyPayments = async () => {
    try {
      setIsPaymentsLoading(true);

      setNotFinishedOrdersError(false);

      const lastPeriodDates = getLastPaymentPeriod();

      const myPaymentsResponse = await request({ url: "employee-payments" });

      const existingLastWeekPayment = myPaymentsResponse.find(
        ({ period_start, period_end }) =>
          period_start === lastPeriodDates.prevFriday &&
          period_end === lastPeriodDates.lastFriday
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
          {getDateWithoutTimeString(lastPaymentPeriod.prevFriday)} -{" "}
          {getDateWithoutTimeString(lastPaymentPeriod.lastFriday)}) to generate
          payment!
        </h5>
      )}
      <div className="accordion _mb-3">
        {filteredPayments.map((payment) => (
          <Payment
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
