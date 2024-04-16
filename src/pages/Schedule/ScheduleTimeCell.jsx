import React, { useContext, useState } from "react";
import ScheduleTimeModal from "./ScheduleTimeModal";
import { capitalizeFirstLetter, getTimeRemaining, isAdmin } from "../../utils";
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
  const isCellDisabled = remainingTimeTillDate.days < (isAdmin() ? -1 : 3);

  const onClickTableCell = () => {
    if (!isLoading && !isCellDisabled) {
      addOrEditSchedule(periodName, !isPeriodAvailable);
    }
  };

  const isPeriodAvailable = !existingSchedule || existingSchedule[periodName];
  const isPeriodAdditionAvailable =
    existingSchedule && existingSchedule[`${periodName}Additional`];
  const isOrderPeriod =
    existingSchedule &&
    existingSchedule[`is${capitalizeFirstLetter(periodName)}Order`];

  const cellClassName = isPeriodAdditionAvailable
    ? `${isOrderPeriod ? "order-time" : "partial-available-time"} ${
        isCellDisabled ? "disabled-row" : ""
      }`
    : isPeriodAvailable
    ? `available-time  ${isCellDisabled ? "disabled-row" : ""}`
    : `${isOrderPeriod ? "order-time" : "not-available-time"} ${
        isCellDisabled ? "disabled-row" : ""
      }`;

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
              if (!isLoading && !isCellDisabled) {
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
