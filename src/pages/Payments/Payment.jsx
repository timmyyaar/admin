import React, { useContext, useState } from "react";
import { capitalizeFirstLetter, request } from "../../utils";
import AggregatorId from "../Order/AggregatorId";
import { AppContext, LocaleContext } from "../../contexts";
import FinishPaymentModal from "./FinishPaymentModal";
import PayButton from "./PayButton";
import { ROLES } from "../../constants";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { ReactComponent as PriceIcon } from "../../assets/icons/price.svg";
import { ReactComponent as RewardIcon } from "../../assets/icons/reward.svg";
import { ReactComponent as PaymentIcon } from "../../assets/icons/payment.svg";
import { ReactComponent as GeoIcon } from "../../assets/icons/geo.svg";
import { ReactComponent as CardIcon } from "../../assets/icons/card.svg";
import AmountToPay from "./AmountToPay";

function Payment({
  payment: {
    id,
    order_ids,
    period_start,
    period_end,
    amount,
    orders,
    is_paid,
    is_failed,
    payment_intent,
    client_secret,
    employee_name,
  },
  setPayments,
  savedCards,
  setSavedCards,
}) {
  const { t } = useContext(LocaleContext);
  const {
    userData: { role },
  } = useContext(AppContext);
  const isAdmin = [ROLES.ADMIN, ROLES.SUPERVISOR].includes(role);

  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  const [isPaymentExpandLoading, setIsPaymentExpandLoading] = useState(false);
  const [isUpdateAmountLoading, setIsUpdateAmountLoading] = useState(false);
  const [isFinishPaymentModalOpened, setIsFinishPaymentModalOpened] =
    useState(false);

  const toggleCollapsePayment = async ({ id, order_ids }) => {
    if (isPaymentExpandLoading) {
      return;
    }

    if (!isPaymentExpanded && !orders) {
      try {
        setIsPaymentExpandLoading(true);

        const ordersResponse = await request({
          url: `order/client-order?ids=${order_ids}`,
        });

        setPayments((prev) =>
          prev.map((payment) =>
            payment.id === id ? { ...payment, orders: ordersResponse } : payment
          )
        );
      } finally {
        setIsPaymentExpandLoading(false);
      }
    }

    setIsPaymentExpanded(!isPaymentExpanded);
  };

  const onConfirmPayoutClick = (event) => {
    event.stopPropagation();

    if (amount <= 0) {
      setIsFinishPaymentModalOpened(true);
    }
  };

  const updateAmount = (updatedAmount) =>
    setPayments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: updatedAmount } : item
      )
    );

  return (
    <>
      {isFinishPaymentModalOpened && (
        <FinishPaymentModal
          onClose={() => setIsFinishPaymentModalOpened(false)}
          id={id}
          amount={amount}
          setPayments={setPayments}
        />
      )}
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button
            className={`accordion-button ${
              isPaymentExpanded ? "" : "collapsed"
            }`}
            type="button"
            onClick={() => toggleCollapsePayment({ id, order_ids })}
          >
            <div className="_flex _flex-col _gap-4">
              {isAdmin && (
                <div className="font-weight-semi-bold">
                  {t("Employee")}: {employee_name}
                </div>
              )}
              <div className="accordion-button-content">
                {isAdmin ? (
                  <>
                    {is_paid ? (
                      <span className="badge bg-success _mr-2">
                        {amount <= 0
                          ? t("сonfirmed_payment")
                          : t("paid_payment")}
                      </span>
                    ) : is_failed ? (
                      <span className="badge bg-danger _mr-2">
                        {t("failed_payment")}
                      </span>
                    ) : (
                      <span className="badge bg-warning _mr-2">
                        {t("pending_payment")}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {!is_paid ? (
                      amount <= 0 ? (
                        <div
                          className="pay-button btn btn-primary font-weight-semi-bold btn-sm _mr-3"
                          onClick={onConfirmPayoutClick}
                        >
                          {t("confirm")}
                        </div>
                      ) : (
                        <PayButton
                          id={id}
                          amount={amount}
                          periodStart={period_start}
                          periodEnd={period_end}
                          isFailed={is_failed}
                          paymentIntentId={payment_intent}
                          clientSecret={client_secret}
                          setPayments={setPayments}
                          savedCards={savedCards}
                          setSavedCards={setSavedCards}
                        />
                      )
                    ) : (
                      <span className="badge bg-success _mr-2">
                        {amount <= 0
                          ? t("сonfirmed_payment")
                          : t("paid_payment")}
                      </span>
                    )}
                  </>
                )}
                <AmountToPay
                  id={id}
                  amount={amount}
                  updateAmount={updateAmount}
                  t={t}
                  is_paid={is_paid}
                  isUpdateAmountLoading={isUpdateAmountLoading}
                  setIsUpdateAmountLoading={setIsUpdateAmountLoading}
                />
                <span>
                  {capitalizeFirstLetter(t("period"))}: {period_start} -{" "}
                  {period_end}
                </span>
                {(isPaymentExpandLoading || isUpdateAmountLoading) && (
                  <div className="ml-auto loader" />
                )}
              </div>
            </div>
          </button>
        </h2>
        <div
          id="collapseOne"
          className={`accordion-collapse collapse ${
            isPaymentExpanded ? "show" : ""
          }`}
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            {orders?.length > 0 ? (
              orders.map((order) => (
                <div className="card _mb-3" key={order.id}>
                  <div className="card-header order-header _gap-4 d-flex justify-content-between align-items-center">
                    <AggregatorId order={order} />
                  </div>
                  <div className="card-body">
                    <p className="card-text _flex _items-center">
                      <CalendarIcon width="20" height="20" className="_mr-2" />
                      {order.date}
                    </p>
                    <p className="card-text _flex _items-center">
                      <GeoIcon width="20" height="20" className="_mr-2" />
                      {order.address
                        .replace("Street", t("admin_order_street"))
                        .replace("House", t("admin_order_house"))
                        .replace(
                          "Private house",
                          t("admin_order_private_house")
                        )
                        .replace("Apartment", t("admin_order_apartment"))
                        .replace("Postcode", t("admin_order_postcode"))
                        .replace("Entrance", t("admin_order_entrance"))
                        .replace("Door phone", t("admin_order_door_phone"))}
                    </p>
                    <p className="card-text _flex _items-center">
                      <PriceIcon width="20" height="20" className="_mr-2" />
                      {t("admin_order_price")}: {order.price} zl
                    </p>
                    <p className="card-text _flex _items-center">
                      <RewardIcon width="20" height="20" className="_mr-2" />
                      {t("admin_order_your_reward")}:
                      <span className="_ml-1">
                        {order.reward || order.reward_original} zl
                      </span>
                    </p>
                    <p className="card-text _flex _items-center">
                      <span className="_mr-2">
                        {order.onlinepayment ? (
                          <CardIcon width="20" height="20" />
                        ) : (
                          <PaymentIcon width="20" height="20" />
                        )}
                      </span>
                      <span className="_mr-2">{t("admin_order_payment")}:</span>
                      {order.onlinepayment
                        ? `${t("admin_order_online")}`
                        : `${t("admin_order_cash")}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div>{t("no_orders_were_done_for_this_period")}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
