import { useState } from "react";
import { getTimeRemaining, isAdmin, request } from "../../utils";
import ScheduleTimeCell from "./ScheduleTimeCell";

function ScheduleDayRow({ date, schedule, setSchedule, selectedEmployee, t }) {
  const remainingTimeTillDate = getTimeRemaining(`${date} 00:00`);
  const isRowDisabled = remainingTimeTillDate.days < (isAdmin() ? -1 : 3);
  const existingSchedule = schedule.find(
    (item) =>
      item.date === date &&
      (selectedEmployee ? item.employeeId === selectedEmployee : true)
  );

  const [isLoading, setIsLoading] = useState(false);

  const addOrEditSchedule = async (fieldName, value) => {
    try {
      setIsLoading(true);
      const forcedUnavailable = fieldName.includes("Additional")
        ? {
            [fieldName.replace("Additional", "")]: false,
          }
        : { [`${fieldName}Additional`]: null };

      const addedOrUpdatedDay = await request({
        url: `schedule${
          existingSchedule
            ? `/${existingSchedule.id}`
            : `${selectedEmployee ? `/${selectedEmployee}` : ""}`
        }`,
        method: existingSchedule ? "PUT" : "POST",
        body: existingSchedule
          ? {
              ...existingSchedule,
              [fieldName]: value,
              ...forcedUnavailable,
            }
          : {
              [fieldName]: value,
              date,
              ...forcedUnavailable,
            },
      });

      setSchedule((prev) =>
        existingSchedule
          ? prev.map((item) =>
              item.id === existingSchedule.id ? addedOrUpdatedDay : item
            )
          : [...prev, addedOrUpdatedDay]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const needToSetFullDayNotAvailable =
    !existingSchedule ||
    existingSchedule.firstPeriod ||
    existingSchedule.secondPeriod ||
    existingSchedule.thirdPeriod ||
    existingSchedule.fourthPeriod ||
    existingSchedule.firstPeriodAdditional ||
    existingSchedule.secondPeriodAdditional ||
    existingSchedule.thirdPeriodAdditional ||
    existingSchedule.fourthPeriodAdditional;
  const isOrderOnThisDay =
    existingSchedule?.isFirstPeriodOrder ||
    existingSchedule?.isSecondPeriodOrder ||
    existingSchedule?.isThirdPeriodOrder ||
    existingSchedule?.isFourthPeriodOrder;

  const editFullDaySchedule = async () => {
    if (isRowDisabled || isOrderOnThisDay) {
      return;
    }

    try {
      setIsLoading(true);

      const addedOrUpdatedDay = await request({
        url: `schedule${
          existingSchedule
            ? `/${existingSchedule.id}`
            : `${selectedEmployee ? `/${selectedEmployee}` : ""}`
        }`,
        method: existingSchedule ? "PUT" : "POST",
        body: existingSchedule
          ? {
              ...existingSchedule,
              firstPeriodAdditional: null,
              secondPeriodAdditional: null,
              thirdPeriodAdditional: null,
              fourthPeriodAdditional: null,
              ...(needToSetFullDayNotAvailable
                ? {
                    firstPeriod: false,
                    secondPeriod: false,
                    thirdPeriod: false,
                    fourthPeriod: false,
                  }
                : {
                    firstPeriod: true,
                    secondPeriod: true,
                    thirdPeriod: true,
                    fourthPeriod: true,
                  }),
            }
          : {
              date,
              firstPeriod: false,
              secondPeriod: false,
              thirdPeriod: false,
              fourthPeriod: false,
            },
      });

      setSchedule((prev) =>
        existingSchedule
          ? prev.map((item) =>
              item.id === existingSchedule.id ? addedOrUpdatedDay : item
            )
          : [...prev, addedOrUpdatedDay]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr className={isLoading ? "disabled-row" : ""}>
      <td className="whitespace-nowrap">
        <button
          className={`btn btn-sm rounded-pill ${
            needToSetFullDayNotAvailable ? "btn-danger" : "btn-success"
          }`}
          title={
            needToSetFullDayNotAvailable
              ? t("admin_set_day_off")
              : t("admin_set_working_day")
          }
          onClick={editFullDaySchedule}
          disabled={isRowDisabled || isOrderOnThisDay}
        >
          {date}
        </button>
      </td>
      <ScheduleTimeCell
        existingSchedule={existingSchedule}
        periodName="firstPeriod"
        isLoading={isLoading}
        addOrEditSchedule={addOrEditSchedule}
        minTime="06:00"
        maxTime="10:00"
        date={date}
      />
      <ScheduleTimeCell
        existingSchedule={existingSchedule}
        periodName="secondPeriod"
        isLoading={isLoading}
        addOrEditSchedule={addOrEditSchedule}
        minTime="10:00"
        maxTime="14:00"
        date={date}
      />
      <ScheduleTimeCell
        existingSchedule={existingSchedule}
        periodName="thirdPeriod"
        isLoading={isLoading}
        addOrEditSchedule={addOrEditSchedule}
        minTime="14:00"
        maxTime="18:00"
        date={date}
      />
      <ScheduleTimeCell
        existingSchedule={existingSchedule}
        periodName="fourthPeriod"
        isLoading={isLoading}
        addOrEditSchedule={addOrEditSchedule}
        minTime="18:00"
        maxTime="22:00"
        date={date}
      />
    </tr>
  );
}

export default ScheduleDayRow;
