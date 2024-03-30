import React, { Fragment, useEffect, useState } from "react";
import "./Locales.css";

import { Louder } from "../../components/Louder";
import AddOrEditLocaleModal from "./AddOrEditLocaleModal";
import LocalesList from "./LocalesList";
import {request} from "../../utils";

export const LocalesPage = () => {
  const availableLocales = ["en", "pl", "ru", "uk"];
  const [locale, setLocale] = useState(() => availableLocales[0]);
  const [filter, setFilter] = useState("");
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddNewLocaleModalOpened, setIsAddNewLocaleModalOpened] =
    useState(false);

  const getFilteredLocalesBySelectedLocale = () => {
    return locales.filter((localeFromLocales) => {
      const filterByLocale = localeFromLocales.locale === locale;
      const filterByKey = localeFromLocales.key
        .toLowerCase()
        .includes(filter.toLowerCase());
      const filterByValue = String(localeFromLocales.value)
        .toLowerCase()
        .includes(filter.toLowerCase());

      return filterByLocale && (filterByKey || filterByValue);
    });
  };

  const getLocales = async() => {
    try {
      setLoading(true)

      const localesResponse = await request({url: 'locales'})

      setLocales(localesResponse.locales)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLocales()
  }, [])

  return (
    <div className="locales-page">
      <Louder visible={loading} />
      <div className="_flex _gap-4">
        {availableLocales.map((localeFromAvailable) => {
          const bgColor =
            localeFromAvailable === locale ? "btn-primary" : "btn-secondary";
          return (
            <Fragment key={localeFromAvailable}>
              <div
                type="button"
                className={`btn ${bgColor}`}
                onClick={() => setLocale(localeFromAvailable)}
              >
                {localeFromAvailable.toUpperCase()}
              </div>
            </Fragment>
          );
        })}
        <div
          type="button"
          className="btn btn-secondary"
          onClick={() => setFilter("")}
        >
          Reset filter
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddNewLocaleModalOpened(true)}
        >
          Add locale
        </button>
        {isAddNewLocaleModalOpened && (
          <AddOrEditLocaleModal
            onClose={() => setIsAddNewLocaleModalOpened(false)}
            setLocales={setLocales}
          />
        )}
      </div>
      <div className="_mt-8 h-100 d-flex flex-column">
        <input
          type="text"
          className="form-control _mb-8"
          placeholder="Filter by key or value"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <LocalesList
          locales={getFilteredLocalesBySelectedLocale()}
          allLocales={locales}
          setLocales={setLocales}
        />
      </div>
    </div>
  );
};
