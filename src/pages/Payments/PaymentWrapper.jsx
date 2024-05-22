import { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { LocaleContext } from "../../contexts";
import PaymentModal from "./PaymentModal";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const appearance = {
  labels: "floating",
  theme: "night",
  variables: {
    colorPrimary: "#0d6efd",
  },
};

function PaymentWrapper({
  periodStart,
  periodEnd,
  amount,
  onClose,
  clientSecret,
  paymentIntentId,
  savedCards,
  setSavedCards,
}) {
  const { locale } = useContext(LocaleContext);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
        locale: locale === "ua" ? "auto" : locale,
      }}
    >
      <PaymentModal
        amount={amount}
        periodStart={periodStart}
        periodEnd={periodEnd}
        onClose={onClose}
        clientSecret={clientSecret}
        paymentIntentId={paymentIntentId}
        savedCards={savedCards}
        setSavedCards={setSavedCards}
      />
    </Elements>
  );
}

export default PaymentWrapper;
