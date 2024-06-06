import { useContext, useEffect, useState } from "react";
import { request } from "../../../utils";
import { ORDER_TYPE_ADDITIONAL } from "../../../constants";
import { LocaleContext } from "../../../contexts";

function Index({ clientName, clientPhone }) {
  const { t } = useContext(LocaleContext);
  const [clientOrders, setClientOrders] = useState([]);
  const [isClientOrdersLoading, setIsClientOrdersLoading] = useState(true);

  const getClientOrders = async () => {
    setIsClientOrdersLoading(true);

    try {
      const clientOrdersResponse = await request({
        url: `order/client-orders/get-all?${new URLSearchParams({
          clientName,
          clientPhone,
        })}`,
      });

      setClientOrders(clientOrdersResponse);
    } finally {
      setIsClientOrdersLoading(false);
    }
  };

  useEffect(() => {
    getClientOrders();

    //eslint-disable-next-line
  }, []);

  const ordersWithoutSubscription = clientOrders.filter(
    ({ title }) => title !== ORDER_TYPE_ADDITIONAL.SUBSCRIPTION
  );
  const ordersTypes = [
    ...new Set(ordersWithoutSubscription.map(({ title }) => title)),
  ];
  const clientOrdersCountByType = ordersTypes
    .map((type) => {
      const ordersByType = ordersWithoutSubscription.filter(
        ({ title }) => title === type
      );

      return {
        type,
        count: ordersByType.length,
      };
    })
    .toSorted((prev, next) => next.count - prev.count);

  return (
    <tr>
      <td colSpan={9} className="table-column-active">
        <div className="_p-2">
          {isClientOrdersLoading ? (
            <div>
              <span className="text-warning">Orders loading...</span>
              <div className="loader _ml-2" />
            </div>
          ) : clientOrdersCountByType.length > 0 ? (
            <div>
              <div className="_font-bold _mb-2">
                <span className="_mr-1">Total:</span>
                {clientOrdersCountByType.reduce(
                  (result, { count }) => +count,
                  0
                )}
              </div>
              {clientOrdersCountByType.map(({ type, count }) => (
                <div>
                  {t(type)}: {count}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-danger">This client has no orders</div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default Index;
