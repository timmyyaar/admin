import React, { useContext, useState } from "react";
import PaymentWrapper from "./PaymentWrapper";
import { request } from "../../utils";
import { LocaleContext } from "../../contexts";

const SUCCEEDED_PAYMENT_INTENT_STATUS = "succeeded";

function PayButton({
  id,
  amount,
  periodStart,
  periodEnd,
  isFailed,
  paymentIntentId,
  clientSecret,
  setPayments,
  savedCards,
  setSavedCards,
}) {
  const { t } = useContext(LocaleContext);

  const [isPaymentModalOpened, setIsPaymentModalOpened] = useState(false);
  const [isCheckStatusLoading, setIsCheckStatusLoading] = useState(false);

  const checkPaymentIntentStatus = async (event) => {
    event.stopPropagation();

    if (isCheckStatusLoading) {
      return;
    }

    try {
      setIsCheckStatusLoading(true);

      const paymentIntent = await request({
        url: `payment-intent/${paymentIntentId}`,
      });

      if (paymentIntent.status === SUCCEEDED_PAYMENT_INTENT_STATUS) {
        const updatedPayment = await request({
          url: `employee-payments/${id}/finish`,
          method: "PATCH",
        });

        setPayments((prev) =>
          prev.map((payment) =>
            payment.id === id
              ? { ...payment, is_paid: updatedPayment.is_paid }
              : payment
          )
        );
      } else {
        setIsPaymentModalOpened(true);
      }
    } finally {
      setIsCheckStatusLoading(false);
    }
  };

  return (
    <>
      <div
        className={`pay-button btn btn-primary font-weight-semi-bold btn-sm _mr-3 ${
          isCheckStatusLoading ? "loading disabled-button-primary" : ""
        }`}
        onClick={checkPaymentIntentStatus}
      >
        {t("pay_or_check")}
        {isFailed && (
          <span className="text-warning _ml-1">(Payment error occurred)</span>
        )}
      </div>
      {clientSecret && isPaymentModalOpened && Boolean(paymentIntentId) && (
        <PaymentWrapper
          clientSecret={clientSecret}
          onClose={() => setIsPaymentModalOpened(false)}
          amount={amount}
          periodStart={periodStart}
          periodEnd={periodEnd}
          paymentIntentId={paymentIntentId}
          savedCards={savedCards}
          setSavedCards={setSavedCards}
        />
      )}
    </>
  );
}

export default PayButton;
