import React, { useContext } from "react";
import { LocaleContext } from "../../contexts";

const mainLocales = {
  en: "English",
  ru: "Русский",
  pl: "Polski",
  ua: "Україньска",
};

const localesOptions = Object.entries(mainLocales).map(([value, label]) => ({
  value,
  label,
}));

function LocaleSelect({ locale, setLocale }) {
  const { t } = useContext(LocaleContext);

  return (
    <select
      value={locale}
      className="form-select w-auto"
      onChange={({ target: { value } }) => setLocale(value)}
    >
      {localesOptions.map(({ value, label }) => (
        <option selected={locale === value} value={value} key={value}>
          {t(label)}
        </option>
      ))}
    </select>
  );
}

export default LocaleSelect;
