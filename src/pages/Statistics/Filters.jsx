import DatePicker from "react-datepicker";
import React, { useContext } from "react";
import { LocaleContext } from "../../contexts";
import Select from "../../components/common/Select/Select";
import { CITIES_OPTIONS } from "../../constants";

function Filters({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  isOnlyCompleted,
  setIsOnlyCompleted,
  citiesFilter,
  setCitiesFilter,
}) {
  const { t } = useContext(LocaleContext);

  const citiesFilterValue = citiesFilter.map((city) => ({
    value: city,
    label: city,
  }));

  return (
    <div className="filters-wrapper _inline-grid _mb-4 _mt-2 lg:_mb-8 _gap-3 _items-center">
      <span>{t("admin_order_date_from_filter_title")}:</span>
      <div>
        <DatePicker
          selectsStart
          selected={dateFrom}
          onChange={(newDate) => setDateFrom(newDate)}
          dateFormat="d/MM/yyyy"
          maxDate={dateTo}
          startDate={dateFrom}
          endDate={dateTo}
          isClearable={dateFrom}
        />
      </div>
      <span>{t("admin_order_date_to_filter_title")}:</span>
      <div>
        <DatePicker
          selectsEnd
          selected={dateTo}
          onChange={(newDate) => setDateTo(newDate)}
          dateFormat="d/MM/yyyy"
          minDate={dateFrom}
          startDate={dateFrom}
          endDate={dateTo}
          isClearable={dateTo}
        />
      </div>
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
      <div className="form-check _col-span-2 lg:_col-span-1">
        <input
          className="form-check-input _cursor-pointer"
          type="checkbox"
          id="only_active"
          checked={isOnlyCompleted}
          onChange={() => {
            setIsOnlyCompleted((prev) => !prev);
          }}
        />
        <label
          htmlFor="only_active"
          className="form-check-label _cursor-pointer"
        >
          {t("show_only_completed_orders")}
        </label>
      </div>
    </div>
  );
}

export default Filters;
