import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";

function NotAvailableEmployeesPopover({ onClose, notAvailableUsers }) {
  const ref = useRef();
  useClickOutside(ref, onClose);

  return (
    <div className="not-available-employees-popover" ref={ref}>
      <div className="whitespace-nowrap">
        <h5>Not available employees:</h5>
        {notAvailableUsers.map(({ email, notAvailableHours }) => (
          <span>
            <span className="_mr-1">{email}</span>
            {notAvailableHours ? `(${notAvailableHours})` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export default NotAvailableEmployeesPopover;
