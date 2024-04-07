import { getUserId, request } from "../../utils";
import React, { useContext, useState } from "react";
import { LocaleContext } from "../../contexts";

const AssignOnMe = ({ order, setOrders }) => {
  const { t } = useContext(LocaleContext);

  const [isAssignOnMeLoading, setIsAssignOnMeLoading] = useState(false);
  const [assignError, setAssignError] = useState("");

  const assignOnMe = async (id, cleanerId) => {
    try {
      setAssignError("");
      setIsAssignOnMeLoading(true);

      const assignedOrder = await request({
        url: `order/${id}/${cleanerId}`,
        method: "PATCH",
      });

      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === assignedOrder.id ? assignedOrder : prevOrder
        )
      );
    } catch (error) {
      if ([422, 409].includes(error.code)) {
        setAssignError(error.message);
      }
    } finally {
      setIsAssignOnMeLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center">
      {assignError && (
        <small className="text-danger _mr-2">
          {assignError.includes("vacuum")
            ? t("admin_order_vacuum_cleaner_error")
            : assignError}
        </small>
      )}
      <button
        className={`btn btn-primary width-max-content ${
          isAssignOnMeLoading ? "loading" : ""
        }`}
        onClick={() => assignOnMe(order.id, getUserId())}
        disabled={isAssignOnMeLoading}
      >
        {t("admin_assign_order_on_me_button_title")}
      </button>
    </div>
  );
};

export default AssignOnMe;
