import React from "react";
import DatePicker from "react-datepicker";
import { getMinOrMaxTime, getTimeWithMinuteDifference } from "../utils";

function TimeSelection({
  minTime,
  maxTime,
  t,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) {
  return (
    <div className="d-flex _mt-3">
      <div className="_mr-3">
        <label>{t("admin_schedule_start_time")}:</label>
        <div>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={60}
            timeCaption={t("Time")}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            minTime={getMinOrMaxTime(minTime)}
            maxTime={
              endTime
                ? getTimeWithMinuteDifference(endTime, "minus")
                : getTimeWithMinuteDifference(getMinOrMaxTime(maxTime), "minus")
            }
          />
        </div>
      </div>
      <div>
        <label>{t("admin_schedule_end_time")}:</label>
        <div>
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={60}
            timeCaption={t("Time")}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            minTime={
              startTime
                ? getTimeWithMinuteDifference(startTime)
                : getTimeWithMinuteDifference(getMinOrMaxTime(minTime))
            }
            maxTime={getMinOrMaxTime(maxTime)}
          />
        </div>
      </div>
    </div>
  );
}

export default TimeSelection;
