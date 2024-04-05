import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppContext, LocaleContext } from "./contexts";
import { Header } from "./components/Header";
import { GiftPage } from "./pages/Gift";
import { CareerPage } from "./pages/Career";
import { LocalesPage } from "./pages/Locales";
import { PromoPage } from "./pages/Promo";
import { OrderPage } from "./pages/Order";
import { ReviewsPage } from "./pages/Reviews";
import Login from "./pages/Login";
import { USER_DATA_LOCAL_STORAGE_KEY } from "./constants";
import { isAdmin, logOut, request } from "./utils";
import Users from "./pages/Users";
import EventEmitter from "./eventEmitter";
import { useLocales } from "./hooks/useLocales";
import Discounts from "./pages/Dicsounts";
import Documents from "./pages/Documents";
import Clients from "./pages/Clients";
import Schedule from "./pages/Schedule";

const LOCALE_LOCAL_STORAGE_KEY = "locale";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [locales, setLocales] = useState([]);
  const [locale, setLocale] = useState(
    localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY) || "en"
  );
  const [isLocalesLoading, setIsLocalesLoading] = useState(true);

  const { t } = useLocales(locales, locale);

  const onLocaleChange = (updatedLocale) => {
    setLocale(updatedLocale);

    localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, updatedLocale);
  };

  const getLocales = async () => {
    try {
      const localesResponse = await request({ url: "locales" });

      setLocales(localesResponse.locales);
    } finally {
      setIsLocalesLoading(false);
    }
  };

  const localStorageUserData = localStorage.getItem(
    USER_DATA_LOCAL_STORAGE_KEY
  );

  const onLogOut = () => {
    logOut();

    setIsLoggedIn(false);
  };

  useEffect(() => {
    if (localStorageUserData) {
      setIsLoggedIn(true);
    }
  }, [localStorageUserData]);

  useEffect(() => {
    EventEmitter.on("logOut", () => {
      onLogOut();
    });

    getLocales();

    return () => {
      EventEmitter.off("logOut");
    };
  }, []);

  return isLocalesLoading ? null : (
    <AppContext.Provider value={{ onLogOut }}>
      <LocaleContext.Provider value={{ t }}>
        <div className="App">
          {localStorageUserData || isLoggedIn ? (
            <BrowserRouter>
              <Header
                onLogOut={onLogOut}
                locale={locale}
                setLocale={onLocaleChange}
              />
              <main className="container app-container">
                <Routes>
                  <Route path="/" element={<div />} />
                  <Route path="/order" element={<OrderPage />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/schedule" element={<Schedule />} />
                  {isAdmin() && (
                    <>
                      <Route path="/locales" element={<LocalesPage />} />
                      <Route path="/career" element={<CareerPage />} />
                      <Route path="/gift" element={<GiftPage />} />
                      <Route path="/promo" element={<PromoPage />} />
                      <Route
                        path="/subscription"
                        element={<OrderPage subscription />}
                      />
                      <Route path="/reviews" element={<ReviewsPage />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/discounts" element={<Discounts />} />
                      <Route path="/clients" element={<Clients />} />
                    </>
                  )}
                </Routes>
              </main>
            </BrowserRouter>
          ) : (
            <Login
              setIsLoggedIn={setIsLoggedIn}
              locale={locale}
              setLocale={onLocaleChange}
            />
          )}
        </div>
      </LocaleContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
