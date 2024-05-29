import i18next from "i18next";
import enLocales from "./translations/en.json";
import plLocales from "./translations/pl.json";
import ruLocales from "./translations/ru.json";
import uaLocales from "./translations/ua.json";

export const initI18n = () => {
  const resources = {
    en: { translation: enLocales },
    pl: { translation: plLocales },
    ru: { translation: ruLocales },
    ua: { translation: uaLocales },
  };

  return (lng) => {
    i18next.init({ lng, resources });
    return { t: i18next.t, lng };
  };
};
