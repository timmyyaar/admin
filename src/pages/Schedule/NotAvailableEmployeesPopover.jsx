import { useContext, useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { LocaleContext } from "../../contexts";

function NotAvailableEmployeesPopover({ onClose, notAvailableUsers }) {
  const { t } = useContext(LocaleContext);

  const ref = useRef();
  useClickOutside(ref, onClose);

  return (
    <div className="not-available-employees-popover" ref={ref}>
      <div className="whitespace-nowrap">
        <h5>{t("admin_schedule_not_available_employees")}:</h5>
        {notAvailableUsers.map(({ email, notAvailableHours }) => (
          <div>
            <span className="_mr-1">{email}</span>
            {notAvailableHours ? `(${notAvailableHours})` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotAvailableEmployeesPopover;
