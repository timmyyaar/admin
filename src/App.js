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
import { ROLES } from "./constants";
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
import { Louder } from "./components/Louder";
import Payments from "./pages/Payments";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Services from "./pages/Services";

const LOCALE_LOCAL_STORAGE_KEY = "locale";

const availableLocales = ["en", "pl", "ru", "ua"];

function App() {
  const selectedLocale = localStorage.getItem(LOCALE_LOCAL_STORAGE_KEY);

  const [locale, setLocale] = useState(
    selectedLocale && availableLocales.includes(selectedLocale)
      ? selectedLocale
      : "en",
  );
  const [userData, setUserData] = useState(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);

  const isAdmin = userData?.role === ROLES.ADMIN;
  const isSupervisor = userData?.role === ROLES.SUPERVISOR;

  const { t } = useLocales(locale);

  const onLocaleChange = (updatedLocale) => {
    setLocale(updatedLocale);

    localStorage.setItem(LOCALE_LOCAL_STORAGE_KEY, updatedLocale);
  };

  const onLogOut = async () => {
    await logOut();

    setUserData(null);
  };

  useEffect(() => {
    document.body.classList.add("custom-scroll");

    return () => {
      document.body.classList.remove("custom-scroll");
    };
  }, []);

  const getUserData = async () => {
    try {
      const userDataResponse = await request({ url: "users/my-user" });

      if (!userDataResponse.error) {
        setUserData(userDataResponse);
      }
    } finally {
      setIsUserDataLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    EventEmitter.on("logOut", () => {
      onLogOut();
    });

    return () => {
      EventEmitter.off("logOut");
    };
  }, []);

  return (
    <>
      {isUserDataLoading ? (
        <Louder visible={isUserDataLoading} />
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
                      <Route path="/payments" element={<Payments />} />
                      {isSupervisor && (
                        <>
                          <Route
                            path="/orders-summary"
                            element={<OrdersSummary />}
                          />
                          <Route path="/incomes" element={<Incomes />} />
                          <Route path="/statistics" element={<Statistics />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/services" element={<Services />} />
                        </>
                      )}
                      {(isAdmin || isSupervisor) && (
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
                          <Route path="/blogs" element={<Blogs />} />
                        </>
                      )}
                    </Routes>
                  </main>
                </BrowserRouter>
              ) : (
                <Login
                  getUserData={getUserData}
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
