import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { isAdmin } from "../../utils";

const CLEANER_NAVIGATION = [{ to: "/order", title: "Orders" }];

const ADMIN_NAVIGATION = [
  { to: "/locales", title: "Locales" },
  { to: "/career", title: "Career" },
  { to: "/gift", title: "Gifts" },
  { to: "/promo", title: "Promo Codes" },
  { to: "/subscription", title: "Subscription" },
  { to: "/reviews", title: "Reviews" },
  { to: "/users", title: "Users" },
];

export const Header = ({ onLogOut }) => {
  const navigation = isAdmin()
    ? [...CLEANER_NAVIGATION, ...ADMIN_NAVIGATION]
    : CLEANER_NAVIGATION;

  return (
    <header className="container d-flex align-items-center">
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
      <button className="ml-auto btn btn-danger text-nowrap" onClick={onLogOut}>
        Log Out
      </button>
    </header>
  );
};
