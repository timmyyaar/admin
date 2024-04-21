import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX } from "../../constants";
import { request } from "../../utils";

function ExtraExpensesPopover({ order, onClose, setOrders }) {
  const [extraExpenses, setExtraExpenses] = useState(order.extra_expenses);
  const [isExtraExpensesLoading, setIsExtraExpensesLoading] = useState(false);

  const updateExtraExposes = async (e) => {
    e.preventDefault();

    try {
      setIsExtraExpensesLoading(true);

      const updatedOrder = await request({
        url: `order/extra-expenses/${order.id}`,
        method: "PATCH",
        body: { extraExpenses: extraExpenses || null },
      });

      setOrders((prev) =>
        prev.map((prevOrder) =>
          prevOrder.id === order.id ? updatedOrder : prevOrder
        )
      );
      onClose();
    } finally {
      setIsExtraExpensesLoading(false);
    }
  };

  const ref = useRef();
  useClickOutside(ref, onClose);

  return (
    <div className="extra-expenses-popover width-max-content" ref={ref}>
      <form className="input-group" onSubmit={updateExtraExposes}>
        <input
          type="text"
          className="form-control extra-expenses-input"
          autoFocus
          value={extraExpenses}
          onChange={({ target: { value } }) => {
            if (NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX.test(value)) {
              setExtraExpenses(value);
            }
          }}
        />
        <div className="input-group-append">
          <button
            className={`btn btn-secondary extra-expenses-button ${
              isExtraExpensesLoading ? "loading" : ""
            }`}
            disabled={isExtraExpensesLoading}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExtraExpensesPopover;
