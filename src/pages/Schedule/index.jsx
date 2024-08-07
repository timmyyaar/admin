import { useContext, useEffect, useState } from "react";
import { request } from "../../utils";
import ScheduleDayRow from "./ScheduleDayRow";

import "./index.scss";

import { ReactComponent as PrevIcon } from "./icons/prev.svg";
import { ReactComponent as NextIcon } from "./icons/next.svg";
import { Louder } from "../../components/Louder";
import ScheduleDayRowAll from "./ScheduleDayRowAll";
import { ROLES } from "../../constants";
import EmployeeTabs from "./EmployeeTabs";
import {AppContext, LocaleContext} from "../../contexts";
import BulkEditModal from "./BulkEditModal/BulkEditModal";

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
  const {
    userData: { role },
  } = useContext(AppContext);
  const isAdmin = [ROLES.ADMIN, ROLES.SUPERVISOR].includes(role);

  const { t } = useContext(LocaleContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.CLEANER);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

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

    if (isAdmin) {
      getUsers();
    }
  }, [isAdmin]);

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
      {isAdmin && (
        <EmployeeTabs
          users={filteredUsersByRole}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}
      <div className="d-flex justify-content-between align-items-center month-button">
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setPrevOrNextMonth({ isPrev: true })}
        >
          <PrevIcon className="_mr-2" />
          {t(prevMonthYearText.month)} {prevMonthYearText.year}
        </button>
        <h4 className="month-header">
          {t(currentMonthYearText.month)} {currentMonthYearText.year}
        </h4>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setPrevOrNextMonth()}
        >
          {t(nextMonthYearText.month)} {nextMonthYearText.year}
          <NextIcon className="_ml-2" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-dark table-borderless schedule-table">
          <thead>
            <tr key="header">
              <th className="text-center">
                {(!isAdmin || selectedEmployee) && (
                  <>
                    <button
                      className="btn btn-info rounded-pill"
                      onClick={() => setShowBulkEditModal(true)}
                    >
                      <span className="font-weight-semi-bold">
                        {t("admin_schedule_bulk_edit")}
                      </span>
                    </button>
                    {showBulkEditModal && (
                      <BulkEditModal
                        onClose={() => setShowBulkEditModal(false)}
                        employeeId={selectedEmployee}
                        schedule={schedule}
                        getSchedule={getSchedule}
                        t={t}
                        currentMonth={currentMonth}
                      />
                    )}
                  </>
                )}
              </th>
              <th className="whitespace-nowrap w-25 min-width-10-rem text-center">
                06:00 - 10:00
              </th>
              <th className="whitespace-nowrap w-25 min-width-10-rem text-center">
                10:00 - 14:00
              </th>
              <th className="whitespace-nowrap w-25 min-width-10-rem text-center">
                14:00 - 18:00
              </th>
              <th className="whitespace-nowrap w-25 min-width-10-rem text-center">
                18:00 - 22:00
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: daysInMonth }).map((day, index) =>
              isAdmin && !selectedEmployee ? (
                <ScheduleDayRowAll
                  date={getRowDate(currentMonth, index)}
                  schedule={schedule}
                  users={filteredUsers}
                  selectedEmployee={selectedEmployee}
                  key={day}
                />
              ) : (
                <ScheduleDayRow
                  date={getRowDate(currentMonth, index)}
                  schedule={schedule}
                  setSchedule={setSchedule}
                  key={day}
                  selectedEmployee={selectedEmployee}
                  t={t}
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
