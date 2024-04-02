import React, { useContext, useState } from "react";
import { login } from "./action";
import { USER_DATA_LOCAL_STORAGE_KEY } from "../../constants";

import "./Login.css";
import { LocaleContext } from "../../contexts";
import LocaleSelect from "../../components/LocaleSelect/LocaleSelect";

const Login = ({ setIsLoggedIn, locale, setLocale }) => {
  const { t } = useContext(LocaleContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoginLoading(true);
      setLoginError("");

      const userData = await login({ email, password });

      localStorage.setItem(
        USER_DATA_LOCAL_STORAGE_KEY,
        JSON.stringify(userData)
      );

      setIsLoggedIn(true);
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      <div className="locales-wrapper">
        <LocaleSelect locale={locale} setLocale={setLocale} />
      </div>
      <form onSubmit={onLogin}>
        <div className="centered d-flex flex-column align-items-center justify-content-center login-wrapper">
          <h2 className="mb-4">{t("admin_login_title")}</h2>
          <div className="mb-3 d-flex flex-column align-items-center w-100">
            <label className="mb-2">{t("admin_login_email")}:</label>
            <input
              className="form-control"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
            />
          </div>
          <div className="d-flex flex-column align-items-center w-100">
            <label className="mb-2">{t("admin_login_password")}:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                aria-label="Amount (to the nearest dollar)"
                value={password}
                onChange={({ target: { value } }) => setPassword(value)}
              />
              <div
                className="input-group-append _cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="input-group-text">&#128065;</span>
              </div>
            </div>
          </div>
          {loginError && <div className="mt-2 text-danger">{loginError}</div>}
          <button
            className={`btn btn-primary mt-3 d-flex align-items-center login-button ${
              isLoginLoading ? "loading" : ""
            }`}
            disabled={!email || !password || isLoginLoading}
            type="submit"
          >
            {t("admin_login_button")}
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
