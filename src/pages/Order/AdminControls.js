import { ORDER_STATUS, ROLES } from "../../constants";
import React, { useContext, useEffect, useState } from "react";
import { ORDER_STATUS_OPTIONS } from "./index";
import { LocaleContext } from "../../contexts";
import Select from "../../components/common/Select/Select";
import { request } from "../../utils";

const AdminControls = ({
  order,
  isStatusLoading,
  cleaners,
  onChangeOrderStatus,
  setOrders,
}) => {
  const { t } = useContext(LocaleContext);

  const [assignedValue, setAssignedValue] = useState([]);
  const [assignError, setAssignError] = useState([]);
  const [isAssignLoading, setIsAssignOrderLoading] = useState([]);

  useEffect(() => {
    const updatedAssignedValue = order.cleaner_id.map((id) => {
      const cleaner = cleaners.find((cleaner) => cleaner.id === id);

      return { value: cleaner?.id, label: cleaner?.email };
    });

    setAssignedValue(updatedAssignedValue);

    //eslint-disable-next-line
  }, [JSON.stringify(cleaners), JSON.stringify(order.cleaner_id)]);

  const onAssignOrder = async (id, cleanerId) => {
    try {
      setAssignError([]);
      setIsAssignOrderLoading((prevLoading) => [...prevLoading, id]);

      const assignedOrder = await request({
        url: `order/${id}/assign`,
        body: { cleanerId },
        method: "PATCH",
      });

      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === assignedOrder.id ? assignedOrder : prevOrder
        )
      );
    } catch (error) {
      if (error.code === 422) {
        setAssignError((prevErrors) => [
          ...prevErrors,
          { id, message: error.message },
        ]);
      }
    } finally {
      setIsAssignOrderLoading((prevLoading) =>
        prevLoading.filter((item) => item !== id)
      );
    }
  };

  const cleanersOptions = cleaners
    .filter(({ role }) =>
      ["Dry cleaning", "Ozonation"].includes(order.title)
        ? role === ROLES.CLEANER_DRY
        : role === ROLES.CLEANER
    )
    .map(({ email, id }) => ({ value: id, label: email }));

  return (
    <div className="d-flex admin-controls _gap-4 _w-full">
      <div className="_w-full d-flex align-items-center">
        <span className="_mr-2">{t("admin_assignee")}:</span>
        <Select
          isMulti
          isDisabled={isAssignLoading.includes(order.id)}
          options={cleanersOptions}
          value={assignedValue}
          isClearable
          onChange={(options) => {
            if (options.length <= order.cleaners_count) {
              onAssignOrder(
                order.id,
                options.map(({ value }) => value)
              );
            }
          }}
        />
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
            order.cleaner_id.length > 0
              ? value !== ORDER_STATUS.CREATED.value
              : true
          ).map(({ value, label }) => (
            <option value={value} key={value}>
              {t(
                `admin_order_${label.toLowerCase().replaceAll(" ", "_")}_option`
              )}
            </option>
          ))}
        </select>
      </div>
      {assignError && <span className="text-danger _mt-3">{assignError}</span>}
    </div>
  );
};
export default AdminControls;
