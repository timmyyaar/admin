import React from "react";
import reactStringReplace from "react-string-replace";

import { NUMBER_FLOAT_EMPTY_REGEX } from "../../../constants";

export const SUP_REGEXP = /<sup>([^</sup>]*)<\/sup>/g;

function MainService({ rows, setRows }) {
  const onRowPriceChange = (key, price) => {
    setRows(rows.map((row) => (row.key === key ? { ...row, price } : row)));
  };

  return (
    <div className="_grid _grid-cols-[auto] lg:_grid-cols-[max-content_auto] _gap-4 _mt-6 _items-center">
      {rows.map(({ title, key, price }) => (
        <>
          <span>
            {reactStringReplace(title, SUP_REGEXP, (match) => (
              <sup>{match}</sup>
            ))}
            :
          </span>
          <input
            className="form-control"
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
  );
}

export default MainService;
