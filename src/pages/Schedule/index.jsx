import { useEffect, useState } from "react";
import { isAdmin, request } from "../../utils";
import ScheduleDayRow from "./ScheduleDayRow";

import "./index.scss";

import { ReactComponent as PrevIcon } from "./icons/prev.svg";
import { ReactComponent as NextIcon } from "./icons/next.svg";
import { Louder } from "../../components/Louder";
import ScheduleDayRowAll from "./ScheduleDayRowAll";
import { ROLES } from "../../constants";
import EmployeeTabs from "./EmployeeTabs";

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return new Date(year, month, 0).getDate();
};

const getMonthAndYearText = (date, { isPrev, isNext } = {}) => {
  const month = date.getMonth();

  const newDate = new Date(
    date.getFullYear(),
    isNext ? month + 1 : isPrev ? month - 1 : month,
    1
  );

  return {
    month: newDate.toLocaleString("en", { month: "long" }),
    year: newDate.getFullYear(),
  };
};

const getRowDate = (date, index) => {
  const month = date.getMonth() + 1;
  const twoDigitsMonth = month < 10 ? `0${month}` : month;
  const year = date.getFullYear();

  return `${index + 1}/${twoDigitsMonth}/${year}`;
};

function Schedule() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.CLEANER);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredUsersByRole = users.filter(({ role }) => role === selectedRole);
  const filteredUsers = filteredUsersByRole.filter(
    ({ id }) => !selectedEmployee || selectedEmployee === id
  );

  const getSchedule = async () => {
    try {
      setIsScheduleLoading(true);

      const scheduleResponse = await request({ url: "schedule" });

      setSchedule(scheduleResponse);
    } finally {
      setIsScheduleLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);

      const users = await request({ url: "users" });

      setUsers(
        users.filter(({ role }) =>
          [ROLES.CLEANER_DRY, ROLES.CLEANER].includes(role)
        )
      );
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    getSchedule();

    if (isAdmin()) {
      getUsers();
    }
  }, []);

  const setPrevOrNextMonth = ({ isPrev } = {}) => {
    const prevMonthDate = new Date(
      currentMonth.getFullYear(),
      isPrev ? currentMonth.getMonth() - 1 : currentMonth.getMonth() + 1,
      1
    );

    setCurrentMonth(prevMonthDate);
  };

  const daysInMonth = getDaysInMonth(currentMonth);

  const currentMonthYearText = getMonthAndYearText(currentMonth);
  const prevMonthYearText = getMonthAndYearText(currentMonth, { isPrev: true });
  const nextMonthYearText = getMonthAndYearText(currentMonth, { isNext: true });

  return (
    <div className="schedule-wrapper _mt-3">
      <Louder visible={isScheduleLoading || isUsersLoading} />
      {isAdmin() && (
        <EmployeeTabs
          users={filteredUsersByRole}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setPrevOrNextMonth({ isPrev: true })}
        >
          <PrevIcon className="_mr-2" />
          {prevMonthYearText.month} {prevMonthYearText.year}
        </button>
        <h4>
          {currentMonthYearText.month} {currentMonthYearText.year}
        </h4>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setPrevOrNextMonth()}
        >
          {nextMonthYearText.month} {nextMonthYearText.year}
          <NextIcon className="_ml-2" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-dark table-borderless schedule-table">
          <thead>
            <tr>
              <th />
              <th className="whitespace-nowrap w-25 text-center">
                06:00 - 10:00
              </th>
              <th className="whitespace-nowrap w-25 text-center">
                10:00 - 14:00
              </th>
              <th className="whitespace-nowrap w-25 text-center">
                14:00 - 18:00
              </th>
              <th className="whitespace-nowrap w-25 text-center">
                18:00 - 22:00
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: daysInMonth }).map((day, index) =>
              isAdmin() ? (
                <ScheduleDayRowAll
                  date={getRowDate(currentMonth, index)}
                  schedule={schedule}
                  users={filteredUsers}
                  selectedEmployee={selectedEmployee}
                />
              ) : (
                <ScheduleDayRow
                  date={getRowDate(currentMonth, index)}
                  schedule={schedule}
                  setSchedule={setSchedule}
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Schedule;
