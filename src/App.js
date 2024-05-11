import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { AppContext, LocaleContext } from "./contexts";
import { Header } from "./components/Header";
import { GiftPage } from "./pages/Gift";
import { CareerPage } from "./pages/Career";
import { LocalesPage } from "./pages/Locales";
import { PromoPage } from "./pages/Promo";
import { OrderPage } from "./pages/Order";
import { ReviewsPage } from "./pages/Reviews";
import Login from "./pages/Login";
import { ROLES, USER_DATA_LOCAL_STORAGE_KEY } from "./constants";
import { logOut, request } from "./utils";
import Users from "./pages/Users";
import EventEmitter from "./eventEmitter";
import { useLocales } from "./hooks/useLocales";
import Discounts from "./pages/Dicsounts";
import Documents from "./pages/Documents";
import Clients from "./pages/Clients";
import Schedule from "./pages/Schedule";
import Blogs from "./pages/Blogs";
import OrdersSummary from "./pages/OrdersSummary";
import Incomes from "./pages/Incomes";
import Prices from "./pages/Prices";
import { Louder } from "./components/Louder";

const LOCALE_LOCAL_STORAGE_KEY = "locale";

const availableLocales = ["en", "pl", "ru", "ua"];

function App() {
  const selectedLocale = localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [locales, setLocales] = useState([]);
  const [locale, setLocale] = useState(
    selectedLocale && availableLocales.includes(selectedLocale)
      ? selectedLocale
      : "en"
  );
  const [userData, setUserData] = useState(null);
  const [isLocalesLoading, setIsLocalesLoading] = useState(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState(false);

  const isAdmin = userData?.role === ROLES.ADMIN;

  const { t } = useLocales(locales, locale);

  const onLocaleChange = (updatedLocale) => {
    setLocale(updatedLocale);

    localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, updatedLocale);
  };

  const getLocales = async () => {
    try {
      const localesResponse = await request({
        url: "locales",
      });

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
    setUserData(null);

    setIsLoggedIn(false);
  };

  useEffect(() => {
    if (localStorageUserData) {
      setIsLoggedIn(true);
    }
  }, [localStorageUserData]);

  const getUserData = async () => {
    try {
      setIsUserDataLoading(true);

      const userDataResponse = await request({ url: "users/my-user" });

      setUserData(userDataResponse);
    } finally {
      setIsUserDataLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUserData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    EventEmitter.on("logOut", () => {
      onLogOut();
    });

    getLocales();

    return () => {
      EventEmitter.off("logOut");
    };
  }, []);

  return (
    <>
      {isLocalesLoading || isUserDataLoading ? (
        <Louder visible={isLocalesLoading || isUserDataLoading} />
      ) : (
        <AppContext.Provider value={{ onLogOut, userData }}>
          <LocaleContext.Provider value={{ t, locale }}>
            <div className="App">
              {userData ? (
                <BrowserRouter>
                  <Header
                    onLogOut={onLogOut}
                    locale={locale}
                    setLocale={onLocaleChange}
                  />
                  <main className="container app-container">
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to="/order" replace />}
                      />
                      <Route path="/order" element={<OrderPage />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/schedule" element={<Schedule />} />
                      {isAdmin && (
                        <>
                          <Route path="/locales" element={<LocalesPage />} />
                          <Route
                            path="/orders-summary"
                            element={<OrdersSummary />}
                          />
                          <Route path="/incomes" element={<Incomes />} />
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
                          <Route path="/blogs" element={<Blogs />} />
                          <Route path="/prices" element={<Prices />} />}
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
      )}
    </>
  );
}

export default App;
