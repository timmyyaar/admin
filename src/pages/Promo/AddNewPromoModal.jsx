import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { request } from "../../utils";
import {
  NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX,
  POSITIVE_NUMBER_EMPTY_REGEX,
} from "../../constants";

const PROMO_TYPE = {
  INFINITE: "Infinite",
  SINGLE: "Single",
  CUSTOM: "Custom",
};

function AddNewPromoModal({ onClose, promo, setPromo }) {
  const [promoType, setPromoType] = useState(PROMO_TYPE.INFINITE);
  const [code, setCode] = useState("");
  const [author, setAuthor] = useState("");
  const [sale, setSale] = useState("");
  const [isAddPromoLoading, setIsAddPromoLoading] = useState(false);
  const [addNewPromoError, setAddNewPromoError] = useState("");
  const [usagesCount, setUsagesCount] = useState("");

  const isSinglePromo = promoType === PROMO_TYPE.SINGLE;
  const isCustomCountPromo = promoType === PROMO_TYPE.CUSTOM;

  const isAddNewPromoEnabled =
    code &&
    author &&
    sale &&
    (isCustomCountPromo ? usagesCount : true) &&
    !promo.some((item) => item.code === code.trim());

  const addNewPromo = async () => {
    if (isAddNewPromoEnabled) {
      try {
        setIsAddPromoLoading(true);

        const newPromo = await request({
          url: "promo",
          method: "POST",
          body: {
            code: code.trim(),
            author,
            sale,
            count: isCustomCountPromo ? usagesCount : isSinglePromo ? 1 : null,
          },
        });

        setPromo((prev) => [newPromo, ...prev]);
        onClose();
      } catch (error) {
        setAddNewPromoError(error.message);
      } finally {
        setIsAddPromoLoading(false);
      }
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={!isAddNewPromoEnabled || isAddPromoLoading}
      isLoading={isAddPromoLoading}
      errorMessage={addNewPromoError}
      onActionButtonClick={addNewPromo}
    >
      <h5 className="mb-4 text-center">Add new promo</h5>
      <div className="mb-4">
        <div className="form-check">
          <input
            className="form-check-input _cursor-pointer"
            type="radio"
            name={PROMO_TYPE.INFINITE}
            id={PROMO_TYPE.INFINITE}
            checked={promoType === PROMO_TYPE.INFINITE}
            onChange={() => setPromoType(PROMO_TYPE.INFINITE)}
          />
          <label
            className="form-check-label _cursor-pointer"
            htmlFor={PROMO_TYPE.INFINITE}
          >
            {PROMO_TYPE.INFINITE}
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input _cursor-pointer"
            type="radio"
            name={PROMO_TYPE.SINGLE}
            id={PROMO_TYPE.SINGLE}
            checked={promoType === PROMO_TYPE.SINGLE}
            onChange={() => setPromoType(PROMO_TYPE.SINGLE)}
          />
          <label
            className="form-check-label _cursor-pointer"
            htmlFor={PROMO_TYPE.SINGLE}
          >
            {PROMO_TYPE.SINGLE}
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input _cursor-pointer"
            type="radio"
            name={PROMO_TYPE.CUSTOM}
            id={PROMO_TYPE.CUSTOM}
            checked={promoType === PROMO_TYPE.CUSTOM}
            onChange={() => setPromoType(PROMO_TYPE.CUSTOM)}
          />
          <label
            className="form-check-label _cursor-pointer"
            htmlFor={PROMO_TYPE.CUSTOM}
          >
            {PROMO_TYPE.CUSTOM}
          </label>
        </div>
      </div>
      <div className="_inline-grid _gap-4 _w-full edit-discount-wrapper align-items-center">
        <label className="_mr-2">Code:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Code:"
          value={code}
          onChange={({ target: { value } }) => setCode(value)}
        />
        <label className="_mr-2">Author:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Author:"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <label className="_mr-2">Sale:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Sale:"
          value={sale}
          onChange={({ target: { value } }) => {
            if (NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX.test(value)) {
              setSale(value);
            }
          }}
        />
        {promoType === PROMO_TYPE.CUSTOM && (
          <>
            <label className="_mr-2 white-space-nowrap">Usages count:</label>
            <input
              className="form-control"
              placeholder="Usages count:"
              value={usagesCount}
              onChange={({ target: { value } }) => {
                if (POSITIVE_NUMBER_EMPTY_REGEX.test(value)) {
                  setUsagesCount(value);
                }
              }}
            />
          </>
        )}
      </div>
    </Modal>
  );
}

export default AddNewPromoModal;
