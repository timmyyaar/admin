import {
  getDateString,
  getDateTimeObjectFromString,
  getFloatOneDigit,
  request,
} from "../../utils";
import React, { useContext, useEffect, useState } from "react";
import { ORDER_STATUS, ROLES } from "../../constants";

import "./style.scss";
import ExtraExpensesPopover from "./ExtraExpensesPopover";
import { Louder } from "../../components/Louder";
import Filters from "./Filters";
import { LocaleContext } from "../../contexts";

function OrdersSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [cleaners, setCleaners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [extraExpensesOpenedId, setExtraExpensesOpenedId] = useState(null);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [cleanersFilter, setCleanersFilter] = useState([]);
  const [invoiceLoadingIds, setInvoiceLoadingIds] = useState([]);

  const { t } = useContext(LocaleContext);

  const getOrders = async () => {
    try {
      setIsLoading(true);

      const ordersResponse = await request({ url: "order" });

      setOrders(ordersResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);

      const usersResponse = await request({ url: "users" });

      const cleanersResponse = usersResponse.filter(({ role }) =>
        [ROLES.CLEANER, ROLES.CLEANER_DRY].includes(role)
      );

      setCleaners(cleanersResponse);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
    getUsers();
  }, []);

  const onInvoiceStatusUpdate = async (id, isPaid) => {
    setInvoiceLoadingIds((prev) => [...prev, id]);

    try {
      const updatedOrder = await request({
        url: `order/${id}/invoice-status`,
        method: "PATCH",
        body: { isPaid },
      });

      setOrders((prev) =>
        prev.map((order) =>
          updatedOrder.id === order.id ? updatedOrder : order
        )
      );
    } finally {
      setInvoiceLoadingIds((prev) =>
        prev.filter((loadingId) => loadingId !== id)
      );
    }
  };

  const filteredOrders = orders
    .filter(({ status }) => status === ORDER_STATUS.DONE.value)
    .filter(({ date }) => {
      const dateObject = getDateTimeObjectFromString(date);

      if (fromDate && toDate) {
        return dateObject >= fromDate && dateObject <= toDate;
      }

      if (fromDate) {
        return dateObject >= fromDate;
      }

      if (toDate) {
        return dateObject <= toDate;
      }

      return true;
    })
    .filter(({ cleaner_id }) =>
      cleanersFilter.length > 0
        ? cleaner_id.some((id) => cleanersFilter.includes(id))
        : true
    );

  const invoiceForPeriod = filteredOrders
    .filter(({ is_invoice_paid }) => !is_invoice_paid)
    .reduce((result, order) => {
      const reward = order.reward || order.reward_original;
      const companyEarning = getFloatOneDigit(
        order.price - reward * order.cleaners_count
      );

      const invoice = order.onlinepayment
        ? -(reward + (order.extra_expenses || 0))
        : companyEarning - (order.extra_expenses || 0);

      return result + invoice;
    }, 0);
  const invoiceForPeriodOneDigit = getFloatOneDigit(invoiceForPeriod);

  return (
    <div className="orders-summary">
      <Louder visible={isLoading || isUsersLoading} />
      <Filters
        t={t}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        cleaners={cleaners}
        cleanersFilter={cleanersFilter}
        setCleanersFilter={setCleanersFilter}
      />
      <table className="table table-dark table-bordered">
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th className="text-center">Date</th>
            <th className="text-center">Price</th>
            <th className="text-center">Discount %</th>
            <th className="text-center">Price with discount</th>
            <th className="text-center">Company earning</th>
            <th className="text-center">Payment</th>
            <th className="text-center">Cleaner reward</th>
            <th className="text-center">Extra expenses</th>
            <th className="text-center">Invoice</th>
            <th className="text-center">Is invoice paid</th>
            <th className="text-center">Cleaners</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            const reward = order.reward || order.reward_original;
            const discountPercent = Math.round(
              100 - (100 * order.price) / order.price_original
            );
            const orderCleaners = cleaners
              .filter(({ id }) => order.cleaner_id.includes(id))
              .map((cleaner) => `${cleaner.first_name} ${cleaner.last_name}`);
            const companyEarning = getFloatOneDigit(
              order.price - reward * order.cleaners_count
            );

            return (
              <tr>
                <td className="text-center align-middle">{order.id}</td>
                <td className="text-center align-middle">
                  {getDateString(getDateTimeObjectFromString(order.date))}
                </td>
                <td className="text-center align-middle">
                  {order.price_original}
                </td>
                <td className="text-center align-middle">
                  {isNaN(discountPercent) ? 0 : discountPercent}
                </td>
                <td className="text-center align-middle">{order.price}</td>
                <td className="text-center align-middle">{companyEarning}</td>
                <td className="text-center align-middle">
                  {order.onlinepayment ? "💳" : "💲"}
                </td>
                <td className="text-center align-middle">{reward}</td>
                <td
                  className="text-center align-middle extra-expenses-cell _cursor-pointer"
                  onClick={() => {
                    setExtraExpensesOpenedId(order.id);
                  }}
                >
                  <div className="position-relative">
                    {order.extra_expenses}
                    {extraExpensesOpenedId === order.id && (
                      <ExtraExpensesPopover
                        order={order}
                        onClose={() => setExtraExpensesOpenedId(null)}
                        setOrders={setOrders}
                      />
                    )}
                  </div>
                </td>
                <td className="text-center align-middle">
                  {order.onlinepayment ? (
                    <span className="text-danger">
                      -{reward + (order.extra_expenses || 0)}
                    </span>
                  ) : companyEarning < 0 ? (
                    <span className="text-danger">
                      {companyEarning - (order.extra_expenses || 0)}
                    </span>
                  ) : (
                    <span className="text-success">
                      +{companyEarning - (order.extra_expenses || 0)}
                    </span>
                  )}
                </td>
                <td className="text-center align-middle">
                  <div className="form-check d-flex justify-content-center">
                    <input
                      type="checkbox"
                      className="form-check-input _cursor-pointer"
                      name={`${order.id}`}
                      id={`${order.id}`}
                      onChange={() =>
                        onInvoiceStatusUpdate(order.id, !order.is_invoice_paid)
                      }
                      checked={order.is_invoice_paid}
                      disabled={invoiceLoadingIds.includes(order.id)}
                    />
                    <label
                      className="form-check-label _cursor-pointer"
                      htmlFor={`${order.id}`}
                    />
                  </div>
                </td>
                <td className="text-center align-middle">
                  {orderCleaners.length > 0
                    ? orderCleaners.length < order.cleaners_count
                      ? `${orderCleaners.join(", ")}, ${
                          order.cleaners_count - orderCleaners.length
                        } N/A`
                      : orderCleaners.join(", ")
                    : `${order.cleaners_count} N/A`}
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan="9" className="text-end align-middle">
              Total for period ({filteredOrders.length} orders):
            </td>
            <td className="text-center align-middle">
              <span
                className={
                  invoiceForPeriodOneDigit < 0
                    ? "text-danger"
                    : invoiceForPeriodOneDigit === 0
                    ? "text-warning"
                    : "text-success"
                }
              >
                {invoiceForPeriodOneDigit}
              </span>
            </td>
            <td className="text-center align-middle">
              <div className="form-check d-flex justify-content-center">
                <input
                  type="checkbox"
                  className="form-check-input _cursor-pointer"
                  name="invoice_summary"
                  id="invoice_summary"
                  onChange={() => {}}
                  checked={filteredOrders.every(
                    ({ is_invoice_paid }) => is_invoice_paid
                  )}
                  disabled
                />
                <label
                  className="form-check-label _cursor-pointer"
                  htmlFor="invoice_summary"
                />
              </div>
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default OrdersSummary;
