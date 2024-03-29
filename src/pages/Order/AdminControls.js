import { ORDER_STATUS, ROLES } from "../../constants";
import React, { useContext } from "react";
import { ORDER_STATUS_OPTIONS } from "./index";
import { LocaleContext } from "../../contexts";

const AdminControls = ({
  order,
  isAssignLoading,
  isStatusLoading,
  onAssignOrder,
  cleaners,
  onChangeOrderStatus,
}) => {
  const { t } = useContext(LocaleContext);

  const cleanersOptions = cleaners.filter(({ role }) =>
    ["Dry cleaning", "Ozonation"].includes(order.title)
      ? role === ROLES.CLEANER_DRY
      : role === ROLES.CLEANER
  );

  return (
    <div className="d-flex admin-controls _gap-4 _w-full">
      <div className="_w-full d-flex align-items-center">
        {t("admin_assignee")}:
        <select
          disabled={isAssignLoading.includes(order.id)}
          value={order.cleaner_id}
          className="form-select _ml-2"
          onChange={({ target: { value } }) => onAssignOrder(order.id, value)}
        >
          <option value={0} selected={!order.cleaner_id}>
            N/A
          </option>
          {cleanersOptions.map((cleaner) => (
            <option value={cleaner.id} key={cleaner.id}>
              {cleaner.email}
            </option>
          ))}
        </select>
      </div>
      <div className="_w-full d-flex align-items-center">
        {t("admin_status")}:
        <select
          disabled={
            isStatusLoading.includes(order.id) ||
            isAssignLoading.includes(order.id)
          }
          value={order.status}
          className="form-select status-select _ml-2"
          onChange={({ target: { value } }) =>
            onChangeOrderStatus(order.id, value)
          }
        >
          {ORDER_STATUS_OPTIONS.filter(({ value }) =>
            order.cleaner_id ? value !== ORDER_STATUS.CREATED.value : true
          ).map(({ value, label }) => (
            <option value={value} key={value}>
              {t(
                `admin_order_${label.toLowerCase().replaceAll(" ", "_")}_option`
              )}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default AdminControls;
