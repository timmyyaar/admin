import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppContext } from "./contexts";
import { Header } from "./components/Header";
import { GiftPage } from "./pages/Gift";
import { CareerPage } from "./pages/Career";
import { LocalesPage } from "./pages/Locales";
import { PromoPage } from "./pages/Promo";
import { OrderPage } from "./pages/Order";
import { ReviewsPage } from "./pages/Reviews";
import Login from "./pages/Login";
import { USER_DATA_LOCAL_STORAGE_KEY } from "./constants";
import { isAdmin, logOut } from "./utils";
import Users from "./pages/Users";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <AppContext.Provider value={{ onLogOut }}>
      <div className="App">
        {localStorageUserData || isLoggedIn ? (
          <BrowserRouter>
            <Header onLogOut={onLogOut} />
            <main className="container">
              <Routes>
                <Route path="/" element={<div />} />
                <Route path="/order" element={<OrderPage />} />
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
                  </>
                )}
              </Routes>
            </main>
          </BrowserRouter>
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;
