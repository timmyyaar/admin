import { isAdmin } from "../../utils";
import React, { useContext } from "react";
import { ORDER_STATUS, ORDER_TYPE } from "../../constants";
import { LocaleContext } from "../../contexts";

const CLEANER_STATUS_FILTER_OPTIONS = [
  { value: ORDER_STATUS.APPROVED.value, label: "Available orders" },
  { value: "all-my-orders", label: "All my orders" },
  { value: "my-not-started-orders", label: "My not started orders" },
  { value: ORDER_STATUS.IN_PROGRESS.value, label: "My in progress orders" },
  { value: ORDER_STATUS.DONE.value, label: "My completed orders" },
];

const ADMIN_STATUS_FILTER_OPTIONS = Object.values(ORDER_STATUS);

const ORDER_TYPE_OPTIONS = Object.values(ORDER_TYPE);

const Filters = ({
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  cleaners,
  orderTypeFilter,
  setOrderTypeFilter,
}) => {
  const { t } = useContext(LocaleContext);

  const statusFilterOptions = isAdmin()
    ? ADMIN_STATUS_FILTER_OPTIONS
    : CLEANER_STATUS_FILTER_OPTIONS;

  return (
    <div className="d-flex filters-wrapper _gap-4 _mt-2">
      <div className="_w-2/4 d-flex align-items-center text-nowrap select-wrapper">
        <label className="_mr-3">{t("admin_order_status_filter_title")}:</label>
        <select
          value={statusFilter}
          className="form-select status-filter-select"
          onChange={({ target: { value } }) => setStatusFilter(value)}
        >
          <option value={"All"} selected={statusFilter === "All"}>
            {t("admin_all_option")}
          </option>
          {statusFilterOptions.map(({ value, label }) => (
            <option selected={statusFilter === value} value={value}>
              {t(`admin_order_${label.toLowerCase().replaceAll(" ", "_")}_option`)}
            </option>
          ))}
        </select>
      </div>
      {isAdmin() && (
        <>
          <div className="_w-2/4 d-flex align-items-center text-nowrap select-wrapper">
            {t("admin_assignee_filter_title")}:
            <select
              value={assigneeFilter}
              className="form-select _ml-2"
              onChange={({ target: { value } }) => setAssigneeFilter(value)}
            >
              <option value="All" selected={assigneeFilter === "All"}>
                {t("admin_all_option")}
              </option>
              <option
                value="Not assigned"
                selected={assigneeFilter === "Not assigned"}
              >
                {t("admin_not_assigned_option")}
              </option>
              {cleaners.map((cleaner) => (
                <option
                  selected={assigneeFilter === cleaner.id}
                  value={cleaner.id}
                >
                  {cleaner.email}
                </option>
              ))}
            </select>
          </div>
          <div className="_w-2/4 d-flex align-items-center text-nowrap select-wrapper">
            {t("admin_order_type_filter_title")}:
            <select
              value={orderTypeFilter}
              className="form-select _ml-2 order-type-select"
              onChange={({ target: { value } }) => setOrderTypeFilter(value)}
            >
              <option value="All" selected={orderTypeFilter === "All"}>
                {t("admin_all_option")}
              </option>
              {ORDER_TYPE_OPTIONS.map((orderType) => (
                <option
                  selected={orderTypeFilter === orderType}
                  value={orderType}
                >
                  {t(
                    `admin_order_type_${orderType
                      .toLowerCase()
                      .replaceAll(" ", "_")}_option`
                  )}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default Filters;
