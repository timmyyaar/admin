import { useContext, useState } from "react";
import { request } from "../../utils";
import Modal from "../../components/common/Modal";
import { LocaleContext } from "../../contexts";

function FinishPaymentModal({ id, amount, onClose, setPayments }) {
  const { t } = useContext(LocaleContext);

  const [isFinishPaymentLoading, setIsFinishPaymentLoading] = useState(false);
  const [finishPaymentError, setFinishPaymentError] = useState(false);

  const onFinishPayment = async () => {
    try {
      setIsFinishPaymentLoading(true);

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

      onClose();
    } catch (error) {
      setFinishPaymentError(true);
    } finally {
      setIsFinishPaymentLoading(false);
    }
  };

  return (
    <Modal
      minHeight={false}
      onClose={onClose}
      actionButtonText="Confirm"
      onActionButtonClick={onFinishPayment}
      isLoading={isFinishPaymentLoading}
      isActionButtonDisabled={isFinishPaymentLoading}
      errorMessage={finishPaymentError ? t("unexpected_error") : ""}
    >
      <div className="font-weight-semi-bold text-center">
        {t("payment_amount_correct_confirmation")} ({amount} {t("zl")})
      </div>
    </Modal>
  );
}

export default FinishPaymentModal;
