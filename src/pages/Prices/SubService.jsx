import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, request } from "../../utils";
import { NUMBER_FLOAT_EMPTY_REGEX } from "../../constants";

function SubService({ subService, getPrices, t }) {
  const [subServicePrice, setSubServicePrice] = useState(subService.price);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const isUpdateDisabled =
    subServicePrice === subService.price ||
    !String(subServicePrice) ||
    String(subServicePrice).endsWith(".");

  const updatePrice = async () => {
    if (isUpdateDisabled) {
      return;
    }

    try {
      setUpdateError("");
      setIsUpdateLoading(true);

      await request({
        url: "prices",
        method: "PUT",
        body: {
          prices: [{ key: subService.key, price: +subServicePrice }],
        },
      });
      await getPrices();
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  useEffect(() => {
    setSubServicePrice(subService.price);
  }, [subService]);

  return (
    <>
      <div className="_grid services-wrapper _gap-4 mt-4 _pb-4 _items-center">
        <span className="white-space-nowrap _mr-2">
          {subService.title} {t("price")}:
        </span>
        <input
          className="form-control price-input"
          value={subServicePrice}
          onChange={({ target: { value } }) => {
            if (NUMBER_FLOAT_EMPTY_REGEX.test(value)) {
              setSubServicePrice(value);
            }
          }}
        />
      </div>
      {updateError && <div className="text-danger">{updateError}</div>}
      <button
        className={`btn btn-primary _mt-4 ${isUpdateLoading ? "loading" : ""}`}
        onClick={updatePrice}
        disabled={isUpdateLoading || isUpdateDisabled}
      >
        {capitalizeFirstLetter(t("update"))}
      </button>
    </>
  );
}

export default SubService;
