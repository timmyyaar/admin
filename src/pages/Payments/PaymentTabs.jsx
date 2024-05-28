import React, { useContext } from "react";
import { PAYMENT_METHOD_TABS } from "./constants";
import { LocaleContext } from "../../contexts";

function PaymentTabs({
  paymentMethodTab,
  setPaymentMethodTab,
  setSelectedCard,
  savedCards,
}) {
  const { t } = useContext(LocaleContext);

  return (
    <ul className="nav nav-pills nav-fill _mb-5">
      <li
        className={`nav-link nav-link-payment _cursor-pointer ${
          paymentMethodTab === PAYMENT_METHOD_TABS.SAVED_CARDS ? "active" : ""
        }`}
        onClick={() => {
          setPaymentMethodTab(PAYMENT_METHOD_TABS.SAVED_CARDS);
          const favouriteCard = savedCards.find(
            (card) => card.metadata.isFavourite === "true"
          );

          setSelectedCard(favouriteCard?.id || savedCards[0].id);
        }}
      >
        {t("saved_cards")}
      </li>
      <li
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
        {t("new_payment_method")}
      </li>
    </ul>
  );
}

export default PaymentTabs;
