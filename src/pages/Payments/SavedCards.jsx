import americanExpressIcon from "../../assets/icons/card-brands/american-express.svg";
import visaIcon from "../../assets/icons/card-brands/visa.svg";
import mastercardIcon from "../../assets/icons/card-brands/mastercard.svg";
import jcbIcon from "../../assets/icons/card-brands/jcb.svg";
import unionPayIcon from "../../assets/icons/card-brands/unionpay.svg";
import discoverIcon from "../../assets/icons/card-brands/discover.svg";
import dinersIcon from "../../assets/icons/card-brands/diners.svg";
import unknownIcon from "../../assets/icons/card-brands/unknown.svg";

import { ReactComponent as TrashIcon } from "../../assets/icons/trash.svg";
import { useState } from "react";
import Modal from "../../components/common/Modal";
import { request } from "../../utils";

const IMAGE_BY_BRAND = {
  visa: visaIcon,
  mastercard: mastercardIcon,
  amex: americanExpressIcon,
  unionpay: unionPayIcon,
  jcb: jcbIcon,
  diners: dinersIcon,
  discover: discoverIcon,
};

function SavedCards({
  savedCards,
  selectedCard,
  setSelectedCard,
  setSavedCards,
}) {
  const [removingIds, setRemovingIds] = useState([]);
  const [detachCardLoadingIds, setDetachCardLoadingIds] = useState([]);

  const onDetachCard = async (id) => {
    if (detachCardLoadingIds.includes(id)) {
      return;
    }

    try {
      setDetachCardLoadingIds((prev) => [...prev, id]);

      await request({ url: `/payment-methods/${id}/detach`, method: "PATCH" });

      setSavedCards((prev) => prev.filter((savedCard) => savedCard.id !== id));

      if (selectedCard === id) {
        setSelectedCard("");
      }
    } finally {
      setDetachCardLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="_flex _flex-col _gap-4">
      {savedCards.map(({ id, card }) => (
        <div className="_flex _items-center">
          <div
            className={`_flex _w-full _items-center saved-card _cursor-pointer font-weight-semi-bold ${
              selectedCard === id ? "selected" : ""
            }`}
            onClick={() => setSelectedCard(id)}
          >
            <img
              className="_mr-3"
              alt={card.brand}
              src={IMAGE_BY_BRAND[card.brand] || unknownIcon}
            />
            **** {card.last4}
            <span className="_ml-auto">
              {card.exp_month}/{card.exp_year}
            </span>
          </div>
          <div
            className="_p-3 _pr-0 _flex _items-center _justify-center remove-card-icon _cursor-pointer"
            onClick={() => setRemovingIds([...removingIds, id])}
          >
            <TrashIcon width="20px" height="20px" />
            {removingIds.includes(id) && (
              <Modal
                outsideClickClose
                minHeight={false}
                wrapperClassName="remove-confirmation-modal-wrapper"
                isActionButtonDanger
                actionButtonText="Detach"
                onClose={() =>
                  setRemovingIds(removingIds.filter((item) => item !== id))
                }
                onActionButtonClick={() => onDetachCard(id)}
                isLoading={detachCardLoadingIds.includes(id)}
                isActionButtonDisabled={detachCardLoadingIds.includes(id)}
              >
                <h6 className="text-center">
                  Are you sure you want to detach card?
                </h6>
              </Modal>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SavedCards;
