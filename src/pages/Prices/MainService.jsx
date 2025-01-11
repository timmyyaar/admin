import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, request } from "../../utils";
import reactStringReplace from "react-string-replace";

import "./style.scss";
import { NUMBER_FLOAT_EMPTY_REGEX } from "../../constants";

export const SUP_REGEXP = /<sup>([^</sup>]*)<\/sup>/g;

function MainService({ servicePrices, getPrices, t }) {
  const [rows, setRows] = useState(servicePrices);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const isUpdateDisabled =
    rows.every(({ price }, index) => servicePrices[index]?.price === price) ||
    rows.some(({ price }) => !String(price)) ||
    rows.some(({ price }) => String(price).endsWith("."));

  const onRowPriceChange = (key, price) => {
    setRows(rows.map((row) => (row.key === key ? { ...row, price } : row)));
  };

  useEffect(() => {
    setRows(servicePrices);
  }, [servicePrices]);

  const updatePrices = async () => {
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
          prices: rows.map(({ key, price }) => ({ key, price: +price })),
        },
      });
      await getPrices();
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return (
    <div>
      <div className="_grid services-wrapper _gap-4 mt-4 _pb-4 _items-center">
        {rows.map(({ title, key, price }) => (
          <>
            <span>
              {reactStringReplace(title, SUP_REGEXP, (match) => (
                <sup>{match}</sup>
              ))}
              :
            </span>
            <input
              className="form-control price-input"
              value={price}
              onChange={({ target: { value } }) => {
                if (NUMBER_FLOAT_EMPTY_REGEX.test(value)) {
                  onRowPriceChange(key, value);
                }
              }}
            />
          </>
        ))}
      </div>
      {updateError && <div className="text-danger">{updateError}</div>}
      <button
        className={`btn btn-primary _mt-4 ${isUpdateLoading ? "loading" : ""}`}
        onClick={updatePrices}
        disabled={isUpdateLoading || isUpdateDisabled}
      >
        {capitalizeFirstLetter(t("update"))}
      </button>
    </div>
  );
}

export default MainService;
