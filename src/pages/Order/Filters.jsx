import { capitalizeFirstLetter, getDateString } from "../../utils";
import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import {
  CITIES_OPTIONS,
  ORDER_STATUS,
  ORDER_TYPE,
  ROLES,
} from "../../constants";
import { AppContext, LocaleContext } from "../../contexts";
import Select from "../../components/common/Select/Select";
import tytIcon from "../../assets/icons/aggregators/take-your-time.svg";
import { AGGREGATOR_OPTIONS, SORTING } from "./constants";
import { OptionWithIcon, SingleValueWithIcon } from "./select-components";

const CLEANER_STATUS_FILTER_OPTIONS = [
  { value: ORDER_STATUS.APPROVED.value, label: "Available orders" },
  { value: "all-my-orders", label: "All my orders" },
  { value: "my-not-started-orders", label: "My not started orders" },
  { value: ORDER_STATUS.IN_PROGRESS.value, label: "My in progress orders" },
  { value: ORDER_STATUS.DONE.value, label: "My completed orders" },
];

export const PASSED_BUT_NOT_DONE_ORDER = "passed-but-not-done";

const ADMIN_STATUS_FILTER_OPTIONS = [
  ...Object.values(ORDER_STATUS),
  { value: PASSED_BUT_NOT_DONE_ORDER, label: "Passed but not done" },
];

const ORDER_TYPE_OPTIONS = Object.values(ORDER_TYPE);

const TYT_OPTION = {
  label: "Take Your Time",
  value: "Take Your Time",
  icon: tytIcon,
};

const Filters = ({
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  cleaners,
  orderTypeFilter,
  setOrderTypeFilter,
  dateFilter,
  setDateFilter,
  citiesFilter,
  setCitiesFilter,
  aggregatorFilter,
  setAggregatorFilter,
  sorting,
  setSorting,
}) => {
  const {
    userData: { role, cities },
  } = useContext(AppContext);
  const isAdmin = [ROLES.ADMIN, ROLES.SUPERVISOR].includes(role);

  const { t } = useContext(LocaleContext);

  const SORTING_OPTIONS = Object.values(SORTING).map(
    ({ translation, value }) => ({
      label: t(translation),
      value,
    }),
  );

  const statusFilterOptions = isAdmin
    ? ADMIN_STATUS_FILTER_OPTIONS
    : CLEANER_STATUS_FILTER_OPTIONS;

  const onDateChange = (date, field) => {
    setDateFilter((prev) => ({ ...prev, [field]: date }));
  };

  const filterPassedTimeFromDate = (time) => {
    const toDate = dateFilter.toDate;
    const selectedDate = new Date(time);

    if (!toDate) {
      return true;
    }

    const isSameDay = getDateString(toDate) === getDateString(selectedDate);

    if (!isSameDay) {
      return true;
    }

    return toDate.getTime() > selectedDate.getTime();
  };

  const filterPassedTimeToDate = (time) => {
    const fromDate = dateFilter.fromDate;
    const selectedDate = new Date(time);

    if (!fromDate) {
      return true;
    }

    const isSameDay = getDateString(fromDate) === getDateString(selectedDate);

    if (!isSameDay) {
      return true;
    }

    return fromDate.getTime() < selectedDate.getTime();
  };

  const userCities = cities.split(",");
  const citiesFilterValue = citiesFilter.map((city) => ({
    value: city,
    label: city,
  }));

  return (
    <div className="_items-center _gap-4 _mt-2 order-filters-wrapper">
      <label>{t("admin_order_status_filter_title")}:</label>
      <select
        value={statusFilter}
        className="form-select"
        onChange={({ target: { value } }) => setStatusFilter(value)}
      >
        <option value={"All"} selected={statusFilter === "All"}>
          {t("admin_all_option")}
        </option>
        {statusFilterOptions.map(({ value, label }) => (
          <option
            key={value}
            value={value}
            className={`${
              value === PASSED_BUT_NOT_DONE_ORDER ? "text-danger" : ""
            }`}
          >
            {t(
              `admin_order_${label.toLowerCase().replaceAll(" ", "_")}_option`,
            )}
          </option>
        ))}
      </select>
      {isAdmin && (
        <>
          <span>{t("admin_assignee_filter_title")}:</span>
          <select
            value={assigneeFilter}
            className="form-select"
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
              <option value={cleaner.id} key={cleaner.id}>
                {`${cleaner.first_name} ${cleaner.last_name}`}
              </option>
            ))}
          </select>
          <span>{t("admin_order_type_filter_title")}:</span>
          <select
            value={orderTypeFilter}
            className="form-select"
            onChange={({ target: { value } }) => setOrderTypeFilter(value)}
          >
            <option value="All" selected={orderTypeFilter === "All"}>
              {t("admin_all_option")}
            </option>
            {ORDER_TYPE_OPTIONS.map((orderType) => (
              <option value={orderType} key={orderType}>
                {t(
                  `admin_order_type_${orderType
                    .toLowerCase()
                    .replaceAll(" ", "_")}_option`,
                )}
              </option>
            ))}
          </select>
          <span>{capitalizeFirstLetter(t("aggregator"))}:</span>
          <Select
            isClearable
            placeholder={`${t("select_placeholder")}...`}
            value={aggregatorFilter}
            options={[TYT_OPTION, ...AGGREGATOR_OPTIONS]}
            onChange={(value) => setAggregatorFilter(value)}
            components={{
              Option: OptionWithIcon,
              SingleValue: SingleValueWithIcon,
            }}
          />
        </>
      )}
      {(isAdmin || userCities.length > 1) && (
        <>
          <span>{t("admin_cities_filter_title")}:</span>
          <Select
            placeholder={`${t("select_placeholder")}...`}
            isMulti
            options={
              isAdmin
                ? CITIES_OPTIONS
                : userCities.map((city) => ({ value: city, label: city }))
            }
            value={citiesFilterValue}
            onChange={(options) =>
              setCitiesFilter(options?.map(({ value }) => value) || [])
            }
          />
        </>
      )}
      <span>{t("admin_order_date_from_filter_title")}:</span>
      <div>
        <DatePicker
          showTimeSelect
          selectsStart
          selected={dateFilter.fromDate}
          onChange={(newDate) => onDateChange(newDate, "fromDate")}
          dateFormat="d/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          maxDate={dateFilter.toDate}
          isClearable={dateFilter.fromDate}
          filterTime={filterPassedTimeFromDate}
          startDate={dateFilter.fromDate}
          endDate={dateFilter.toDate}
        />
      </div>
      <span>{t("admin_order_date_to_filter_title")}:</span>
      <div>
        <DatePicker
          showTimeSelect
          selectsEnd
          selected={dateFilter.toDate}
          onChange={(newDate) => onDateChange(newDate, "toDate")}
          dateFormat="d/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          minDate={dateFilter.fromDate}
          isClearable={dateFilter.toDate}
          filterTime={filterPassedTimeToDate}
          startDate={dateFilter.fromDate}
          endDate={dateFilter.toDate}
        />
      </div>
      <span>{capitalizeFirstLetter(t("sorting"))}:</span>
      <div>
        <Select
          isClearable
          placeholder={`${t("select_placeholder")}...`}
          options={SORTING_OPTIONS}
          value={sorting}
          onChange={(value) => setSorting(value)}
        />
      </div>
    </div>
  );
};

export default Filters;
