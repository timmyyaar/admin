import React, { useContext } from "react";
import { AppContext } from "../../contexts";
import { ROLES } from "../../constants";

function Price({
  t,
  price,
  total_service_price,
  price_original,
  total_service_price_original,
  promo,
}) {
  const {
    userData: { role },
  } = useContext(AppContext);
  const isAdmin = role === ROLES.ADMIN;

  return (
    <>
      {isAdmin ? (
        <>
          <p className="card-text">
            💵 {t("admin_order_price")}: {price_original} zl
            {price_original !== total_service_price_original &&
              `, ${t(
                "admin_order_total_price"
              )}: ${total_service_price_original} zl`}
          </p>
          {price !== price_original && (
            <p className="card-text">
              💸 {t("admin_order_price_with_discount")}: {price} zl
              {promo ? ` (${promo})` : null}
              {price !== total_service_price &&
                `, ${t(
                  "admin_order_total_price_with_discount"
                )}: ${total_service_price} zl`}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="card-text">
            💵 {t("admin_order_price")}: {price} zl
            {price !== total_service_price &&
              `, ${t("admin_order_total_price")}: ${total_service_price} zl`}
          </p>
        </>
      )}
    </>
  );
}

export default Price;
