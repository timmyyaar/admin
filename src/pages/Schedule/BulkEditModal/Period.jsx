import TimeSelection from "./TimeSelection";
import React from "react";
import { capitalizeFirstLetter } from "../../../utils";

function Period({
  title,
  isOff,
  setIsOff,
  t,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  minTime,
  maxTime,
  isLast,
}) {
  return (
    <div
      className={
        !isLast ? `border-bottom _mb-2 ${isOff ? "_pb-4" : "_pb-2"}` : ""
      }
    >
      <h6>
        {capitalizeFirstLetter(title)} {t("period")}:
      </h6>
      <div className="form-check">
        <input
          className="form-check-input _cursor-pointer"
          type="checkbox"
          id={`${title}-period`}
          checked={isOff}
          onChange={() => {
            setIsOff(!isOff);
            setStartTime(null);
            setEndTime(null);
          }}
        />
        <label
          htmlFor={`${title}-period`}
          className={`form-check-label _cursor-pointer ${
            isOff
              ? startTime && endTime
                ? "text-warning"
                : "text-danger"
              : "text-success"
          }`}
        >
          {title} {t("period")} {t("admin_schedule_off")}
        </label>
      </div>
      {isOff && (
        <div>
          <label className="_mt-3">{t("admin_schedule_select_period")}:</label>
          <TimeSelection
            minTime={minTime}
            maxTime={maxTime}
            t={t}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        </div>
      )}
    </div>
  );
}

export default Period;
