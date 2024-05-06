import React, { useContext, useEffect, useState } from "react";
import {
  getDatesBetween,
  getDateString,
  getDateTimeObjectFromString,
  getFloatOneDigit,
  request,
} from "../../utils";
import DatePicker from "react-datepicker";
import { LocaleContext } from "../../contexts";
import { Louder } from "../../components/Louder";
import Select from "../../components/common/Select/Select";

import "./style.scss";
import { ORDER_STATUS } from "../../constants";

const getFirstDateOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const getEndOfDay = (date = new Date()) =>
  new Date(new Date(date).setHours(23, 59, 59, 999));

const getYearStart = (year) => new Date(year, 0, 1);

const getYearEnd = (year) => new Date(year, 11, 31, 23, 59, 59, 999);

const getRevenue = (orders) =>
  orders.reduce((result, { price }) => result + price, 0);
const getSpent = (orders) =>
  orders.reduce(
    (result, { reward, reward_original, extra_expenses }) =>
      result + ((reward || reward_original) + (extra_expenses || 0)),
    0
  );

const hundredYears = Array(101)
  .fill(2024)
  .map((n, i) => n + i);

function Incomes() {
  const { t } = useContext(LocaleContext);

  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [dateFrom, setDateFrom] = useState(getFirstDateOfMonth());
  const [dateTo, setDateTo] = useState(getEndOfDay());
  const [year, setYear] = useState(dateTo.getFullYear());

  const getOrders = async () => {
    try {
      setIsLoading(true);

      const ordersResponse = await request({ url: "order" });

      setOrders(ordersResponse);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const datesBetweenRange = getDatesBetween(dateFrom, dateTo).map((date) =>
    getDateString(date)
  );

  const completedOrders = orders.filter(
    ({ status }) => status === ORDER_STATUS.DONE.value
  );

  const currentPeriodOrders = completedOrders.filter(({ date }) => {
    const dateObject = getDateTimeObjectFromString(date);

    return dateObject >= dateFrom && dateObject <= dateTo;
  });
  const currentPeriodRevenue = getRevenue(currentPeriodOrders);
  const spentCurrentPeriod = getSpent(currentPeriodOrders);

  const yearStart = getYearStart(year);
  const yearEnd = getYearEnd(year);
  const yearOrders = completedOrders.filter(({ date }) => {
    const dateObject = getDateTimeObjectFromString(date);

    return dateObject >= yearStart && dateObject <= yearEnd;
  });
  const yearRevenue = getRevenue(yearOrders);
  const spentMoneyYear = getSpent(yearOrders);

  return (
    <div>
      <Louder visible={isLoading} />
      <div className="mb-3 d-flex align-items-center">
        <span className="_mr-2">
          {t("admin_order_date_from_filter_title")}:
        </span>
        <div className="_mr-3">
          <DatePicker
            selectsStart
            selected={dateFrom}
            onChange={(newDate) => setDateFrom(newDate)}
            dateFormat="d/MM/yyyy"
            maxDate={dateTo}
            startDate={dateFrom}
            endDate={dateTo}
          />
        </div>
        <span className="_mr-2">{t("admin_order_date_to_filter_title")}:</span>
        <div>
          <DatePicker
            selectsEnd
            selected={dateTo}
            onChange={(newDate) => setDateTo(newDate)}
            dateFormat="d/MM/yyyy"
            minDate={dateFrom}
            startDate={dateFrom}
            endDate={dateTo}
          />
        </div>
      </div>
      <table className="table table-dark table-bordered">
        <thead>
          <tr>
            <th className="_w-1/5">Date</th>
            <th className="_w-1/5">Orders count</th>
            <th>Revenue</th>
            <th>Profit</th>
            <th>Average bill</th>
          </tr>
        </thead>
        <tbody>
          {datesBetweenRange.map((date) => {
            const ordersOnThisDay = completedOrders.filter(
              (order) =>
                getDateString(getDateTimeObjectFromString(order.date)) === date
            );
            const revenueOnThisDay = getRevenue(ordersOnThisDay);
            const spentMoneyThisDay = getSpent(ordersOnThisDay);

            return (
              <tr>
                <td>{date}</td>
                <td>{ordersOnThisDay.length}</td>
                <td>{getFloatOneDigit(revenueOnThisDay)}</td>
                <td className="text-success font-weight-bold">
                  {getFloatOneDigit(revenueOnThisDay - spentMoneyThisDay)}
                </td>
                <td>
                  {getFloatOneDigit(
                    revenueOnThisDay / (ordersOnThisDay.length || 1)
                  )}
                </td>
              </tr>
            );
          })}
          <tr className="general-row">
            <td className="align-middle">TOTAL</td>
            <td className="align-middle">{currentPeriodOrders.length}</td>
            <td className="align-middle">
              {getFloatOneDigit(currentPeriodRevenue)}
            </td>
            <td className="align-middle text-success font-weight-bold">
              {getFloatOneDigit(currentPeriodRevenue - spentCurrentPeriod)}
            </td>
            <td className="align-middle">
              {getFloatOneDigit(
                currentPeriodRevenue / (currentPeriodOrders.length || 1)
              )}
            </td>
          </tr>
          <tr className="general-row">
            <td className="align-middle">
              <Select
                value={{ value: year, label: year }}
                onChange={(option) => setYear(option.value)}
                options={hundredYears.map((y) => ({ value: y, label: y }))}
                menuPlacement="top"
              />
            </td>
            <td className="align-middle">{yearOrders.length}</td>
            <td className="align-middle">{getFloatOneDigit(yearRevenue)}</td>
            <td className="align-middle text-success font-weight-bold">
              {getFloatOneDigit(yearRevenue - spentMoneyYear)}
            </td>
            <td className="align-middle">
              {getFloatOneDigit(yearRevenue / (yearOrders.length || 1))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Incomes;
