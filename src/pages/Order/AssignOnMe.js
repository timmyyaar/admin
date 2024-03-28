import { getUserId } from "../../utils";
import React, { useContext } from "react";
import { LocaleContext } from "../../contexts";

const AssignOnMe = ({ order, assignError, isAssignLoading, onAssignOrder }) => {
  const { t } = useContext(LocaleContext);

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
        {t("admin_assign_order_on_me_button_title")}
      </button>
    </div>
  );
};

export default AssignOnMe;
