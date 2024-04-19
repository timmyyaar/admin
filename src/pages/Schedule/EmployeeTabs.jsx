import { ROLES } from "../../constants";
import Select from "../../components/common/Select/Select";
import { useContext } from "react";
import { LocaleContext } from "../../contexts";

function EmployeeTabs({
  selectedRole,
  setSelectedRole,
  selectedEmployee,
  setSelectedEmployee,
  users,
}) {
  const { t } = useContext(LocaleContext);
  const employeesOptions = users.map(({ id, first_name, last_name }) => ({
    value: id,
    label: `${first_name} ${last_name}`,
  }));

  return (
    <>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              selectedRole === ROLES.CLEANER ? "active" : ""
            }`}
            aria-current="page"
            onClick={() => {
              setSelectedRole(ROLES.CLEANER);
              setSelectedEmployee(null);
            }}
          >
            {t("Cleaners")}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              selectedRole === ROLES.CLEANER_DRY ? "active" : ""
            }`}
            onClick={() => {
              setSelectedRole(ROLES.CLEANER_DRY);
              setSelectedEmployee(null);
            }}
          >
            {t("Dry cleaners")}
          </button>
        </li>
      </ul>
      <div className="mb-3 d-flex align-items-center">
        <label className="_mr-2">{t("Employee")}:</label>
        <Select
          options={employeesOptions}
          isClearable
          placeholder={`${t("select_placeholder")}...`}
          onChange={(option) => setSelectedEmployee(option?.value || null)}
          value={
            employeesOptions.find(({ value }) => value === selectedEmployee) ||
            ""
          }
        />
      </div>
    </>
  );
}

export default EmployeeTabs;
