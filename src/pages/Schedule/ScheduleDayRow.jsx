import { useState } from "react";
import { request } from "../../utils";
import ScheduleTimeCell from "./ScheduleTimeCell";

function ScheduleDayRow({ date, schedule, setSchedule, day }) {
  const existingSchedule = schedule.find((item) => item.date === date);

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
        url: `schedule${existingSchedule ? `/${existingSchedule.id}` : ""}`,
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

  return (
    <tr className={isLoading ? "disabled-row" : ""} key={day}>
      <td className="whitespace-nowrap">{date}</td>
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
