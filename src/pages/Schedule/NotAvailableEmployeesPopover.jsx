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
