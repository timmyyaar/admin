import { createContext } from "react";

export const AppContext = createContext({ onLogOut: () => {}, userData: null });
export const LocaleContext = createContext({
  t: () => {},
  locale: "en",
});
