import { getUserId } from "../../utils";
import React from "react";

const AssignOnMe = ({ order, assignError, isAssignLoading, onAssignOrder }) => {
  return (
    <div className="d-flex align-items-center">
      {assignError.some((error) => error.id === order.id) && (
        <span className="text-danger _mr-2">{assignError.message}</span>
      )}
      <button
        className={`btn btn-primary ${
          isAssignLoading.includes(order.id) ? "loading" : ""
        }`}
        onClick={() => onAssignOrder(order.id, getUserId())}
        disabled={isAssignLoading.includes(order.id)}
      >
        Assign this order on me
      </button>
    </div>
  );
};

export default AssignOnMe;
