import React, { useContext, useState } from "react";
import { AppContext } from "../../contexts";
import { NUMBER_FLOAT_EMPTY_REGEX, ROLES } from "../../constants";
import { request } from "../../utils";

function AmountToPay({
  id,
  amount,
  updateAmount,
  is_paid,
  t,
  isUpdateAmountLoading,
  setIsUpdateAmountLoading,
}) {
  const {
    userData: { role },
  } = useContext(AppContext);
  const isAdmin = role === ROLES.ADMIN;

  const [isAmountUpdating, setIsAmountUpdating] = useState(false);
  const [updatingAmount, setUpdatingAmount] = useState("");

  const isInitialAmountPositive = amount > 0;

  const onAmountClick = (event) => {
    if (isUpdateAmountLoading) {
      return;
    }

    if (isAdmin && !is_paid) {
      event.stopPropagation();
      setIsAmountUpdating(true);
      setUpdatingAmount(Math.abs(amount).toString());
    }
  };

  const onAmountChange = ({ target: { value } }) => {
    if (isUpdateAmountLoading) {
      return;
    }

    if (NUMBER_FLOAT_EMPTY_REGEX.test(value)) {
      setUpdatingAmount(value);
    }
  };

  const onAmountUpdate = async () => {
    if (isUpdateAmountLoading) {
      return;
    }

    if (!updatingAmount || updatingAmount === Math.abs(amount).toString()) {
      setIsAmountUpdating(false);
    } else {
      setIsUpdateAmountLoading(true);

      try {
        const numericUpdatedAmount = +updatingAmount;
        const amountPayload =
          amount <= 0 ? -numericUpdatedAmount : numericUpdatedAmount;

        await request({
          url: `employee-payments/${id}/update-amount`,
          method: "PATCH",
          body: {
            amount: amountPayload,
          },
        });

        updateAmount(amountPayload);
      } finally {
        setIsUpdateAmountLoading(false);
      }
    }

    setIsAmountUpdating(false);
  };

  return (
    <div className="_mr-2 _flex _items-end">
      {t("amount_to_pay")}:
      <span
        className={`amount font-weight-bold ${
          isInitialAmountPositive ? "text-danger" : "text-success"
        } ${isAdmin && !is_paid ? "opacity-70-on-hover" : ""}`}
      >
        {isAmountUpdating ? (
          <input
            onBlur={onAmountUpdate}
            onFocus={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => event.stopPropagation()}
            autoFocus
            className={`transparent-input _ml-1 amount-input ${
              isInitialAmountPositive ? "text-danger" : "text-success"
            }`}
            style={{
              width: updatingAmount.includes(".")
                ? `calc(${updatingAmount.toString().length}ch - 5px)`
                : `${updatingAmount.toString().length}ch`,
            }}
            value={updatingAmount}
            onChange={onAmountChange}
            onKeyPress={async (event) => {
              if (event.key === "Enter") {
                await onAmountUpdate();
              }
            }}
          />
        ) : (
          <span className="_ml-1" onClick={onAmountClick}>
            {Math.abs(amount)}
          </span>
        )}
        <span onClick={onAmountClick}>{t("zl")}</span>
      </span>
      ,
    </div>
  );
}

export default AmountToPay;
