import React, { useContext, useState } from "react";
import { login } from "./action";

import "./Login.scss";
import { LocaleContext } from "../../contexts";
import LocaleSelect from "../../components/LocaleSelect/LocaleSelect";

import { ReactComponent as PasswordShowedIcon } from "../../assets/icons/eye.svg";
import { ReactComponent as PasswordHiddenIcon } from "../../assets/icons/eye-crossed.svg";

const Login = ({ getUserData, locale, setLocale }) => {
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

      await login({ email, password });
      await getUserData();
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="locales-wrapper">
        <LocaleSelect locale={locale} setLocale={setLocale} />
      </div>
      <form onSubmit={onLogin}>
        <div
          className={`centered d-flex flex-column align-items-center
         justify-content-center _w-full lg:_w-max _px-4 lg:_px-0`}
        >
          <span className="_mb-2 _text-xl lg:_text-2xl _text-center">
            {t("nice_to_see_you_in")}{" "}
            <span className="_font-semibold _text-primary">
              Take Your Time!
            </span>
          </span>
          <span className="login-subtitle _text-lg lg:_text-xl _text-center _mb-6">
            {t("log_in_to_your_account")}
          </span>
          <div className="_mb-6 d-flex flex-column w-100">
            <label className="_mb-2 _text-sm">{t("admin_login_email")}:</label>
            <input
              autoFocus
              className="login-input"
              value={email}
              onChange={({ target: { value } }) => {
                setLoginError("");
                setEmail(value);
              }}
            />
          </div>
          <div className="d-flex flex-column w-100">
            <label className="_mb-2 _text-sm">
              {t("admin_login_password")}:
            </label>
            <div className="_relative">
              <input
                type={showPassword ? "text" : "password"}
                className="login-input _w-full password"
                aria-label="Amount (to the nearest dollar)"
                value={password}
                onChange={({ target: { value } }) => {
                  setLoginError("");
                  setPassword(value);
                }}
              />
              <div
                className={`show-password-icon _absolute _top-0 _flex _items-center
                 _justify-center _cursor-pointer _w-12 _h-full _right-0`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <PasswordShowedIcon className="_w-4 _h-4" />
                ) : (
                  <PasswordHiddenIcon className="_w-4 _h-4" />
                )}
              </div>
            </div>
          </div>
          <button
            className={`btn btn-primary _mt-12 _w-64 _text-center ${
              isLoginLoading ? "loading" : ""
            }`}
            disabled={!email || !password || isLoginLoading}
            type="submit"
          >
            {t("admin_login_button")}
          </button>
          <div
            className={`mt-2 text-danger ${
              loginError ? "_visible" : "_invisible"
            }`}
          >
            {loginError || "Error"}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
