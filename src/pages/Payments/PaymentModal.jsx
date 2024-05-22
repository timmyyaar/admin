import React, { useContext, useEffect, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Modal from "../../components/common/Modal";
import { LocaleContext } from "../../contexts";
import { getDateWithoutTimeString } from "./index";
import { request } from "../../utils";
import PaymentTabs from "./PaymentTabs";
import { CARD_PAYMENT_METHOD, PAYMENT_METHOD_TABS } from "./constants";
import SavedCards from "./SavedCards";

function PaymentModal({
  amount,
  periodStart,
  periodEnd,
  onClose,
  clientSecret,
  paymentIntentId,
  savedCards,
  setSavedCards,
}) {
  const { t } = useContext(LocaleContext);

  const [isPayButtonEnabled, setIsPayButtonEnabled] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveForFutureUsage, setSaveForFutureUsage] = useState(false);
  const [paymentMethodTab, setPaymentMethodTab] = useState(
    savedCards.length > 0
      ? PAYMENT_METHOD_TABS.SAVED_CARDS
      : PAYMENT_METHOD_TABS.NEW_PAYMENT_METHOD
  );
  const [isCardPaymentSelected, setIsCardPaymentSelected] = useState(false);

  const [selectedCard, setSelectedCard] = useState(
    savedCards.find((card) => card.metadata.isFavourite === "true")?.id ||
      savedCards[0]?.id ||
      ""
  );

  const isNewPaymentMethodSelected =
    paymentMethodTab === PAYMENT_METHOD_TABS.NEW_PAYMENT_METHOD;

  const stripe = useStripe();
  const elements = useElements();

  const isPayButtonDisabled = selectedCard
    ? error || isPaymentLoading
    : error || !isPayButtonEnabled || isPaymentLoading;

  useEffect(() => {
    if (savedCards.length === 0 && !isNewPaymentMethodSelected) {
      setPaymentMethodTab(PAYMENT_METHOD_TABS.NEW_PAYMENT_METHOD);
    }

    //eslint-disable-next-line
  }, [savedCards.length]);

  const onPayClick = async () => {
    if (isPayButtonDisabled) {
      return;
    }

    try {
      setIsPaymentLoading(true);
      setError("");

      if (stripe && elements) {
        if (isNewPaymentMethodSelected && saveForFutureUsage) {
          await request({
            url: `/payment-intent/${paymentIntentId}/setup-future-usage`,
            method: "PATCH",
            body: { setupFutureUsage: "off_session" },
          });
        }

        const { error } = await stripe.confirmPayment({
          ...(selectedCard && { clientSecret }),
          ...(!selectedCard && { elements }),
          confirmParams: {
            return_url: `${process.env.REACT_APP_SITE_URL}/payments`,
            ...(selectedCard && { payment_method: selectedCard }),
          },
        });

        if (error) {
          setError(error.message);
        }
      }
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      errorMessage={error}
      actionButtonText={`${t("pay")} ${amount} ${t("zl")}`}
      isActionButtonDisabled={isPayButtonDisabled}
      isCancelButtonDisabled={isPaymentLoading}
      isLoading={isPaymentLoading}
      onActionButtonClick={onPayClick}
      wrapperClassName="payment-modal-wrapper"
    >
      <h6 className="_mb-4 text-center">
        {t("payment_for")} {getDateWithoutTimeString(periodStart)} -
        <span className="_ml-1">{getDateWithoutTimeString(periodEnd)}</span>
      </h6>
      {savedCards.length > 0 && (
        <PaymentTabs
          paymentMethodTab={paymentMethodTab}
          setPaymentMethodTab={setPaymentMethodTab}
          setSelectedCard={setSelectedCard}
          savedCards={savedCards}
        />
      )}
      {paymentMethodTab === PAYMENT_METHOD_TABS.NEW_PAYMENT_METHOD ? (
        <>
          <PaymentElement
            onReady={(element) => element.focus()}
            onChange={(formState) => {
              const isCardPaymentMethod =
                formState.value.type === CARD_PAYMENT_METHOD;

              setError("");
              setIsCardPaymentSelected(isCardPaymentMethod);
              setIsPayButtonEnabled(formState.complete);
            }}
          />
          {isCardPaymentSelected && (
            <div className="form-check _mt-2 save-for-future-checkbox _flex _items-center">
              <input
                id="future-usage"
                className="form-check-input _cursor-pointer save-for-future-input"
                type="checkbox"
                checked={saveForFutureUsage}
                onClick={() => setSaveForFutureUsage(!saveForFutureUsage)}
              />
              <label
                htmlFor="future-usage"
                className="form-check-label _cursor-pointer"
              >
                {t("save_this_card_for_future")}
              </label>
            </div>
          )}
        </>
      ) : (
        <SavedCards
          savedCards={savedCards}
          setSavedCards={setSavedCards}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      )}
    </Modal>
  );
}

export default PaymentModal;
