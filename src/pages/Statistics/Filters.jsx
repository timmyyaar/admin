import DatePicker from "react-datepicker";
import React, { useContext } from "react";
import { LocaleContext } from "../../contexts";

function Filters({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  isOnlyCompleted,
  setIsOnlyCompleted,
}) {
  const { t } = useContext(LocaleContext);

  return (
    <div className="filters-wrapper _inline-grid _mb-4 lg:_mb-8 _gap-3 _items-center lg:_flex-row">
      <span className="_mr-2">{t("admin_order_date_from_filter_title")}:</span>
      <div className="_mr-3">
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
      <span className="_mr-2">{t("admin_order_date_to_filter_title")}:</span>
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
          Show only completed orders
        </label>
      </div>
    </div>
  );
}

export default Filters;
