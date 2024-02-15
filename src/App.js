import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Header } from './components/Header';
import { GiftPage } from './pages/Gift';
import { CareerPage } from './pages/Career';
import { LocalesPage } from './pages/Locales';
import { PromoPage } from './pages/Promo';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="/locales" element={<LocalesPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/gift" element={<GiftPage />} />
            <Route path="/promo" element={<PromoPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
