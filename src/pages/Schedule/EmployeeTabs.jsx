import { ROLES } from "../../constants";
import Select from "../../components/common/Select/Select";

function EmployeeTabs({
  selectedRole,
  setSelectedRole,
  selectedEmployee,
  setSelectedEmployee,
  users,
}) {
  const employeesOptions = users.map(({ id, email }) => ({
    value: id,
    label: email,
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
            Cleaners
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
            Dry cleaners
          </button>
        </li>
      </ul>
      <div className="mb-3 d-flex align-items-center">
        <label className="_mr-2">Employee:</label>
        <Select
          options={employeesOptions}
          onChange={(option) => setSelectedEmployee(option.value)}
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
