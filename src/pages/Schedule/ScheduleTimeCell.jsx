import React, { useContext, useState } from "react";
import ScheduleTimeModal from "./ScheduleTimeModal";
import { getTimeRemaining } from "../../utils";
import { LocaleContext } from "../../contexts";

function ScheduleTimeCell({
  existingSchedule,
  periodName,
  isLoading,
  addOrEditSchedule,
  minTime,
  maxTime,
  date,
}) {
  const { t } = useContext(LocaleContext);
  const [isTimeModalOpened, setIsTimeModalOpened] = useState(false);
  const remainingTimeTillDate = getTimeRemaining(`${date} 00:00`);
  const lessThanThreeDaysRemaining = remainingTimeTillDate.days < 3;

  const onClickTableCell = () => {
    if (!isLoading && !lessThanThreeDaysRemaining) {
      addOrEditSchedule(periodName, !isPeriodAvailable);
    }
  };

  const isPeriodAvailable = !existingSchedule || existingSchedule[periodName];
  const isPeriodAdditionAvailable =
    existingSchedule && existingSchedule[`${periodName}Additional`];

  const cellClassName = isPeriodAdditionAvailable
    ? `partial-available-time ${
        lessThanThreeDaysRemaining ? "disabled-row" : ""
      }`
    : isPeriodAvailable
    ? `available-time  ${lessThanThreeDaysRemaining ? "disabled-row" : ""}`
    : `not-available-time  ${lessThanThreeDaysRemaining ? "disabled-row" : ""}`;

  return (
    <>
      {isTimeModalOpened && (
        <ScheduleTimeModal
          onClose={() => setIsTimeModalOpened(false)}
          minTime={minTime}
          maxTime={maxTime}
          addOrEditSchedule={addOrEditSchedule}
          periodName={periodName}
          isLoading={isLoading}
        />
      )}
      <td className={`select-none ${cellClassName}`} onClick={onClickTableCell}>
        <div className="d-flex align-items-center whitespace-nowrap">
          <button
            className="btn btn-sm btn-secondary visible-on-table-cell-hover"
            onClick={(event) => {
              if (!isLoading && !lessThanThreeDaysRemaining) {
                event.stopPropagation();
                setIsTimeModalOpened(true);
              }
            }}
            title={t("admin_schedule_set_custom_time")}
          >
            🕒
          </button>
          {isPeriodAdditionAvailable && (
            <div className="_ml-auto font-weight-semi-bold text-black _pl-2">
              {existingSchedule[`${periodName}Additional`]}
            </div>
          )}
        </div>
      </td>
    </>
  );
}

export default ScheduleTimeCell;
