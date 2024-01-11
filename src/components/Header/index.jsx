import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const navigation = [
    { to: '/locales', title: 'Locales' },
    { to: '/career', title: 'Career' },
    { to: '/promo', title: 'Promo Codes' },
  ];

  return (
    <header className="container">
      <nav className="navbar navbar-expand container">
        <div className="navbar-nav">
          {navigation.map((nav) => (
            <Fragment key={nav.to + nav.title}>
              <div className="nav-item">
                <Link to={nav.to} className="nav-link">
                  {nav.title}
                </Link>
              </div>
            </Fragment>
          ))}
        </div>
      </nav>
    </header>
  );
};
