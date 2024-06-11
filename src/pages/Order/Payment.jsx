import React, { useContext, useState } from "react";
import { request } from "../../utils";
import {
  getPaymentColorDependsOnStatus,
  getPaymentTextDependsOnStatus,
} from "./utils";
import { ORDER_STATUS, PAYMENT_STATUS, ROLES } from "../../constants";
import Modal from "../../components/common/Modal";
import { AppContext, LocaleContext } from "../../contexts";

import { ReactComponent as PaymentIcon } from "../../assets/icons/payment.svg";
import { ReactComponent as CardIcon } from "../../assets/icons/card.svg";

function Payment({ order, setOrders, t }) {
  const {
    userData: { role },
  } = useContext(AppContext);
  const isAdmin = role === ROLES.ADMIN;

  const { locale } = useContext(LocaleContext);
  const [paymentLink, setPaymentLink] = useState("");
  const [wasCopied, setWasCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApprovePaymentLoading, setIsApprovePaymentLoading] = useState(false);
  const [isMarkAsPaidModalOpened, setIsMarkAsPaidModalOpened] = useState(false);
  const [isMarkAsPaidLoading, setIsMarkAsPaidLoading] = useState(false);

  const isPendingPayment =
    order.onlinepayment &&
    (!order.payment_status || order.payment_status === PAYMENT_STATUS.PENDING);
  const isPendingOrFailedPayment = [
    PAYMENT_STATUS.PENDING,
    PAYMENT_STATUS.FAILED,
  ].includes(order.payment_status);

  const canGeneratePaymentLink =
    order.onlinepayment &&
    ((!order.payment_intent && !order.payment_status) ||
      isPendingOrFailedPayment);

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
      try {
        setIsLoading(true);

        const { isSynced, updatedOrders } = await request({
          url: `order/${order.id}/sync-payment`,
          method: "PUT",
        });

        if (isSynced) {
          setPaymentLink(generatePaymentLink(order.payment_intent));
        } else {
          setOrders((prev) =>
            prev.map((prev) => {
              const updatedOrder = updatedOrders.find(
                (item) => item.id === prev.id
              );

              return updatedOrder || prev;
            })
          );
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onApprovePayment = async () => {
    if (isApprovePaymentLoading) {
      return;
    }

    try {
      setIsApprovePaymentLoading(true);

      const updatedOrders = await request({
        url: `order/${order.id}/approve-payment`,
        method: "PUT",
      });

      setOrders((prev) =>
        prev.map((prev) => {
          const updatedOrder = updatedOrders.find(
            (item) => item.id === prev.id
          );

          return updatedOrder || prev;
        })
      );
    } catch (error) {
    } finally {
      setIsApprovePaymentLoading(false);
    }
  };

  const markOrderAsPaid = async () => {
    setIsMarkAsPaidLoading(true);

    try {
      const updatedOrders = await request({
        url: `order/${order.id}/mark-as-paid`,
        method: "PUT",
      });

      setOrders((prev) =>
        prev.map((prev) => {
          const updatedOrder = updatedOrders.find(
            (item) => item.id === prev.id
          );

          return updatedOrder || prev;
        })
      );

      setIsMarkAsPaidModalOpened(false);
    } finally {
      setIsMarkAsPaidLoading(false);
    }
  };

  const isApprovePaymentVisible =
    isAdmin &&
    order.payment_status === PAYMENT_STATUS.WAITING_FOR_CONFIRMATION &&
    order.status !== ORDER_STATUS.CREATED.value;

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
      <div className="d-flex align-items-center _mb-4">
        <div
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
          {order.onlinepayment ? (
            <CardIcon width="20px" height="20px" className="_mr-2" />
          ) : (
            <PaymentIcon width="20px" height="20px" className="_mr-2" />
          )}
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
        </div>
        {isPendingPayment && isAdmin && (
          <button
            className="btn btn-sm btn-success _ml-2 whitespace-nowrap"
            onClick={() => setIsMarkAsPaidModalOpened(true)}
          >
            {t("mark_as_paid")}
          </button>
        )}
        {isMarkAsPaidModalOpened && (
          <Modal
            onClose={() => setIsMarkAsPaidModalOpened(false)}
            minHeight={false}
            actionButtonText={t("confirm")}
            onActionButtonClick={markOrderAsPaid}
            isActionButtonDisabled={isMarkAsPaidLoading}
            isLoading={isMarkAsPaidLoading}
          >
            <h5 className="text-center">
              {t("order_mark_as_paid_confirmation")} ({order.id})?
            </h5>
          </Modal>
        )}
        {isApprovePaymentVisible && (
          <button
            className={`btn btn-sm btn-success _ml-2 whitespace-nowrap ${
              isApprovePaymentLoading ? "loading" : ""
            }`}
            onClick={onApprovePayment}
            disabled={isApprovePaymentLoading}
          >
            {t("approve")}
          </button>
        )}
      </div>
    </>
  );
}

export default Payment;
