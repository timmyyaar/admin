import DatePicker from "react-datepicker";
import React, { useContext } from "react";
import { LocaleContext } from "../../contexts";

function Filters({ dateFrom, setDateFrom, dateTo, setDateTo }) {
  const { t } = useContext(LocaleContext);

  return (
    <div className="_mb-4 lg:_mb-8 _flex _gap-3 _items-center _flex-col lg:_flex-row">
      <div className="_flex _items-center">
        <span className="_mr-2">
          {t("admin_order_date_from_filter_title")}:
        </span>
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
      </div>
      <div className="_flex _items-center">
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
      </div>
    </div>
  );
}

export default Filters;
