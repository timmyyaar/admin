import { ORDER_STATUS } from "../../constants";
import React, { useContext, useState } from "react";
import { getUserId, isAdmin, request } from "../../utils";
import AssignOnMe from "./AssignOnMe";
import { getTimeRemaining } from "../../utils";
import { LocaleContext } from "../../contexts";

const CleanerControls = ({
  order,
  isStatusLoading,
  onChangeOrderStatus,
  setOrders,
}) => {
  const { t } = useContext(LocaleContext);

  const notAllCleanersJoined = order.cleaner_id.length < order.cleaners_count;
  const [isRefuseLoading, setIsRefuseLoading] = useState(false);
  const [isRefuseError, setIsRefuseError] = useState(false);

  const refuseOrder = async () => {
    try {
      setIsRefuseLoading(true);

      const updatedOrder = await request({
        url: `order/refuse/${order.id}`,
        method: "PATCH",
      });

      setOrders((prev) =>
        prev.map((prevOrder) =>
          prevOrder.id === order.id ? updatedOrder : prevOrder
        )
      );
    } catch (error) {
      setIsRefuseError(true);
    } finally {
      setIsRefuseLoading(false);
    }
  };

  const canRefuseOrder = getTimeRemaining(order.date).days > 4;

  return (
    <>
      {!isAdmin() &&
        order.cleaner_id.length < order.cleaners_count &&
        !order.cleaner_id.includes(getUserId()) && (
          <AssignOnMe order={order} setOrders={setOrders} />
        )}
      {order.cleaner_id.includes(getUserId()) && (
        <div className="d-flex align-items-center">
          {order.status === ORDER_STATUS.DONE.value && (
            <span className="text-success _font-semibold">
              {t("admin_completed_order")}
            </span>
          )}
          {order.status === ORDER_STATUS.APPROVED.value && (
            <>
              {isRefuseError && (
                <span className="text-danger _mr-2">
                  {t("admin_refuse_error")}
                </span>
              )}
              {canRefuseOrder && (
                <button
                  className={`btn btn-danger _ml-3 ${
                    isRefuseLoading ? "loading" : ""
                  }`}
                  disabled={isRefuseLoading}
                  onClick={refuseOrder}
                >
                  {t("admin_refuse")}
                </button>
              )}
              <button
                className={`btn btn-warning width-max-content whitespace-nowrap _ml-3 ${
                  isStatusLoading.includes(order.id) ? "loading" : ""
                }`}
                disabled={
                  isStatusLoading.includes(order.id) || notAllCleanersJoined
                }
                onClick={() => {
                  if (!notAllCleanersJoined) {
                    onChangeOrderStatus(
                      order.id,
                      ORDER_STATUS.IN_PROGRESS.value
                    );
                  }
                }}
              >
                {t("admin_start_progress")}
              </button>
            </>
          )}
          {order.status === ORDER_STATUS.IN_PROGRESS.value && (
            <button
              className={`btn btn-success _ml-3 ${
                isStatusLoading.includes(order.id) ? "loading" : ""
              }`}
              disabled={isStatusLoading.includes(order.id)}
              onClick={() =>
                onChangeOrderStatus(order.id, ORDER_STATUS.DONE.value)
              }
            >
              {t("admin_finish_order")}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default CleanerControls;
