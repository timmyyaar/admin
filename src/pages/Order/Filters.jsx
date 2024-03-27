import { isAdmin } from "../../utils";
import React from "react";
import { ORDER_STATUS, ORDER_TYPE } from "../../constants";

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
  const statusFilterOptions = isAdmin()
    ? ADMIN_STATUS_FILTER_OPTIONS
    : CLEANER_STATUS_FILTER_OPTIONS;

  return (
    <div className="d-flex filters-wrapper _gap-4 _mt-2">
      <div className="_w-2/4 d-flex align-items-center text-nowrap select-wrapper">
        <label className="_mr-3">Status filter:</label>
        <select
          value={statusFilter}
          className="form-select status-filter-select"
          onChange={({ target: { value } }) => setStatusFilter(value)}
        >
          <option value={"All"} selected={statusFilter === "All"}>
            All
          </option>
          {statusFilterOptions.map(({ value, label }) => (
            <option selected={statusFilter === value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {isAdmin() && (
        <>
          <div className="_w-2/4 d-flex align-items-center text-nowrap select-wrapper">
            Assignee filter:
            <select
              value={assigneeFilter}
              className="form-select _ml-2"
              onChange={({ target: { value } }) => setAssigneeFilter(value)}
            >
              <option value="All" selected={assigneeFilter === "All"}>
                All
              </option>
              <option
                value="Not assigned"
                selected={assigneeFilter === "Not assigned"}
              >
                Not assigned
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
            Order type:
            <select
              value={orderTypeFilter}
              className="form-select _ml-2 order-type-select"
              onChange={({ target: { value } }) => setOrderTypeFilter(value)}
            >
              <option value="All" selected={orderTypeFilter === "All"}>
                All
              </option>
              {ORDER_TYPE_OPTIONS.map((orderType) => (
                <option
                  selected={orderTypeFilter === orderType}
                  value={orderType}
                >
                  {orderType}
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
