import React, { Fragment, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { isAdmin } from "../../utils";

import "./index.css";
import { LocaleContext } from "../../contexts";
import LocaleSelect from "../LocaleSelect/LocaleSelect";

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

export const Header = ({ onLogOut, locale, setLocale }) => {
  const { t } = useContext(LocaleContext);
  const [showMenu, setShowMenu] = useState(false);

  const navigation = isAdmin()
    ? [...CLEANER_NAVIGATION, ...ADMIN_NAVIGATION]
    : CLEANER_NAVIGATION;

  return (
    <header className="container d-flex align-items-center header-wrapper">
      <div className="mobile-only w-100">
        <button
          className="btn btn-primary"
          onClick={() => setShowMenu(!showMenu)}
        >
          {t("admin_menu")}
        </button>
        {showMenu && (
          <div className="w-100 h-100 position-fixed _left-0 _top-0 _z-10 mobile-navigation">
            <div className="_p-4 d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={() => setShowMenu(!showMenu)}
              >
                &#10006;
              </button>
            </div>
            {navigation.map((nav) => (
              <div
                className={`_p-4 mobile-navigation-item _text-center`}
                key={nav.title}
              >
                <Link
                  to={nav.to}
                  className="nav-link whitespace-nowrap"
                  onClick={() => setShowMenu(false)}
                >
                  {t(
                    `admin_${nav.title.toLowerCase().replace(" ", "_")}_header`
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mobile-none w-100">
        <nav className="navbar navbar-expand container">
          <div className="navbar-nav">
            {navigation.map((nav) => (
              <Fragment key={nav.to + nav.title}>
                <div className="nav-item">
                  <Link to={nav.to} className="nav-link whitespace-nowrap">
                    {t(
                      `admin_${nav.title
                        .toLowerCase()
                        .replace(" ", "_")}_header`
                    )}
                  </Link>
                </div>
              </Fragment>
            ))}
          </div>
        </nav>
      </div>
      <div className="ml-auto d-flex">
        <LocaleSelect locale={locale} setLocale={setLocale} />
        <button className="btn btn-danger text-nowrap _ml-3" onClick={onLogOut}>
          {t("admin_log_out_button")}
        </button>
      </div>
    </header>
  );
};
