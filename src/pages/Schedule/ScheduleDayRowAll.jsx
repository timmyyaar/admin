import ScheduleTimeCellAdmin from "./ScheduleTimeCellAdmin";

function ScheduleDayRowAll({ date, schedule, users, selectedEmployee }) {
  const existingSchedules = schedule.filter((item) => item.date === date);

  return (
    <tr>
      <td className="whitespace-nowrap">{date}</td>
      <ScheduleTimeCellAdmin
        existingSchedules={existingSchedules}
        periodName="firstPeriod"
        date={date}
        users={users}
        selectedEmployee={selectedEmployee}
      />
      <ScheduleTimeCellAdmin
        existingSchedules={existingSchedules}
        periodName="secondPeriod"
        date={date}
        users={users}
        selectedEmployee={selectedEmployee}
      />
      <ScheduleTimeCellAdmin
        existingSchedules={existingSchedules}
        periodName="thirdPeriod"
        date={date}
        users={users}
        selectedEmployee={selectedEmployee}
      />
      <ScheduleTimeCellAdmin
        existingSchedules={existingSchedules}
        periodName="fourthPeriod"
        date={date}
        users={users}
        selectedEmployee={selectedEmployee}
      />
    </tr>
  );
}

export default ScheduleDayRowAll;
