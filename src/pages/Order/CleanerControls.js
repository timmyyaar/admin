import { ORDER_STATUS } from "../../constants";
import React from "react";
import { getUserId, isAdmin } from "../../utils";
import AssignOnMe from "./AssignOnMe";

const CleanerControls = ({
  order,
  isStatusLoading,
  onChangeOrderStatus,
  setOrders,
}) => {
  const notAllCleanersJoined = order.cleaner_id.length < order.cleaners_count;

  return (
    <>
      {!isAdmin() &&
        order.cleaner_id.length < order.cleaners_count &&
        !order.cleaner_id.includes(getUserId()) && (
          <AssignOnMe order={order} setOrders={setOrders} />
        )}
      {order.cleaner_id.includes(getUserId()) && (
        <div>
          {order.status === ORDER_STATUS.DONE.value && (
            <span className="text-success _font-semibold">Completed order</span>
          )}
          {order.status === ORDER_STATUS.APPROVED.value && (
            <button
              className={`btn btn-warning width-max-content whitespace-nowrap _ml-3 ${
                isStatusLoading.includes(order.id) ? "loading" : ""
              }`}
              disabled={
                isStatusLoading.includes(order.id) || notAllCleanersJoined
              }
              onClick={() => {
                if (!notAllCleanersJoined) {
                  onChangeOrderStatus(order.id, ORDER_STATUS.IN_PROGRESS.value);
                }
              }}
            >
              Start progress
            </button>
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
              Finish order
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default CleanerControls;
