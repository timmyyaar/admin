import { createContext } from "react";

export const AppContext = createContext({ onLogOut: () => {} });
export const LocaleContext = createContext({
  t: () => {},
  locale: "en",
});
