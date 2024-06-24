import DatePicker from "react-datepicker";
import React from "react";
import { getDateString } from "../../utils";
import Select from "../../components/common/Select/Select";
import { CITIES_OPTIONS } from "../../constants";

function Filters({
  t,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  cleaners,
  cleanersFilter,
  setCleanersFilter,
  citiesFilter,
  setCitiesFilter,
}) {
  const filterPassedTimeFromDate = (time) => {
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

  const cleanersOptions = cleaners.map(({ id, first_name, last_name }) => ({
    value: id,
    label: `${first_name} ${last_name}`,
  }));
  const cleanersFilterValue = cleanersFilter.map((id) =>
    cleanersOptions.find(({ value }) => value === id),
  );
  const citiesFilterValue = citiesFilter.map((city) => ({
    value: city,
    label: city,
  }));

  return (
    <div className="_mb-6">
      <div className="filters-wrapper _items-center _gap-4 _mt-2">
        <span>{t("admin_order_date_from_filter_title")}:</span>
        <div>
          <DatePicker
            showTimeSelect
            selectsStart
            selected={fromDate}
            onChange={(newDate) => setFromDate(newDate)}
            dateFormat="d/MM/yyyy HH:mm"
            timeFormat="HH:mm"
            maxDate={toDate}
            isClearable={fromDate}
            filterTime={filterPassedTimeFromDate}
            startDate={fromDate}
            endDate={toDate}
          />
        </div>
        <span>{t("admin_order_date_to_filter_title")}:</span>
        <div>
          <DatePicker
            showTimeSelect
            selectsEnd
            selected={toDate}
            onChange={(newDate) => setToDate(newDate)}
            dateFormat="d/MM/yyyy HH:mm"
            timeFormat="HH:mm"
            minDate={fromDate}
            isClearable={toDate}
            filterTime={filterPassedTimeToDate}
            startDate={fromDate}
            endDate={toDate}
          />
        </div>
        <span>{t("admin_assignee_filter_title")}:</span>
        <Select
          isMulti
          value={cleanersFilterValue}
          options={cleanersOptions}
          onChange={(options) =>
            setCleanersFilter(options ? options.map(({ value }) => value) : [])
          }
        />
        <span>{t("admin_cities_filter_title")}:</span>
        <Select
          placeholder={t("select_placeholder")}
          isMulti
          options={CITIES_OPTIONS}
          value={citiesFilterValue}
          onChange={(options) =>
            setCitiesFilter(options?.map(({ value }) => value) || [])
          }
        />
      </div>
    </div>
  );
}

export default Filters;
