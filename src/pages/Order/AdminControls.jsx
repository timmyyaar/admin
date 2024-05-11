import { ORDER_STATUS, ORDER_TYPE, ROLES } from "../../constants";
import React, { useContext, useEffect, useState } from "react";
import { ORDER_STATUS_OPTIONS } from "./index";
import { LocaleContext } from "../../contexts";
import Select from "../../components/common/Select/Select";
import { request } from "../../utils";
import { getFilteredCleanersForOrder } from "./utils";

const AdminControls = ({
  order,
  isStatusLoading,
  cleaners,
  onChangeOrderStatus,
  setOrders,
  setShowCheckListEditId,
  schedule,
}) => {
  const { t } = useContext(LocaleContext);

  const [assignedValue, setAssignedValue] = useState([]);
  const [assignError, setAssignError] = useState([]);
  const [isAssignLoading, setIsAssignOrderLoading] = useState([]);

  useEffect(() => {
    const updatedAssignedValue = order.cleaner_id.map((id) => {
      const cleaner = cleaners.find((cleaner) => cleaner.id === id);

      return {
        value: cleaner?.id,
        label: cleaner ? `${cleaner.first_name} ${cleaner.last_name}` : "N/A",
      };
    });

    setAssignedValue(updatedAssignedValue);

    //eslint-disable-next-line
  }, [JSON.stringify(cleaners), JSON.stringify(order.cleaner_id)]);

  const onAssignOrder = async (id, cleanerId) => {
    try {
      setAssignError([]);
      setIsAssignOrderLoading((prevLoading) => [...prevLoading, id]);

      const assignedOrders = await request({
        url: `order/${id}/assign`,
        body: { cleanerId },
        method: "PATCH",
      });

      setOrders((prevOrders) =>
        prevOrders.map((prev) => {
          const assignedOrder = assignedOrders.find(
            (item) => item.id === prev.id
          );

          return assignedOrder || prev;
        })
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

  const cleanersOptions = getFilteredCleanersForOrder(
    cleaners.filter(({ role }) =>
      ["Dry cleaning", "Ozonation"].includes(order.title)
        ? role === ROLES.CLEANER_DRY
        : role === ROLES.CLEANER
    ),
    order,
    schedule
  ).map(({ first_name, last_name, id }) => ({
    value: id,
    label: `${first_name} ${last_name}`,
  }));

  const statusOptions = ORDER_STATUS_OPTIONS.filter(({ value }) =>
    order.cleaner_id.length > 0 ? value !== ORDER_STATUS.CREATED.value : true
  ).map(({ value, label }) => ({
    value,
    label: t(`admin_order_${label.toLowerCase().replaceAll(" ", "_")}_option`),
  }));

  const isDryCleaningOrOzonation = [
    ORDER_TYPE.DRY,
    ORDER_TYPE.OZONATION,
  ].includes(order.title);

  return (
    <>
      <div className="admin-controls _gap-4 _w-full">
        <span>{t("admin_assignee")}:</span>
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
        <span>{t("admin_status")}:</span>
        <Select
          isDisabled={
            isStatusLoading.includes(order.id) ||
            isAssignLoading.includes(order.id)
          }
          isLoading={isStatusLoading.includes(order.id)}
          value={ORDER_STATUS_OPTIONS.find(
            ({ value }) => value === order.status
          )}
          onChange={(option) => {
            if (
              option.value === ORDER_STATUS.DONE.value &&
              order.check_list &&
              !isDryCleaningOrOzonation
            ) {
              setShowCheckListEditId(order.id);
            } else {
              onChangeOrderStatus(order.id, option.value);
            }
          }}
          options={statusOptions}
        />
      </div>
      {assignError.length > 0 && (
        <span className="text-danger _mt-3">{assignError}</span>
      )}
    </>
  );
};
export default AdminControls;
