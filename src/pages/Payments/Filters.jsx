import { useContext, useEffect, useState } from "react";
import Select from "../../components/common/Select/Select";
import { request } from "../../utils";
import { getDateWithoutTimeString } from "./index";
import { ROLES } from "../../constants";
import { LocaleContext } from "../../contexts";
import { Louder } from "../../components/Louder";

function Filters({
  selectedEmployeeId,
  setSelectedEmployeeId,
  payments,
  selectedTimePeriod,
  setSelectedTimePeriod,
}) {
  const { t } = useContext(LocaleContext);

  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [users, setUsers] = useState();

  const uniqueTimePeriods = [
    ...new Set(
      payments.map(
        ({ period_start, period_end }) =>
          `${getDateWithoutTimeString(
            period_start
          )} - ${getDateWithoutTimeString(period_end)}`
      )
    ),
  ];
  const timePeriodsOptions = uniqueTimePeriods.map((item) => ({
    value: item,
    label: item,
  }));

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);

      const usersResponse = await request({ url: "users" });

      setUsers(
        usersResponse
          .filter(({ role }) =>
            [ROLES.CLEANER_DRY, ROLES.CLEANER].includes(role)
          )
          .map(({ id, first_name, last_name }) => ({
            value: id,
            label: `${first_name} ${last_name}`,
          }))
      );
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const employeeValue = users?.find(
    ({ value }) => value === selectedEmployeeId
  );
  const timePeriodValue = timePeriodsOptions?.find(
    ({ value }) => value === selectedTimePeriod
  );

  return (
    <>
      <Louder visible={isUsersLoading} />
      <div className="filters-wrapper _mt-3 _mb-6">
        <span>{t("Employee")}:</span>
        <Select
          placeholder={t("select_placeholder")}
          options={users}
          value={employeeValue || null}
          onChange={(option) => setSelectedEmployeeId(option?.value || null)}
          isClearable
        />
        <span>{t("time_period")}:</span>
        <Select
          placeholder={t("select_placeholder")}
          options={timePeriodsOptions}
          value={timePeriodValue || null}
          onChange={(option) => setSelectedTimePeriod(option?.value || null)}
          isClearable
        />
      </div>
    </>
  );
}

export default Filters;
