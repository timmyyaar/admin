import React, { useState } from "react";

import "./style.css";
import { request } from "../../../utils";
import AddOrEditLocaleModal from "../AddOrEditLocaleModal";

export const InputsForm = (props) => {
  const {
    locales,
    allLocales,
    setLocales,
    index,
    style,
  } = props;
  const [deletingLocaleIds, setDeletingLocaleIds] = useState([]);
  const [isEditOpened, setIsEditOpened] = useState(false);

  const locale = locales[index];

  const onDeleteLocale = async () => {
    try {
      setDeletingLocaleIds((prev) => [...prev, locale.key]);

      await request({
        url: "locales",
        method: "DELETE",
        body: { key: locale.key },
      });

      setLocales((prev) => prev.filter((item) => item.key !== locale.key));
    } catch (error) {
    } finally {
      setDeletingLocaleIds((prev) =>
        prev.filter((item) => item !== locale.key)
      );
    }
  };

  return (
    <div className="inputs-form-component input-group" style={style}>
      <span className="input-group-text">Key</span>
      <input type="text" className="form-control" value={locale.key} disabled />
      <button
        className="input-group-text btn btn-warning"
        onClick={() => setIsEditOpened(true)}
      >
        Value
      </button>
      <input
        type="text"
        className="form-control"
        value={locale.value}
        disabled
      />
      <button
        className={`btn btn-danger ${
          deletingLocaleIds.includes(locale.key) ? "loading" : ""
        }`}
        disabled={deletingLocaleIds.includes(locale.key)}
        onClick={onDeleteLocale}
      >
        Delete
      </button>
      {isEditOpened && (
        <AddOrEditLocaleModal
          locales={allLocales.filter((item) => item.key === locale.key)}
          setLocales={setLocales}
          onClose={() => setIsEditOpened(false)}
        />
      )}
    </div>
  );
};
