import { initI18n } from "../locales";

export const useLocales = (locales, locale) => {
  const i18n = initI18n(locales);

  return i18n(locale);
};
