import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { isAdmin, isCleaner, isDryCleaner, request } from "../../utils";

import "./index.scss";
import { LocaleContext } from "../../contexts";
import LocaleSelect from "../LocaleSelect/LocaleSelect";
import useClickOutside from "../../hooks/useClickOutside";

const CLEANER_NAVIGATION = [
  { to: "/order", title: "Orders" },
  { to: "/documents", title: "Documents" },
  { to: "/schedule", title: "Schedule" },
];

const ADMIN_NAVIGATION = [
  { to: "/locales", title: "Locales" },
  { to: "/prices", title: "Prices" },
  { to: "/orders-summary", title: "Orders summary" },
  { to: "/incomes", title: "Incomes" },
  { to: "/career", title: "Career" },
  { to: "/gift", title: "Gifts" },
  { to: "/promo", title: "Promo Codes" },
  { to: "/subscription", title: "Subscription" },
  { to: "/reviews", title: "Reviews" },
  { to: "/users", title: "Users" },
  { to: "/discounts", title: "Discounts" },
  { to: "/clients", title: "Clients" },
  { to: "/blogs", title: "Blogs" },
];

export const Header = ({ onLogOut, locale, setLocale }) => {
  const { t } = useContext(LocaleContext);
  const [showMenu, setShowMenu] = useState(false);
  const [myUser, setMyUser] = useState(null);

  const { pathname } = useLocation();

  const getMyUser = async () => {
    const myUserResponse = await request({ url: "users/my-user" });

    setMyUser(myUserResponse);
  };

  useEffect(() => {
    if (isCleaner() || isDryCleaner()) {
      getMyUser();
    }
  }, []);

  const navigation = isAdmin()
    ? [...CLEANER_NAVIGATION, ...ADMIN_NAVIGATION]
    : CLEANER_NAVIGATION;

  const menuRef = useRef();
  useClickOutside(menuRef, () => setShowMenu(false));

  return (
    <header className="container d-flex align-items-center header-wrapper border-bottom">
      <button
        className="btn btn-primary _mr-3"
        onClick={() => setShowMenu(!showMenu)}
      >
        {t("admin_menu")}
      </button>
      <div className="w-100">
        <div
          ref={menuRef}
          className={`h-100 position-fixed _left-0 _top-0 _z-10 navigation overflow-auto d-flex flex-column ${
            showMenu ? "navigation-visible" : "navigation-invisible"
          }`}
        >
          <div className="_p-4 d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={() => setShowMenu(!showMenu)}
            >
              &#10006;
            </button>
          </div>
          <div className="overflow-auto custom-scroll">
            {navigation.map((nav) => (
              <div
                className={`_p-4 navigation-item _text-center ${
                  nav.to.includes(pathname) ? "active" : ""
                }`}
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
        </div>
      </div>
      <div className="ml-auto d-flex align-items-center">
        <LocaleSelect locale={locale} setLocale={setLocale} />
        {(isCleaner() || isDryCleaner()) && myUser?.rating && (
          <h3 className="_mb-0 min-width-max-content">
            <span className="badge">⭐ {myUser.rating}</span>
          </h3>
        )}
        <button
          className={`btn btn-danger text-nowrap ${!myUser ? "_ml-3" : ""}`}
          onClick={onLogOut}
        >
          {t("admin_log_out_button")}
        </button>
      </div>
    </header>
  );
};
