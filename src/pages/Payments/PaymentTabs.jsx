import React from "react";
import { PAYMENT_METHOD_TABS } from "./constants";

function PaymentTabs({
  paymentMethodTab,
  setPaymentMethodTab,
  setSelectedCard,
  savedCards,
}) {
  return (
    <ul className="nav nav-pills nav-fill _mb-5">
      <a
        className={`nav-link nav-link-payment _cursor-pointer ${
          paymentMethodTab === PAYMENT_METHOD_TABS.SAVED_CARDS ? "active" : ""
        }`}
        onClick={() => {
          setPaymentMethodTab(PAYMENT_METHOD_TABS.SAVED_CARDS);
          setSelectedCard(savedCards[0].id);
        }}
      >
        {PAYMENT_METHOD_TABS.SAVED_CARDS}
      </a>
      <a
        className={`nav-link nav-link-payment _cursor-pointer ${
          paymentMethodTab === PAYMENT_METHOD_TABS.NEW_PAYMENT_METHOD
            ? "active"
            : ""
        }`}
        onClick={() => {
          setPaymentMethodTab(PAYMENT_METHOD_TABS.NEW_PAYMENT_METHOD);
          setSelectedCard("");
        }}
      >
        {PAYMENT_METHOD_TABS.NEW_PAYMENT_METHOD}
      </a>
    </ul>
  );
}

export default PaymentTabs;
