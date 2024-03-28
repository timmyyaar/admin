import i18next from "i18next";

const getLocales = (locales, lang) => {
  if (!locales) return {};

  return locales.reduce((acc, locale) => {
    if (locale.locale === lang) acc[locale.key] = locale.value;
    return acc;
  }, {});
};

export const initI18n = (locales) => {
  const resources = {
    en: { translation: getLocales(locales, "en") },
    pl: { translation: getLocales(locales, "pl") },
    ru: { translation: getLocales(locales, "ru") },
    uk: { translation: getLocales(locales, "uk") },
  };

  return (lng) => {
    i18next.init({ lng, resources });
    return { t: i18next.t, lng };
  };
};
