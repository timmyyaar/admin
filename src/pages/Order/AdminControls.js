import { ORDER_STATUS, ROLES } from "../../constants";
import React from "react";
import { ORDER_STATUS_OPTIONS } from "./index";

const AdminControls = ({
  order,
  isAssignLoading,
  isStatusLoading,
  onAssignOrder,
  cleaners,
  onChangeOrderStatus,
}) => {
  const cleanersOptions = cleaners.filter(({ role }) =>
    ["Dry cleaning", "Ozonation"].includes(order.title)
      ? role === ROLES.CLEANER_DRY
      : role === ROLES.CLEANER
  );

  return (
    <div className="d-flex admin-controls _gap-4 _w-full">
      <div className="_w-full d-flex align-items-center">
        Assignee:
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
            <option
              selected={cleaner.id === order.cleaner_id}
              value={cleaner.id}
            >
              {cleaner.email}
            </option>
          ))}
        </select>
      </div>
      <div className="_w-full d-flex align-items-center">
        Status:
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
            <option selected={value === order.status} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default AdminControls;
