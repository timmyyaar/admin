import React, { useContext, useState } from "react";
import { request } from "../../utils";
import {
  getPaymentColorDependsOnStatus,
  getPaymentTextDependsOnStatus,
} from "./utils";
import { PAYMENT_STATUS, ROLES } from "../../constants";
import Modal from "../../components/common/Modal";
import { AppContext, LocaleContext } from "../../contexts";

function Payment({ order, setOrders, t }) {
  const {
    userData: { role },
  } = useContext(AppContext);
  const isAdmin = role === ROLES.ADMIN;

  const { locale } = useContext(LocaleContext);
  const [paymentLink, setPaymentLink] = useState("");
  const [wasCopied, setWasCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPendingOrFailedPayment = [
    PAYMENT_STATUS.PENDING,
    PAYMENT_STATUS.FAILED,
  ].includes(order.payment_status);

  const canGeneratePaymentLink =
    order.onlinepayment && (!order.payment_intent || isPendingOrFailedPayment);

  const createOrderPaymentIntent = async () => {
    setIsLoading(true);

    const updatedOrders = await request({
      url: `order/${order.id}/payment-intent`,
      method: "PUT",
    });

    setIsLoading(false);

    setOrders((prev) =>
      prev.map((prev) => {
        const updatedOrder = updatedOrders.find((item) => item.id === prev.id);

        return updatedOrder || prev;
      })
    );

    return updatedOrders[0].payment_intent;
  };

  const generatePaymentLink = (payment_intent) => {
    return process.env.REACT_APP_MODE === "staging"
      ? `https://www.staging.takeutime.pl/${locale}/payment/${payment_intent}`
      : `https://www.takeutime.pl/payment/${payment_intent}`;
  };

  const onPaymentClick = async () => {
    setWasCopied(false);

    if (!canGeneratePaymentLink || isLoading) {
      return;
    }

    if (!order.payment_intent) {
      const payment_intent = await createOrderPaymentIntent();

      setPaymentLink(generatePaymentLink(payment_intent));
    } else if (isPendingOrFailedPayment) {
      setPaymentLink(generatePaymentLink(order.payment_intent));
    }
  };

  return (
    <>
      {paymentLink && (
        <Modal
          onClose={() => setPaymentLink("")}
          noFooter
          minHeight={false}
          outsideClickClose
        >
          <div className="_p-5">
            <div className="text-center _pb-4">
              Your payment link for {order.id} order:
            </div>
            <div className="d-flex">
              <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                {paymentLink}
              </a>
              <div
                className="_ml-2 _cursor-pointer opacity-70-on-hover"
                title={t("copy")}
                onClick={() => {
                  navigator.clipboard.writeText(paymentLink);
                  setWasCopied(true);
                  setTimeout(() => setWasCopied(false), 3000);
                }}
              >
                {wasCopied ? "✓" : "📋"}
              </div>
            </div>
          </div>
        </Modal>
      )}
      <p
        className={`card-text font-weight-semi-bold ${
          isAdmin && order.payment_status && order.onlinepayment
            ? getPaymentColorDependsOnStatus(order.payment_status)
            : ""
        } ${
          isAdmin && canGeneratePaymentLink
            ? "opacity-70-on-hover _cursor-pointer"
            : ""
        }`}
        onClick={onPaymentClick}
      >
        <span className="_mr-1">{order.onlinepayment ? "💳" : "💲"}</span>
        <span className="_mr-1">{t("admin_order_payment")}:</span>
        {order.onlinepayment
          ? `${t("admin_order_online")}`
          : `${t("admin_order_cash")}`}
        <span>
          {isAdmin &&
            order.onlinepayment &&
            order.payment_status &&
            ` (${t(getPaymentTextDependsOnStatus(order.payment_status))})`}
          {isLoading && <div className="loader" />}
        </span>
      </p>
    </>
  );
}

export default Payment;
