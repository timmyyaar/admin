import { initI18n } from "../locales";

export const useLocales = (locale) => {
  const i18n = initI18n();

  return i18n(locale);
};
