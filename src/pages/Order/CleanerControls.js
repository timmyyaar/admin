import { ORDER_STATUS } from "../../constants";
import React from "react";

const CleanerControls = ({ order, isStatusLoading, onChangeOrderStatus }) => {
  return (
    <div>
      {order.status === ORDER_STATUS.DONE.value && (
        <span className="text-success _font-semibold">Completed order</span>
      )}
      {order.status === ORDER_STATUS.APPROVED.value && (
        <button
          className={`btn btn-warning _ml-3 ${
            isStatusLoading.includes(order.id) ? "loading" : ""
          }`}
          disabled={isStatusLoading.includes(order.id)}
          onClick={() =>
            onChangeOrderStatus(order.id, ORDER_STATUS.IN_PROGRESS.value)
          }
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
          onClick={() => onChangeOrderStatus(order.id, ORDER_STATUS.DONE.value)}
        >
          Finish order
        </button>
      )}
    </div>
  );
};

export default CleanerControls;
