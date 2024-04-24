import React, { useState } from "react";
import NotAvailableEmployeesPopover from "./NotAvailableEmployeesPopover";
import { capitalizeFirstLetter } from "../../utils";

function ScheduleTimeCellAdmin({
  existingSchedules,
  periodName,
  users,
  selectedEmployee,
}) {
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);

  const notAvailableUsers = users
    .filter(({ id }) => {
      const existingEmployeeSchedule = existingSchedules.find(
        ({ employeeId }) => employeeId === id
      );

      return existingEmployeeSchedule?.[periodName] === false;
    })
    .map(({ id, email, first_name, last_name }) => {
      const existingEmployeeSchedule = existingSchedules.find(
        ({ employeeId }) => employeeId === id
      );

      const isOrder =
        existingEmployeeSchedule &&
        existingEmployeeSchedule[`is${capitalizeFirstLetter(periodName)}Order`];

      if (existingEmployeeSchedule[`${periodName}Additional`]) {
        return {
          email,
          first_name,
          last_name,
          notAvailableHours:
            existingEmployeeSchedule[`${periodName}Additional`],
          isOrder,
        };
      } else {
        return { email, first_name, last_name, isOrder };
      }
    });

  const isOneUser = users.length === 1;

  const showPartialAvailableTime = isOneUser
    ? notAvailableUsers.some(({ notAvailableHours }) => notAvailableHours)
    : notAvailableUsers.length > 0 && notAvailableUsers.length < users.length;
  const showNotAvailableTime =
    notAvailableUsers.length === users.length &&
    !notAvailableUsers.some(({ notAvailableHours }) => notAvailableHours);

  const availableUsersCount = users.length - notAvailableUsers.length;

  const cellClassName = showPartialAvailableTime
    ? "partial-available-time"
    : showNotAvailableTime
    ? "not-available-time"
    : "available-time";

  return (
    <>
      <td
        className={`position-relative ${cellClassName}`}
        onClick={() => {
          if (notAvailableUsers.length > 0) {
            setIsPopoverOpened(true);
          }
        }}
      >
        <div className="text-center">
          <b className="text-black">{availableUsersCount}</b>
        </div>
        {isPopoverOpened && (
          <NotAvailableEmployeesPopover
            notAvailableUsers={notAvailableUsers}
            onClose={() => setIsPopoverOpened(false)}
          />
        )}
        {Boolean(selectedEmployee && showPartialAvailableTime) && (
          <div className="text-center font-weight-semi-bold text-black">
            {notAvailableUsers[0].notAvailableHours}
          </div>
        )}
      </td>
    </>
  );
}

export default ScheduleTimeCellAdmin;
