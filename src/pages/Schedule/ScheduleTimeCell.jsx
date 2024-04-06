import React, { useState } from "react";
import ScheduleTimeModal from "./ScheduleTimeModal";
import { getTimeRemaining } from "../../utils";

function ScheduleTimeCell({
  existingSchedule,
  periodName,
  isLoading,
  addOrEditSchedule,
  minTime,
  maxTime,
  date,
}) {
  const [isTimeModalOpened, setIsTimeModalOpened] = useState(false);
  const remainingTimeTillDate = getTimeRemaining(`${date} 00:00`);
  const lessThanThreeDaysRemaining = remainingTimeTillDate.days < 3;

  const onLongPress = () => {
    if (!isLoading && !lessThanThreeDaysRemaining) {
      setIsTimeModalOpened(true);
    }
  };

  const onClick = () => {
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

  const [test, setTest] = useState(false);

  return (
    <>
      {test && <div>TEST!</div>}
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
      <td className={`mobile-only-table-cell ${cellClassName}`}>
        <button
          className="btn btn-primary"
          onTouchStart={(event) => {
            event.preventDefault();
            setTest(true);
          }}
          onTouchEnd={(event) => {
            event.preventDefault();
            setTest(false);
          }}
        >
          test
        </button>
        <div className="d-flex align-items-center whitespace-nowrap">
          {isPeriodAdditionAvailable && (
            <div className="text-center font-weight-semi-bold text-black">
              {existingSchedule[`${periodName}Additional`]}
            </div>
          )}
        </div>
      </td>
      <td className={`select-none mobile-none-table-cell ${cellClassName}`}>
        <div className="d-flex align-items-center whitespace-nowrap">
          <button
            className="btn btn-sm btn-secondary visible-on-table-cell-hover"
            onClick={(event) => {
              if (!isLoading && !lessThanThreeDaysRemaining) {
                event.stopPropagation();
                setIsTimeModalOpened(true);
              }
            }}
            title="Set custom time"
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
