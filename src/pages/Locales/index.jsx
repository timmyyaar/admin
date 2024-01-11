import React, { Fragment, useEffect, useState } from 'react';

import { Louder } from '../../components/Louder';

import { getLocales } from './actions';
import { InputsForm } from './InputsForm';

export const LocalesPage = () => {
  const availableLocales = ['en', 'pl', 'ru', 'uk'];
  const [locale, setLocale] = useState(() => availableLocales[0]);
  const [filter, setFilter] = useState('');
  const [locales, setLocales] = useState([]);
  const [newLocales, setNewLocales] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleForceUpdate = () => setForceUpdate((fU) => !fU);

  const getFilteredLocalesBySelectedLocale = () => {
    return locales.filter((localeFromLocales) => {
      const filterByLocale = localeFromLocales.locale === locale;
      const filterByKey = localeFromLocales.key.toLowerCase().includes(filter.toLowerCase())
      const filterByValue = String(localeFromLocales.value).toLowerCase().includes(filter.toLowerCase());

      return filterByLocale && (filterByKey || filterByValue);
    });
  }

  const addNewLocale = () => {
    setNewLocales((newLocalesList) => {
      const newLocale = { key: '', value: '', locale };
      return [...newLocalesList, newLocale];
    });
  };

  useEffect(() => {
    setLoading(true);
    setNewLocales((nL) => nL.filter((loc) => loc.key || loc.value));
    getLocales().then((locales) => {
      setLocales(locales);
      setLoading(false);
    });
  }, [forceUpdate]);

  return (
    <div className="locales-page">
      <Louder visible={loading} />
      <div className='_flex _gap-4'>
        {availableLocales.map((localeFromAvailable) => {
          const bgColor = localeFromAvailable === locale ? 'btn-primary' : 'btn-secondary';
          return (
            <Fragment key={localeFromAvailable}>
              <div type="button" className={`btn ${bgColor}`} onClick={() => setLocale(localeFromAvailable)}>
                {localeFromAvailable.toUpperCase()}
              </div>
            </Fragment>
          )
        })}
        <div type="button" className="btn btn-secondary" onClick={() => setFilter('')}>
          Reset filter
        </div>
      </div>
      <div className="_mt-8">
        <input
          type="text" className="form-control _mb-8" placeholder="Filter by key or value"
          value={filter} onChange={(e) => setFilter(e.target.value)}
        />
        {getFilteredLocalesBySelectedLocale().map((loc, i) => (
          <Fragment key={loc.key + loc.value + i}>
            <InputsForm locale={loc} setLoading={setLoading} setUpdate={toggleForceUpdate} />
          </Fragment>
        ))}
      </div>
      {newLocales.length ? <hr /> : null}
      {newLocales.map((loc, i) => (
        <Fragment key={loc.key + loc.value + 'new' + i}>
          <InputsForm locale={loc} setLoading={setLoading} setUpdate={toggleForceUpdate} newLocale />
        </Fragment>
      ))}
      <div className="btn btn-success" onClick={addNewLocale}>
        Add Locale
      </div>
    </div>
  );
};
