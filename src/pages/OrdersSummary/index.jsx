import {
  getDateString,
  getDateTimeObjectFromString,
  getFloatOneDigit,
  request,
} from "../../utils";
import { useEffect, useState } from "react";
import { ROLES } from "../../constants";

import "./style.scss";
import ExtraExpensesPopover from "./ExtraExpensesPopover";
import { Louder } from "../../components/Louder";

function OrdersSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [cleaners, setCleaners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [extraExpensesOpenedId, setExtraExpensesOpenedId] = useState(null);

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

  return (
    <div>
      <Louder visible={isLoading || isUsersLoading} />
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
            <th className="text-center">Settlement</th>
            <th className="text-center">Cleaners</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
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
                  ) : (
                    <span className="text-success">
                      +{companyEarning - (order.extra_expenses || 0)}
                    </span>
                  )}
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
        </tbody>
      </table>
    </div>
  );
}

export default OrdersSummary;
